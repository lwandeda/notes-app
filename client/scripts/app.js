
/* ========================================
   MY NOTES APP
   Frontend JavaScript
   ======================================== */

// 1. Select the HTML elements we need.
const noteForm = document.querySelector("#note-form");
const titleInput = document.querySelector("#note-title");
const contentInput = document.querySelector("#note-content");
const notesList = document.querySelector("#notes-list");
const searchInput = document.querySelector("#search-notes");
const formMessage = document.querySelector("#form-message");
const currentYear = document.querySelector("#current-year");

// Store the notes loaded from our backend.
let notes = [];

// 2. Display the current year in the footer.
currentYear.textContent = new Date().getFullYear();

// 3. Load notes from the backend.
async function loadNotes() {
    try {
        const response = await fetch("/api/notes");

        if (!response.ok) {
            throw new Error("Could not load notes.");
        }

        const result = await response.json();

        notes = result.data;

        displayNotes(notes);
    } catch (error) {
        console.error("Error loading notes:", error);

        notesList.textContent = "Unable to load notes. Please try again.";
    }
}

// 4. Display notes on the webpage.
function displayNotes(notesToDisplay) {
    // Clear the previous contents.
    notesList.replaceChildren();

    // Show a message if there are no notes.
    if (notesToDisplay.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No notes found. Create your first note!";
        notesList.appendChild(message);
        return;
    }

   
    // Create a card for each note.
    notesToDisplay.forEach((note) => {
        const card = document.createElement("article");
        card.className = "note-card";

        const title = document.createElement("h3");
        title.textContent = note.title;

        const content = document.createElement("p");
        content.textContent = note.content || "No content added.";

        const date = document.createElement("p");
        date.className = "note-meta";
        date.textContent = `Last updated: ${note.updated_at}`;

        // Create the Edit button.
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
            editNote(note);
        });

        // Create the Delete button.
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", () => {
            deleteNote(note.id);
        });

        // Group the buttons together.
        const actions = document.createElement("div");
        actions.className = "note-actions";
        actions.append(editButton, deleteButton);

        // Add everything to the note card.
        card.append(title, content, date, actions);
        notesList.appendChild(card);
    });
}


// 5. Create a new note when the form is submitted.
noteForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const content = contentInput.value;

    // Check that the title is not empty.
    if (!title) {
        formMessage.textContent = "Please enter a note title.";
        formMessage.className = "error";
        titleInput.focus();
        return;
    }

    // Prevent repeated submissions while saving.
    const submitButton = noteForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    formMessage.textContent = "Saving your note...";
    formMessage.className = "";

    try {
        const response = await fetch("/api/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, content })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Could not save note.");
        }

        // Clear the form after a successful save.
        noteForm.reset();

        formMessage.textContent = "Note saved successfully!";
        formMessage.className = "";

        // Reload notes so the new note appears.
        await loadNotes();
    } catch (error) {
        console.error("Error saving note:", error);

        formMessage.textContent = error.message;
        formMessage.className = "error";
    } finally {
        // Allow the user to submit another note.
        submitButton.disabled = false;
    }
});

// 6. Search notes by title or content.
searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredNotes = notes.filter((note) => {
        return (
            note.title.toLowerCase().includes(searchTerm) ||
            note.content.toLowerCase().includes(searchTerm)
        );
    });

    displayNotes(filteredNotes);
});

// 7. Load saved notes when the page opens.
loadNotes();


/* ========================================
   EDIT AN EXISTING NOTE
   ======================================== */

async function editNote(note) {
    // Ask the user for an updated title.
    const newTitle = prompt("Edit note title:", note.title);

    // Cancel if the user presses Cancel.
    if (newTitle === null) {
        return;
    }

    // Ask the user for updated content.
    const newContent = prompt("Edit note content:", note.content);

    // Cancel if the user presses Cancel.
    if (newContent === null) {
        return;
    }

    // Make sure the title is not empty.
    if (!newTitle.trim()) {
        alert("The note title cannot be empty.");
        return;
    }

    try {
        // Send the updated note to the backend.
        const response = await fetch(`/api/notes/${note.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: newTitle.trim(),
                content: newContent
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to update note.");
        }

        alert("Note updated successfully!");

        // Reload the notes to show the changes.
        await loadNotes();
    } catch (error) {
        console.error("Error updating note:", error);
        alert(error.message);
    }
}

/* ========================================
   DELETE AN EXISTING NOTE
   ======================================== */

async function deleteNote(noteId) {
    // Ask the user to confirm deletion.
    const confirmed = confirm(
        "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
        return;
    }

    try {
        // Send the delete request to the backend.
        const response = await fetch(`/api/notes/${noteId}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to delete note.");
        }

        // Reload the notes after deletion.
        await loadNotes();

        formMessage.textContent = "Note deleted successfully!";
        formMessage.className = "";
    } catch (error) {
        console.error("Error deleting note:", error);
        alert(error.message);
    }
}
