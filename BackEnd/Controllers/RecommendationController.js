const {
  ResultScan,
  ResultScanQuizUserAnswer,
  QuizUserAnswer,
  QuizOption,
  QuizQuestion,
  Ingredient,
  ResultScanIngredient,
  Product,
  ResultScanProduct,
  ResultScanAvoid,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

const getRecommendedIngredients = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("✅ userId:", userId);

    // --- STEP 1: Ambil hasil scan terakhir ---
    const resultScan = await ResultScan.findOne({
      where: { userId },
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    if (!resultScan) {
      return res.status(404).json({
        success: false,
        message: "No scan result found for this user",
      });
    }

    const resultScanId = resultScan.id;
    const skinTypeFromScan = resultScan.skinType || null;
    const acneCount = resultScan.acneCount ?? null;

    console.log("✅ resultScanId:", resultScanId);

    // --- STEP 2: Ambil jawaban quiz ---
    const quizAnswersRaw = await ResultScanQuizUserAnswer.findAll({
      where: { resultScanId },
      include: [
        {
          model: QuizUserAnswer,
          where: { userId },
          include: [
            {
              model: QuizOption,
              as: "quizOption",
              attributes: ["title"],
              include: [
                {
                  model: QuizQuestion,
                  as: "quizQuestion",
                  attributes: ["quizQuestion"],
                },
              ],
            },
          ],
        },
      ],
      raw: true,
      nest: true,
    });

    if (!quizAnswersRaw.length) {
      return res.status(404).json({
        success: false,
        message: "No quiz answers found for this user.",
      });
    }

    const answerByQuestion = {};
    quizAnswersRaw.forEach((row) => {
      const question =
        row.QuizUserAnswer?.quizOption?.quizQuestion?.quizQuestion;
      const answer = row.QuizUserAnswer?.quizOption?.title;

      if (question && answer) {
        answerByQuestion[question] = answer;
      }
    });

    // --- STEP 3: Score mapping ---
    const scoreMap = {
      Normal: 95,
      Oily: 70,
      Dry: 70,
      Combination: 75,
      "I don’t know": 40,
      Yes_q2: 40,
      Sometimes_q2: 87,
      No_q2: 95,
      "Tight and dry": 60,
      Normal_q3: 95,
      "Greasy and Heavy": 60,
      Yes_q4: 40,
      Sometimes_q4: 87,
      No_q4: 95,
      "Very Often": 40,
      Often: 55,
      Sometimes_q5: 80,
      Rarely: 95,
      "12 or Younger": 95,
      "13-22": 95,
      "23-29": 90,
      "30-39": 85,
      "40 or Older": 80,
      Everyday: 95,
      "4-5 a Weeks": 70,
      "I don't use Skincare": 40,
      Yes_q8: 70,
      No_q8: 95,
      Yes_q10: 95,
      No_q10: 70,
    };

    const s = (answer, key) =>
      scoreMap[`${answer}${key ? "_" + key : ""}`] || scoreMap[answer] || 0;

    const q1 = s(answerByQuestion["What’s your skin type?"]);
    const q2 = s(
      answerByQuestion["Does your skin feels oily in the t-zone"],
      "q2"
    );
    const q3 = s(
      answerByQuestion["When you apply moisturizer, your skin feels"],
      "q3"
    );
    const q4 = s(
      answerByQuestion["Does your skin have dry flakey patches?"],
      "q4"
    );
    const q5 = s(
      answerByQuestion["How often do you experience breakouts or pimples?"],
      "q5"
    );
    const q6 = s(answerByQuestion["What’s your age range?"]);
    const q7 = s(answerByQuestion["How often do you use skincare everyday?"]);
    const q8 = s(answerByQuestion["Do you have sensitive skin?"], "q8");
    const q10 = s(answerByQuestion["Do you use sunscreen daily?"], "q10");

    let acneScore = 0;
    if (acneCount === 0) acneScore = 95;
    else if (acneCount <= 5) acneScore = 80;
    else if (acneCount <= 10) acneScore = 60;
    else if (acneCount <= 15) acneScore = 40;
    else acneScore = 20;

    const sum = q1 + q2 + q3 + q4 + q5 + q6 + q7 + q8 + q10 + acneScore;
    const finalScore = sum / 10;

    console.log("🎯 FINAL SCORE:", finalScore);

    await ResultScan.update(
      { score: finalScore },
      { where: { id: resultScanId } }
    );

    // --- STEP 4: Analyze quiz answers ---
    const normalize = (s) => s?.toLowerCase().trim();
    const answersMap = {};
    Object.entries(answerByQuestion).forEach(([q, a]) => {
      answersMap[normalize(q)] = a;
    });

    const isSensitive =
      answersMap[normalize("do you have sensitive skin?")]?.includes("Yes") ||
      false;
    const usesSunscreen =
      answersMap[normalize("do you use sunscreen daily?")]?.includes("Yes") ||
      false;
    const isPregnancy =
      answersMap[
        normalize("are you currently pregnant and breastfeeding?")
      ]?.includes("Yes") || false;
    const normalizedSkinType = skinTypeFromScan
      ? skinTypeFromScan.charAt(0).toUpperCase() +
        skinTypeFromScan.slice(1).toLowerCase()
      : null;

    const ageRange = answersMap[normalize("what’s your age range?")] || "";
    let mainConcern =
      answersMap[normalize("what is your main skin concern?")] || "General";

    console.log("answersMap:", answersMap);
    console.log(
      "isSensitive:",
      isSensitive,
      "isPregnancy:",
      isPregnancy,
      "mainConcern:",
      mainConcern,
      "normalizedSkinType:",
      normalizedSkinType,
      "ageRange:",
      ageRange
    );

    // Mapping main concern
    let normalizedConcern = [];

    const mainNorm = normalize(mainConcern);
    if (mainNorm.includes("no concern")) normalizedConcern.push("general");
    else if (mainNorm.includes("acne scars"))
      normalizedConcern.push("acne_scars");
    else if (mainNorm.includes("acne")) normalizedConcern.push("acne");
    else if (mainNorm.includes("dull skin")) normalizedConcern.push("dullness");
    else if (mainNorm.includes("wrinkles")) normalizedConcern.push("aging");
    else if (mainNorm.includes("hyperpigmentation"))
      normalizedConcern.push("pigmentation");
    else normalizedConcern.push("general");

    if (acneCount > 10 && !normalizedConcern.includes("acne")) {
      normalizedConcern.push("acne");
    }

    if (ageRange.includes("40")) {
      normalizedConcern.push("aging");
    }

    if (usesSunscreen) {
      normalizedConcern.push("sunscreen");
    }

    normalizedConcern = [...new Set(normalizedConcern)];

    console.log("normalizedConcern after adjustments:", normalizedConcern);

    const concernToTags = {
      acne: [
        "bha",
        "salicylic-acid",
        "niacinamide",
        "zinc",
        "anti-bacterial",
        "anti-acne",
        "acne-treatment",
        "oil-control",
        "anti-inflammatory",
      ],

      dryness: [
        "hydration",
        "hydrating",
        "humectant",
        "hyaluronic-acid",
        "urea",
        "barrier-repair",
        "moisturizing",
        "soothing",
        "ceramides",
      ],

      oily: ["oil-control", "sebum-regulation", "anti-inflammatory", "bha"],

      dullness: [
        "brightening",
        "aha",
        "pha",
        "exfoliation",
        "anti-oxidant",
        "vitamin-c",
      ],

      acne_scars: [
        "cell-turnover",
        "collagen",
        "niacinamide",
        "vitamin-c",
        "peptides",
        "scar-healing",
        "hydration",
      ],

      aging: [
        "anti-aging",
        "cell-turnover",
        "peptides",
        "collagen",
        "retinol",
        "vitamin-a",
        "vitamin-c",
        "vitamin-e",
        "anti-oxidant",
      ],

      sensitive: [
        "soothing",
        "reduce-irritation",
        "reduces-irritation",
        "reduce-redness",
        "barrier-repair",
        "centella-asiatica",
      ],

      pigmentation: [
        "brightening",
        "anti-darkspot",
        "vitamin-c",
        "tranexamic-acid",
        "arbutin",
        "cell-turnover",
        "anti-oxidant",
      ],

      sunscreen: [
        "spf",
        "sun-protection",
        "zinc-oxide",
        "vitamin-e",
        "anti-oxidant",
      ],
    };

    const concernAvoidTags = {
      acne: ["comedogenic", "heavy", "cause-acne", "cause-fungal-acne"],

      dryness: [
        "alcohol",
        "worsen-dryskin",
        "exfoliant",
        "salicylic-acid",
        "surfactant",
      ],

      oily: ["heavy", "comedogenic", "worsen-oilyskin"],

      sensitive: [
        "fragrance",
        "alcohol",
        "cause-irritation",
        "essential-oil",
        "worsen-eczema",
        "cause-eczema",
      ],

      acne_scars: ["comedogenic", "cause-irritation"],

      pregnancy: ["retinol", "retinoid"],
    };

    const skinTypeAvoidTags = {
      Dry: [
        "alcohol",
        "worsen-dryskin",
        "exfoliant",
        "salicylic-acid",
        "surfactant",
      ],

      Oily: ["heavy", "comedogenic", "cause-fungal-acne", "worsen-oilyskin"],

      Combination: ["heavy"],

      Normal: [],
    };

    const extraAvoidTags = {
      usesSunscreen: ["heavy"],

      ageOver40: ["exfoliant", "fragrance", "alcohol"],
    };

    const concernTags = concernToTags[normalizedConcern] || [];
    const avoidTags = [
      ...(concernAvoidTags[normalizedConcern] || []),
      ...(normalizedSkinType
        ? skinTypeAvoidTags[normalizedSkinType] || []
        : []),
      ...(isPregnancy ? concernAvoidTags.pregnancy : []),
      ...(isSensitive ? concernAvoidTags.sensitive : []),
      ...(usesSunscreen ? extraAvoidTags.usesSunscreen : []),
      ...(ageRange.includes("40") ? extraAvoidTags.ageOver40 : []),
    ];

    const uniqueAvoidTags = [...new Set(avoidTags)];

    // --- STEP 5: Build base ingredient query ---
    const ingredients = await Ingredient.findAll({
      where: {
        ...(isSensitive && { isSensitive: true }),
        ...(isPregnancy && { isPregnancySafe: true }),
        ...(skinTypeFromScan && {
          [Op.or]: [
            { skinTypes: { [Op.contains]: [skinTypeFromScan] } },
            { skinTypes: { [Op.contains]: ["all"] } },
          ],
        }),
      },
      attributes: [
        "id",
        "name",
        "isOily",
        "isSensitive",
        "isPregnancySafe",
        "weight",
        "skinTypes",
        "tags",
      ],
      raw: true,
    });

    const avoidIngredients = [];

    // --- STEP 6: Score ingredients ---
    const ingredientScores = ingredients.map((ingredient) => {
      let score = 0;

      console.log(`\n========================================`);
      console.log(`🧪 Evaluating: ${ingredient.name}`);
      console.log(`========================================`);

      const ingredientTags = (ingredient.tags || [])
        .map((t) => t.toLowerCase().trim())
        .filter(Boolean);

      console.log(`📋 Ingredient tags:`, ingredientTags);

      // Skin type match
      if (
        skinTypeFromScan &&
        (ingredient.skinTypes?.includes(skinTypeFromScan) ||
          ingredient.skinTypes?.includes("all"))
      ) {
        score += 3;
        console.log(`✅ Skin type match (${skinTypeFromScan}): +3`);
      } else {
        console.log(`❌ No skin type match`);
      }

      console.log(`📊 Current score: ${score}`);

      // Concern tags match
      const matchedTags = concernTags.filter((t) => ingredientTags.includes(t));
      // score += matchedTags.length * 5;
      if (matchedTags.length > 0) {
        const points = matchedTags.length * 5;
        score += points;
        console.log(
          `✅ Concern tags matched [${matchedTags.join(", ")}]: +${points}`
        );
      } else {
        console.log(`❌ No concern tags matched`);
      }

      console.log(`📊 Current score: ${score}`);

      // Sensitive bonus
      // if (isSensitive && ingredient.isSensitive) score += 2;
      if (isSensitive && ingredient.isSensitive) {
        score += 2;
        console.log(`✅ Sensitive safe: +2`);
        console.log(`📊 Current score: ${score}`);
      }

      // Age bonus
      // if (ageRange.includes("40") && ingredientTags.includes("anti-aging"))
      //   score += 3;
      if (ageRange.includes("40") && ingredientTags.includes("anti-aging")) {
        score += 3;
        console.log(`✅ Age 40+ anti-aging: +3`);
        console.log(`📊 Current score: ${score}`);
      }

      // Sunscreen bonus
      // if (usesSunscreen && ingredientTags.includes("spf")) score += 2;
      if (usesSunscreen && ingredientTags.includes("spf")) {
        score += 2;
        console.log(`✅ Sunscreen with SPF: +2`);
        console.log(`📊 Current score: ${score}`);
      }

      // Avoid tags penalty
      // const matchedAvoidTags = avoidTags.filter((t) =>
      //   ingredientTags.includes(t)
      // );

      // if (matchedAvoidTags.length > 0) {
      //   avoidIngredients.push({
      //     id: ingredient.id,
      //     name: ingredient.name,
      //     reasons: matchedAvoidTags,
      //   });
      // }

      // if (matchedAvoidTags.length > 0) {
      //   const penaltyMultiplier = acneCount <= 5 ? 0.5 : 1;
      //   score -= matchedAvoidTags.length * 10 * penaltyMultiplier;
      //   console.log(
      //     `Avoid tags matched [${matchedAvoidTags.join(", ")}] (-${
      //       matchedAvoidTags.length * 10
      //     })`
      //   );
      // }

      // return { ...ingredient, score, matchedAvoidTags };

      const matchedAvoidTags = avoidTags.filter((t) =>
        ingredientTags.includes(t)
      );

      if (matchedAvoidTags.length > 0) {
        avoidIngredients.push({
          id: ingredient.id,
          name: ingredient.name,
          reasons: matchedAvoidTags,
        });

        const penaltyMultiplier = acneCount <= 5 ? 0.5 : 1;
        const penalty = matchedAvoidTags.length * 10 * penaltyMultiplier;
        score -= penalty;

        console.log(
          `⚠️ Avoid tags matched [${matchedAvoidTags.join(", ")}]: -${penalty}`
        );
        console.log(
          `   (Penalty multiplier: ${penaltyMultiplier}x for acne count: ${acneCount})`
        );
      } else {
        console.log(`✅ No avoid tags found`);
      }

      console.log(`\n🎯 FINAL SCORE: ${score}`);
      console.log(`========================================\n`);

      return { ...ingredient, score, matchedAvoidTags };
    });

    console.log(`\n\n🏆 ========== RANKING RESULTS ==========`);
    ingredientScores
      .sort((a, b) => b.score - a.score)
      .forEach((ing, index) => {
        console.log(`${index + 1}. ${ing.name} - Score: ${ing.score}`);
      });
    console.log(`========================================\n`);

    const filteredIngredients = ingredientScores.filter(
      (ing) => ing.matchedAvoidTags.length === 0
    );

    const recommendedIngredients = filteredIngredients
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const recommendedIds = recommendedIngredients.map((i) => i.id);

    const allIngredients = await Ingredient.findAll({
      attributes: ["id", "name", "tags"],
      raw: true,
    });

    const globalAvoidIngredients = allIngredients
      .map((ingredient) => {
        const ingredientTags = (ingredient.tags || [])
          .map((t) => t.toLowerCase().trim())
          .filter(Boolean);

        const matchedAvoidTags = uniqueAvoidTags.filter((tag) =>
          ingredientTags.includes(tag)
        );

        if (matchedAvoidTags.length > 0) {
          return {
            id: ingredient.id,
            name: ingredient.name,
            reasons: matchedAvoidTags,
          };
        }

        return null;
      })
      .filter(Boolean);

    const finalAvoidIngredients = globalAvoidIngredients
      .filter((ing) => !recommendedIds.includes(ing.id))
      .sort((a, b) => b.reasons.length - a.reasons.length)
      .slice(0, 5);

    await ResultScanIngredient.bulkCreate(
      recommendedIngredients.map((ing) => ({
        resultScan_id: resultScanId,
        ingredients_id: ing.id,
        score: ing.score,
      }))
    );

    // --- STEP 7: Recommend products ---
    const bestProducts = await Product.findAll({
      include: [
        {
          model: Ingredient,
          as: "Ingredients",
          attributes: [],
          where: { id: { [Op.in]: recommendedIds } },
          through: { attributes: [] },
        },
      ],
      attributes: [
        "id",
        "productName",
        "productType",
        "productBrand",
        "productImage",
        [
          sequelize.fn("COUNT", sequelize.col("Ingredients.id")),
          "matchedIngredients",
        ],
      ],
      group: ["Product.id"],
      having: sequelize.literal(
        `COUNT("Ingredients->ProductIngredient"."ingredients_id") >= 2`
      ),
      order: [[sequelize.fn("COUNT", sequelize.col("Ingredients.id")), "DESC"]],
      raw: true,
      nest: true,
    });

    const filteredProducts = bestProducts.filter((prod) => {
      const ingredientsInProduct = prod.Ingredients || [];

      const ingredientTags = ingredientsInProduct.flatMap(
        (ing) => ing.tags || []
      );

      const hasAvoidTag = ingredientTags.some((tag) =>
        matchedAvoidTags.includes(tag)
      );

      return !hasAvoidTag;
    });

    // --- STEP 8: Filter 1 produk per productType ---
    const selectedTypes = new Set();
    const finalRecommendations = [];

    for (const prod of filteredProducts) {
      const type = prod.productType
        ? prod.productType.toLowerCase().trim()
        : `type-${prod.id}`;
      if (!selectedTypes.has(type)) {
        selectedTypes.add(type);
        finalRecommendations.push(prod);
      }
    }

    await ResultScanProduct.bulkCreate(
      finalRecommendations.map((p) => ({
        resultScan_id: resultScanId,
        product_id: p.id,
      }))
    );

    if (finalAvoidIngredients.length > 0) {
      await ResultScanAvoid.bulkCreate(
        finalAvoidIngredients.map((ing) => ({
          resultScan_id: resultScanId,
          name: ing.name,
          reasons: ing.reasons || [],
        }))
      );
    }

    res.json({
      success: true,
      userSkinType: skinTypeFromScan || "Unknown",
      mainConcern,
      finalScore,
      recommendedIngredients,
      recommendedProducts: finalRecommendations,
      avoidIngredients: finalAvoidIngredients,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

module.exports = { getRecommendedIngredients };
