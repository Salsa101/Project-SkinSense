import db from '../config/db.js';  // adjust path to your db connection

export const getRecommendedIngredients = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user's quiz answers
    const quizAnswers = await db.query(`
      SELECT a.quizoptionid, q.quizquestionid
      FROM "QuizUserAnswers" a
      JOIN "QuizOptions" q ON a.quizoptionid = q.id
      WHERE a.userid = $1
    `, [userId]);

    // Fetch latest scan result
    const scanResult = await db.query(`
      SELECT skintype, severity
      FROM "ResultScans"
      WHERE userid = $1
      ORDER BY createdate DESC
      LIMIT 1
    `, [userId]);

    // Determine if sensitive filter applies
    const sensitiveFilter = quizAnswers.rows.some(
      ans => ans.quizoptionid === 4 && ans.quizquestionid === 4
    );

    // Build base query for skincare ingredients
    let ingredientQuery = `
      SELECT *
      FROM "SkincareIngredients"
      WHERE TRUE
    `;

    // Filter for sensitive ingredients if required
    if (sensitiveFilter) {
      ingredientQuery += ` AND "isSensitive" = TRUE`;
    }

    // Optional: filter based on skin type from scan
    if (scanResult.rows.length > 0) {
      ingredientQuery += ` AND $1 = ANY("skinTypes")`;
    }

    // Execute query
    const ingredients = await db.query(ingredientQuery, [scanResult.rows[0]?.skintype]);

    res.json({
      success: true,
      data: ingredients.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};
