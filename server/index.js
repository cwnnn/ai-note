import express from "express";
import cors from "cors";
import tagNoteRoute from "./routes/tagNote.route.js";
import bodyParser from "body-parser";
import notesRouter from "./routes/notes.js";
import errorHandler from "./middleware/errorHandler.js"; // <- yeni ek

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", tagNoteRoute);

app.use(bodyParser.json());
app.use("/notes", notesRouter);
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
