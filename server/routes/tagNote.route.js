import express from "express";
import { tagNote } from "../services/tagNote.service.js";
import AppError from "../utils/AppError.js";

const router = express.Router();

router.post("/tag-note", async (req, res, next) => {
  const { note } = req.body;

  // Request validation
  if (!note || typeof note !== "string") {
    return next(new AppError("note is required and must be a string", 400));
  }

  try {
    const tags = await tagNote(note);

    res.json({
      success: true,
      data: {
        tags,
      },
    });
  } catch (err) {
    next(err); // Global error handler devreye giriyor
  }
});

export default router;
