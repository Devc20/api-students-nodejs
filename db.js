const sqlite3 = require("sqlite3").verbose();

// Conectar a la base de datos
const db = new sqlite3.Database("students.sqlite");

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        gender TEXT NOT NULL,
        age TEXT
    )`);
    console.log("Tabla 'students' creada correctamente.");
});

db.close();

