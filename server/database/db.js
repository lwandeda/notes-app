
const Database = require("better-sqlite3");
const fs = require("node:fs");
const path = require("node:path");

// Use Railway's persistent volume when deployed.
// Otherwise, use the local database folder.
const databaseDirectory = process.env.RAILWAY_VOLUME_MOUNT_PATH
    || __dirname;

// Make sure the database directory exists.
fs.mkdirSync(databaseDirectory, { recursive: true });

// Build the path to the SQLite database file.
const databasePath = path.join(databaseDirectory, "notes.db");

// Open the database, creating it if necessary.
const db = new Database(databasePath);

// Build the path to our SQL schema file.
const schemaPath = path.join(__dirname, "schema.sql");

// Read the schema file.
const schema = fs.readFileSync(schemaPath, "utf8");

// Create the table and trigger if they do not exist.
db.exec(schema);

// Export the database connection for other files.
module.exports = db;
