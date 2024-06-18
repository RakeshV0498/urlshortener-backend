// In your urlRouter.js or a separate analyticsRouter.js
import express from "express";
import { urlModel } from "../db-utils/models.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/daily-count", async (req, res) => {
  try {
    const dailyCounts = await urlModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(
      dailyCounts.map((data) => ({ date: data._id, count: data.count }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

analyticsRouter.get("/monthly-count", async (req, res) => {
  try {
    const monthlyCounts = await urlModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(
      monthlyCounts.map((data) => ({ date: data._id, count: data.count }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default analyticsRouter;
