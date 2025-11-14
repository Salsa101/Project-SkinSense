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

    if (quizAnswers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No quiz answers found for this user.",
      });
    }

    // --- STEP 2: Fetch latest skin scan result ---
    const scanResult = await db.query(
      `
      SELECT "skinType", "severity"
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
    const severity = scanResult[0]?.severity || null;

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
      acne: ["anti-acne", "niacinamide", "salicylic acid", "azelaic acid"],
      dryness: ["hydrating", "ceramide", "hyaluronic acid"],
      oily: ["oil-control", "niacinamide", "clay"],
      dullness: ["brightening", "vitamin c", "aha", "exfoliating"],
      aging: ["anti-aging", "retinol", "peptides", "collagen"],
      sensitive: ["soothing", "fragrance-free", "centella", "aloe vera"],
      pigmentation: [
        "brightening",
        "vitamin c",
        "licorice root",
        "alpha arbutin",
      ],
      "sun damage": ["spf", "antioxidant", "vitamin e"],
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


    // Optional: filter by skin type if available
    if (skinTypeFromScan) {
      ingredientQuery += ` AND $1 = ANY("skinTypes")`;
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
        ingredient.skinTypes?.includes(skinTypeFromScan)
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

    res.json(result);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

module.exports = { getRecommendedIngredients };
