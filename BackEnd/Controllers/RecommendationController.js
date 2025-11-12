const db = require("../config/config.js");

const getRecommendedIngredients = async (req, res) => {
  try {
    const userId = req.user.id;

    const quizAnswers = await db.query(
      `
      SELECT q.quizquestionid, qq.quizquestion, o.optiontext
      FROM "QuizUserAnswers" a
      JOIN "QuizOptions" o ON a.quizoptionid = o.id
      JOIN "QuizQuestions" qq ON o.quizquestionid = qq.id
      JOIN "QuizOptions" q ON a.quizoptionid = q.id
      WHERE a.userid = $1
    `,
      [userId]
    );

    if (quizAnswers.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No quiz answers found for this user.",
      });
    }

    // --- STEP 2: Fetch latest skin scan result ---
    const scanResult = await db.query(
      `
      SELECT skintype, severity
      FROM "ResultScans"
      WHERE userid = $1
      ORDER BY createdate DESC
      LIMIT 1
    `,
      [userId]
    );

    const skinTypeFromScan = scanResult.rows[0]?.skintype || null;
    const severity = scanResult.rows[0]?.severity || null;

    // --- STEP 3: Analyze quiz answers ---
    const answersMap = {};
    quizAnswers.rows.forEach((ans) => {
      answersMap[ans.quizquestionid] = ans.optiontext?.toLowerCase();
    });

    const isSensitive = answersMap[8]?.includes("yes") || false;
    const mainConcern = answersMap[9] || "General";
    const ageRange = answersMap[6] || "";
    const usesSunscreen = answersMap[10]?.includes("yes") || false;

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
      SELECT id, name, description, tags, "skinTypes", "isSensitive"
      FROM "SkincareIngredients"
      WHERE TRUE
    `;

    // Filter for sensitive-safe ingredients if needed
    if (isSensitive) {
      ingredientQuery += ` AND "isSensitive" = TRUE`;
    }

    // Optional: filter by skin type if available
    if (skinTypeFromScan) {
      ingredientQuery += ` AND $1 = ANY("skinTypes")`;
    }

    // Execute query
    const ingredientsResult = await db.query(ingredientQuery, [
      skinTypeFromScan,
    ]);
    const ingredients = ingredientsResult.rows;

    // --- STEP 6: Score ingredients based on quiz + concern relevance ---
    const concernTags = concernToTags[mainConcern.toLowerCase()] || [];

    const ingredientScores = ingredients.map((ingredient) => {
      let score = 0;

      // Match by skin type
      if (skinTypeFromScan && ingredient.skinTypes?.includes(skinTypeFromScan))
        score += 3;

      // Match by concern tags
      const matchedTags = concernTags.filter((t) =>
        ingredient.tags?.map((tag) => tag.toLowerCase()).includes(t)
      );
      if (matchedTags.length > 0) score += matchedTags.length * 5;

      // Bonus for sensitive-safe
      if (isSensitive && ingredient.isSensitive) score += 2;

      // Bonus for age-related logic
      if (ageRange.includes("40") && ingredient.tags.includes("anti-aging"))
        score += 3;

      // Bonus if user uses sunscreen and ingredient has SPF/antioxidant
      if (usesSunscreen && ingredient.tags.includes("spf")) score += 2;

      return { ...ingredient, score };
    });

    // Sort by descending score
    ingredientScores.sort((a, b) => b.score - a.score);

    // --- STEP 7: Return top recommendations ---
    res.json({
      success: true,
      userSkinType: skinTypeFromScan || "Unknown",
      mainConcern,
      recommended: ingredientScores.slice(0, 5), // top 5
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

module.exports = { getRecommendedIngredients };
