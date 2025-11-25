const db = require("../config/db.js");

const getRecommendedIngredients = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("✅ userId:", userId);

    const resultScan = await db.query(
      `
      SELECT id
      FROM "ResultScans"
      WHERE "userId" = $1
      ORDER BY "createdAt" DESC
      LIMIT 1;
      `,
      {
        bind: [userId],
        type: db.QueryTypes.SELECT,
      }
    );

    if (!resultScan.length) {
      return res.status(404).json({
        success: false,
        message: "No scan result found for this user",
      });
    }

    const resultScanId = resultScan[0].id;
    console.log("✅ resultScanId:", resultScanId);

    const quizAnswers = await db.query(
      `
      SELECT 
        qq."quizQuestion", 
        qo."title" AS "answerTitle"
      FROM "ResultScanQuizUserAnswer" rsqa
      JOIN "QuizUserAnswers" qua ON rsqa."quizUserAnswerId" = qua.id
      JOIN "QuizOptions" qo ON qua."quizOptionId" = qo.id
      JOIN "QuizQuestions" qq ON qo."quizQuestionId" = qq.id
      WHERE rsqa."resultScanId" = $1
      AND qua."userId" = $2;
      `,
      {
        bind: [resultScanId, userId],
        type: db.QueryTypes.SELECT,
      }
    );

    // --- STEP X: Score Mapping for Final Score Calculation ---
    const scoreMap = {
      // Q1 – Skin Type
      Normal: 95,
      Oily: 60,
      Dry: 40,
      Combination: 70,
      "I don’t know": 50,

      // Q2 – Oily T-zone
      Yes_q2: 60,
      Sometimes_q2: 50,
      No_q2: 95,

      // Q3 – Skin after moisturizer
      "Tight and dry": 40,
      Normal_q3: 95,
      "Greasy and Heavy": 50,

      // Q4 – Acne triggers
      Yes_q4: 40,
      Sometimes_q4: 60,
      No_q4: 95,

      // Q5 – Frequency breakout
      "Very Often": 40,
      Often: 50,
      Sometimes_q5: 60,
      Rarely: 95,

      // Q6 – Age
      "12 or Younger": 80,
      "13-22": 80,
      "23-29": 95,
      "30-39": 75,
      "40 or Older": 65,

      // Q7 – Skincare routine frequency
      Everyday: 95,
      "4-5 a Weeks": 70,
      "I don't use Skincare": 40,

      // Q8 – Sensitive skin?
      Yes_q8: 40,
      No_q8: 95,

      // Q10 – Sunscreen usage
      Yes_q10: 95,
      No_q10: 50,
    };

    // Make lookup by question
    const answerByQuestion = {};
    quizAnswers.forEach((qa) => {
      answerByQuestion[qa.quizQuestion] = qa.answerTitle;
    });

    // console.log("🧪 MAPPED QUIZ ANSWERS:", answerByQuestion);

    if (quizAnswers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No quiz answers found for this user.",
      });
    }

    // --- STEP 2: Fetch latest skin scan result ---
    const scanResult = await db.query(
      `
      SELECT "skinType", "severity", "acneCount", "score"
      FROM "ResultScans"
      WHERE "userId" = $1
      ORDER BY "createdAt" DESC
      LIMIT 1
    `,
      {
        bind: [userId],
        type: db.QueryTypes.SELECT,
      }
    );

    console.log("✅ scanResult:", scanResult);

    const skinTypeFromScan = scanResult[0]?.skinType || null;
    const severity = scanResult[0]?.severity ?? null;
    const acneCount = scanResult[0]?.acneCount ?? null;

    // Helper getScore
    const s = (answer, key) =>
      scoreMap[`${answer}${key ? "_" + key : ""}`] || scoreMap[answer] || 0;

    // Q1
    const q1 = s(answerByQuestion["What’s your skin type?"]);

    // Q2
    const q2 = s(
      answerByQuestion["Does your skin feels oily in the t-zone"],
      "q2"
    );

    // Q3
    const q3 = s(
      answerByQuestion["When you apply moisturizer, your skin feels"],
      "q3"
    );

    // Q4
    const q4 = s(
      answerByQuestion["Does your skin have dry flakey patches?"],
      "q4"
    );

    // Q5
    const q5 = s(
      answerByQuestion["How often do you experience breakouts or pimples?"],
      "q5"
    );

    // Q6
    const q6 = s(answerByQuestion["What’s your age range?"]);

    // Q7
    const q7 = s(answerByQuestion["How often do you use skincare everyday?"]);

    // Q8
    const q8 = s(answerByQuestion["Do you have sensitive skin?"], "q8");

    // Q10
    const q10 = s(answerByQuestion["Do you use sunscreen daily?"], "q10");

    // Acne Score (from scan)
    let acneScore = 0;

    if (acneCount === 0) acneScore = 95;
    else if (acneCount <= 5) acneScore = 80;
    else if (acneCount <= 15) acneScore = 60;
    else if (acneCount <= 30) acneScore = 40;
    else acneScore = 20;

    const sum = q1 + q2 + q3 + q4 + q5 + q6 + q7 + q8 + q10 + acneScore;
    const finalScore = sum / 10;

    console.log("🎯 FINAL SCORE:", finalScore);

    await db.query(
      `
    UPDATE "ResultScans"
    SET "score" = $1
    WHERE id = $2
  `,
      {
        bind: [finalScore, resultScanId],
        type: db.QueryTypes.UPDATE,
      }
    );

    // DEBUG: Print setiap skor dari jawaban user
    console.log("🔍 SCORE BREAKDOWN:");

    console.log(
      "Q1 (Skin type):",
      answerByQuestion["What’s your skin type?"],
      "=>",
      q1
    );
    console.log(
      "Q2 (T-zone oily):",
      answerByQuestion["Does your skin feels oily in the t-zone"],
      "=>",
      q2
    );
    console.log(
      "Q3 (After moisturizer):",
      answerByQuestion["When you apply moisturizer, your skin feels"],
      "=>",
      q3
    );
    console.log(
      "Q4 (Dry patches):",
      answerByQuestion["Does your skin have dry flakey patches?"],
      "=>",
      q4
    );
    console.log(
      "Q5 (Breakouts):",
      answerByQuestion["How often do you experience breakouts or pimples?"],
      "=>",
      q5
    );
    console.log(
      "Q6 (Age):",
      answerByQuestion["What’s your age range?"],
      "=>",
      q6
    );
    console.log(
      "Q7 (Skincare frequency):",
      answerByQuestion["How often do you use skincare everyday?"],
      "=>",
      q7
    );
    console.log(
      "Q8 (Sensitive skin):",
      answerByQuestion["Do you have sensitive skin?"],
      "=>",
      q8
    );
    console.log(
      "Q10 (Sunscreen):",
      answerByQuestion["Do you use sunscreen daily?"],
      "=>",
      q10
    );

    console.log("🟦 Acne Count:", acneCount, "=> acneScore:", acneScore);

    // --- STEP 3: Analyze quiz answers ---
    quizAnswers.sort((a, b) => a.id - b.id);

    const answersMap = {};

    const normalize = (str) => str.toLowerCase().trim();

    quizAnswers.forEach((a) => {
      answersMap[normalize(a.quizQuestion)] = a.answerTitle;
    });

    console.log("📋 quizAnswers:", quizAnswers);

    const isSensitive =
      answersMap[normalize("Do you have sensitive skin?")]
        ?.toLowerCase()
        .includes("yes") || false;
    const mainConcern =
      answersMap[normalize("What is your main skin concern?")] || "General";

    let normalizedConcern = mainConcern.toLowerCase().trim();

    if (normalizedConcern.includes("acne")) normalizedConcern = "acne";
    else if (normalizedConcern.includes("dull")) normalizedConcern = "dullness";
    else if (normalizedConcern.includes("wrinkle")) normalizedConcern = "aging";
    else if (normalizedConcern.includes("pigment"))
      normalizedConcern = "pigmentation";
    else normalizedConcern = "general"; // fallback

    const ageRange = answersMap[6] || "";
    const usesSunscreen = answersMap[10]?.includes("yes") || false;
    const isPregnancy = answersMap[11]?.includes("yes") || false;

    // --- STEP 4: Define concern → ingredient tags mapping ---
    const concernToTags = {
      acne: [
        "bha",
        "aha",
        "moisturizing",
        "anti-bacterial",
        "acne-treatment",
        "benzoyl peroxide",
      ],
      dryness: ["hydration", "humectant", "dry", "moisturizing"],
      oily: [
        "oil-control",
        "sebum-regulation",
        "anti-inflammatory",
        "aha",
        "bha",
      ],
      dullness: ["brightening", "aha", "exfoliation", "anti-oxidant"],
      aging: ["anti-aging", "cell-turnover", "peptides", "collagen"],
      sensitive: ["soothing", "fragrance-free"],
      pigmentation: ["brightening", "cell-turnover"],
      "sun damage": ["spf", "sun-protection", "vitamin-e", "zinc-oxide"],
    };

    // --- STEP 5: Build base ingredient query ---
    let ingredientQuery = `
      SELECT id, name, "isOily", "isSensitive", "weight", "skinTypes", "tags"
      FROM "Ingredients"
      WHERE TRUE
    `;

    // Filter for sensitive-safe ingredients if needed
    if (isSensitive) {
      ingredientQuery += ` AND "isSensitive" = TRUE`;
    }

    // pregnancy-safe filter
    if (isPregnancy) {
      ingredientQuery += ` AND "isPregnancySafe" = TRUE`;
    }

    // filter by skin type
    if (skinTypeFromScan) {
      ingredientQuery += ` AND ($1 = ANY("skinTypes") OR 'all' = ANY("skinTypes"))`;
    }

    // Execute query
    const ingredientsResult = await db.query(ingredientQuery, {
      bind: [skinTypeFromScan],
      type: db.QueryTypes.SELECT,
    });
    const ingredients = ingredientsResult;

    // --- STEP 6: Score ingredients based on quiz + concern relevance ---
    const concernTags = concernToTags[normalizedConcern] || [];

    console.log(`🧠 mainConcern: ${mainConcern}`);
    console.log(`🎯 normalizedConcern: ${normalizedConcern}`);
    console.log(`🔖 concernTags:`, concernTags);

    const ingredientScores = ingredients.map((ingredient) => {
      let score = 0;

      console.log(`\n🍃 Ingredient: ${ingredient.name}`);

      // Match by skin type
      // if (skinTypeFromScan && ingredient.skinTypes?.includes(skinTypeFromScan))
      //   score += 3;

      if (
        skinTypeFromScan &&
        (ingredient.skinTypes?.includes(skinTypeFromScan) ||
          ingredient.skinTypes?.includes("all"))
      ) {
        score += 3;
        console.log(`  ✅ Skin type match (+3)`);
      } else {
        console.log(`  ❌ Skin type no match`);
      }

      // Match by concern tags
      const matchedTags = concernTags.filter((t) =>
        ingredient.tags?.map((tag) => tag.toLowerCase()).includes(t)
      );
      // if (matchedTags.length > 0) score += matchedTags.length * 5;
      if (matchedTags.length > 0) {
        score += matchedTags.length * 5;
        console.log(
          `  ✅ Matched concern tags [${matchedTags.join(", ")}] (+${
            matchedTags.length * 5
          })`
        );
      } else {
        console.log(`  ❌ No matched concern tags`);
      }

      // Bonus for sensitive-safe
      // if (isSensitive && ingredient.isSensitive) score += 2;
      if (isSensitive && ingredient.isSensitive) {
        score += 2;
        console.log(`  ✅ Sensitive-safe bonus (+2)`);
      }

      // Bonus for age-related logic
      // if (ageRange.includes("40") && ingredient.tags.includes("anti-aging"))
      //   score += 3;
      if (ageRange.includes("40") && ingredient.tags?.includes("anti-aging")) {
        score += 3;
        console.log(`  ✅ Age-related bonus (+3)`);
      }

      // Bonus if user uses sunscreen and ingredient has SPF/antioxidant
      // if (usesSunscreen && ingredient.tags.includes("spf")) score += 2;
      if (usesSunscreen && ingredient.tags?.includes("spf")) {
        score += 2;
        console.log(`  ✅ Sunscreen bonus (+2)`);
      }

      console.log(`Total score: ${score}`);

      return { ...ingredient, score };
    });

    // Sort by descending score
    ingredientScores.sort((a, b) => b.score - a.score);

    // --- STEP 7: Return top recommendations ---
    // res.json({
    //   success: true,
    //   userSkinType: skinTypeFromScan || "Unknown",
    //   mainConcern,
    //   recommended: ingredientScores.slice(0, 5), // top 5
    // });

    // --- STEP 7: Return top recommendations ---
    const result = {
      success: true,
      userSkinType: skinTypeFromScan || "Unknown",
      mainConcern,
      recommended: ingredientScores.slice(0, 5), // top 5
    };

    console.log("🎯 Final Recommendation Result:");
    console.log(JSON.stringify(result, null, 2));

    // --- SAVE TOP 5 RECOMMENDATIONS TO ResultScanIngredients ---
    const recommendedIngredients = ingredientScores.slice(0, 5);

    const recommendedIds = recommendedIngredients.map((ing) => ing.id);

    for (const ing of recommendedIngredients) {
      await db.query(
        `
        INSERT INTO "ResultScanIngredients" 
          ("resultScan_id", "ingredients_id", "score", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, NOW(), NOW());
        `,
        {
          bind: [resultScanId, ing.id, ing.score],
          type: db.QueryTypes.INSERT,
        }
      );
    }

    console.log("💾 Saved recommended ingredients to ResultScanIngredients");

    // 1. Ambil produk yang match >= 3 ingredients
    const bestProducts = await db.query(
      `
      SELECT 
        p.id AS product_id,
        p."productName" AS productName,
        p."productType" AS productType,
        p."productBrand" AS productBrand,
        p."productImage" AS productImage,
        COUNT(pi."ingredients_id") AS matchedIngredients
      FROM "Products" p
      JOIN "ProductIngredients" pi ON p.id = pi.product_id
      WHERE pi."ingredients_id" = ANY($1)
      GROUP BY p.id, p."productName", p."productType", p."productBrand", p."productImage"
      HAVING COUNT(pi."ingredients_id") >= 3
      ORDER BY matchedIngredients DESC;
    `,
      {
        bind: [recommendedIds],
        type: db.QueryTypes.SELECT,
      }
    );

    console.log("📦 BEFORE FILTER:", bestProducts);

    // 2. Filter: hanya ambil 1 produk per productType
    const selectedTypes = new Set();
    const finalRecommendations = [];

    for (const prod of bestProducts) {
      const type = prod.productType
        ? prod.productType.trim().toLowerCase()
        : `type-${prod.product_id}`; // FIX DISINI

      if (!selectedTypes.has(type)) {
        selectedTypes.add(type);
        finalRecommendations.push(prod);
      }
    }

    console.log("🎯 FINAL RECOMMENDED:", finalRecommendations);

    // 3. Simpan FINAL RECOMMENDATIONS, bukan bestProducts
    for (const prod of finalRecommendations) {
      await db.query(
        `
    INSERT INTO "ResultScanProducts"
      ("resultScan_id", "product_id", "createdAt", "updatedAt")
    VALUES ($1, $2, NOW(), NOW());
    `,
        {
          bind: [resultScanId, prod.product_id],
          type: db.QueryTypes.INSERT,
        }
      );
    }

    console.log("💾 Saved recommended products to ResultScanProducts");

    result.recommendedProducts = bestProducts;
    result.finalScore = finalScore;

    res.json(result);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

module.exports = { getRecommendedIngredients };
