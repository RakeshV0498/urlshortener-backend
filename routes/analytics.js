// In your analyticsRouter.js or a separate file
import express from "express";
import { urlModel, userModel } from "../db-utils/models.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/daily-count", async (req, res) => {
  try {
    const user = await userModel.findOne({ id: req.userId });
    const dailyCounts = await urlModel.aggregate([
      {
        $match: { createdBy: user.id }, // Filter by createdBy field
      },
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
    const user = await userModel.findOne({ id: req.userId });
    const monthlyCounts = await urlModel.aggregate([
      {
        $match: { createdBy: user.id }, // Filter by createdBy field
      },
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
