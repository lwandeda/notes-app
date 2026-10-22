
-- Create the notes table if it does not already exist.
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
        CHECK (length(trim(title)) > 0),
    content TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Update the modification timestamp whenever a note changes.
CREATE TRIGGER IF NOT EXISTS update_note_timestamp
AFTER UPDATE ON notes
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE notes
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;
