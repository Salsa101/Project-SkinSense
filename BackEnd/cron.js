const cron = require("node-cron");
const { RoutineProduct } = require("./models");

// Schedule tiap jam 12 malam
cron.schedule("0 0 * * *", async () => {
  try {
    await RoutineProduct.update({ doneStatus: false }, { where: {} });
    console.log("[Cron Job] Reset doneStatus semua task ke false");
  } catch (err) {
    console.error("[Cron Job] Failed to reset doneStatus:", err);
  }
});

module.exports = cron;
