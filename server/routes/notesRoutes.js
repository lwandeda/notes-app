
const express = require("express");
const router = express.Router();

// Import the controller functions.
const {
    getAllNotes,
    createNote,
    updateNote,
    deleteNote
} = require("../controllers/notesController");

// GET /api/notes — retrieve all notes.
router.get("/", getAllNotes);

// POST /api/notes — create a new note.
router.post("/", createNote);

// PUT /api/notes/:id — update an existing note.
router.put("/:id", updateNote);

// DELETE /api/notes/:id — delete a note.
router.delete("/:id", deleteNote);

// Export the router.
module.exports = router;
