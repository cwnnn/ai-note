import express from "express";
import { getNotes, addNote, updateNote, deleteNote } from "../utils/notes.js";

const router = express.Router();

/* =======================
   GET ALL NOTES
======================= */
router.get("/", (req, res) => {
  res.json(getNotes());
});

/* =======================
   CREATE NOTE
======================= */
router.post("/", (req, res) => {
  const newNote = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags || [],

    status: "active",
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  res.status(201).json(addNote(newNote));
});

/* =======================
   UPDATE NOTE CONTENT
======================= */
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);

  const updatedNote = updateNote(id, {
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags,
    updatedAt: new Date(),
  });

  if (!updatedNote) {
    return res.status(404).json({ message: "Not bulunamadı." });
  }

  res.json(updatedNote);
});

/* =======================
   CHANGE STATUS
======================= */
router.patch("/:id/status", (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  if (!["active", "archived", "trashed"].includes(status)) {
    return res.status(400).json({ message: "Geçersiz status." });
  }

  const payload = {
    status,
    deletedAt: status === "trashed" ? new Date() : null,
    updatedAt: new Date(),
  };

  const note = updateNote(id, payload);

  if (!note) {
    return res.status(404).json({ message: "Not bulunamadı." });
  }

  res.json(note);
});

/* =======================
   PERMANENT DELETE
======================= */
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const notes = getNotes();

  const note = notes.find((n) => n.id === id);

  if (!note) {
    return res.status(404).json({ message: "Not bulunamadı." });
  }

  if (note.status !== "trashed") {
    return res
      .status(400)
      .json({ message: "Sadece çöpteki notlar silinebilir." });
  }

  deleteNote(id);
  res.json({ message: "Not kalıcı olarak silindi." });
});

export default router;
