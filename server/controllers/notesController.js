
const db = require("../database/db");

// Get all notes from the database.
function getAllNotes(req, res) {
    try {
        const notes = db.prepare(`
            SELECT id, title, content, created_at, updated_at
            FROM notes
            ORDER BY updated_at DESC, id DESC
        `).all();

        return res.status(200).json({
            success: true,
            count: notes.length,
            data: notes
        });
    } catch (error) {
        console.error("Error retrieving notes:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve notes."
        });
    }
}

// Create a new note in the database.
function createNote(req, res) {
    try {
        const { title, content = "" } = req.body;

        // Make sure the title is a non-empty string.
        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "A note title is required."
            });
        }

        // Make sure the content is text.
        if (typeof content !== "string") {
            return res.status(400).json({
                success: false,
                message: "Note content must be text."
            });
        }

        // Insert the new note safely into the database.
        const result = db.prepare(`
            INSERT INTO notes (title, content)
            VALUES (?, ?)
        `).run(title.trim(), content);

        // Retrieve the note that was just created.
        const note = db.prepare(`
            SELECT id, title, content, created_at, updated_at
            FROM notes
            WHERE id = ?
        `).get(result.lastInsertRowid);

        return res.status(201).json({
            success: true,
            data: note
        });
    } catch (error) {
        console.error("Error creating note:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create note."
        });
    }
}


/* ========================================
   UPDATE AN EXISTING NOTE
   ======================================== */

function updateNote(req, res) {
    try {
        // Get the note ID from the URL.
        const id = Number(req.params.id);

        // Get the updated title and content.
        const { title, content } = req.body;

        // Validate the note ID.
        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid note ID."
            });
        }

        // Validate the title.
        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "A note title is required."
            });
        }

        // Validate the content.
        if (typeof content !== "string") {
            return res.status(400).json({
                success: false,
                message: "Note content must be text."
            });
        }

        // Check whether the note exists.
        const existingNote = db.prepare(`
            SELECT id FROM notes WHERE id = ?
        `).get(id);

        if (!existingNote) {
            return res.status(404).json({
                success: false,
                message: "Note not found."
            });
        }

        // Update the note in the database.
        db.prepare(`
            UPDATE notes
            SET title = ?, content = ?
            WHERE id = ?
        `).run(title.trim(), content, id);

        // Retrieve the updated note.
        const updatedNote = db.prepare(`
            SELECT id, title, content, created_at, updated_at
            FROM notes
            WHERE id = ?
        `).get(id);

        return res.status(200).json({
            success: true,
            data: updatedNote
        });
    } catch (error) {
        console.error("Error updating note:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update note."
        });
    }
}

/* ========================================
   DELETE AN EXISTING NOTE
   ======================================== */

function deleteNote(req, res) {
    try {
        // Get the note ID from the URL.
        const id = Number(req.params.id);

        // Validate the note ID.
        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid note ID."
            });
        }

        // Delete the note from the database.
        const result = db.prepare(`
            DELETE FROM notes WHERE id = ?
        `).run(id);

        // Check whether a note was actually deleted.
        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting note:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete note."
        });
    }
}

module.exports = {
    getAllNotes,
    createNote,
    updateNote,
    deleteNote
};

