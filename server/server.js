
const express = require("express");
const path = require("node:path");

// Import our notes API routes.
const notesRoutes = require("./routes/notesRoutes");

// Import the database to initialize it when the server starts.
require("./database/db");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse incoming JSON request bodies.
app.use(express.json());

// Serve the frontend files from the client folder.
app.use(express.static(path.join(__dirname, "../client")));

// Connect the notes routes to the /api/notes URL.
app.use("/api/notes", notesRoutes);

// A simple health-check endpoint.
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Notes API is running."
    });
});

// Start the server.
// TEMPORARY DEBUG TEST
app.get("/api/notes/debug", (req, res) => {
    res.json({
        message: "Notes routes are connected correctly."
    });
});

// Start the server.
app.listen(PORT, () => {
    console.log(`Notes App running at http://localhost:${PORT}`);
});