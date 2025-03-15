const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const multer = require("multer");

const app = express();
const upload = multer();
const PORT = 8000;

// Conexión a la base de datos SQLite
const db = new sqlite3.Database("students.sqlite", (err) => {
    if (err) {
        console.error("Error al conectar con la base de datos:", err.message);
    } else {
        console.log("Conectado a la base de datos SQLite.");
    }
});

// Middleware para analizar los datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta para obtener y agregar estudiantes
app.route("/students")
    .get((req, res) => {
        db.all("SELECT * FROM students", [], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(rows);
            }
        });
    })
    .post(upload.none(), (req, res) => {
        const { firstname, lastname, gender, age } = req.body;
        const sql = "INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)";
        db.run(sql, [firstname, lastname, gender, age], function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: "Estudiante creado", id: this.lastID });
            }
        });
    });

// Ruta para manejar un estudiante específico por ID
app.route("/student/:id")
    .get((req, res) => {
        const { id } = req.params;
        db.get("SELECT * FROM students WHERE id = ?", [id], (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (row) {
                res.json(row);
            } else {
                res.status(404).json({ message: "Estudiante no encontrado" });
            }
        });
    })
    .put(upload.none(), (req, res) => {
        const { id } = req.params;
        const { firstname, lastname, gender, age } = req.body;
        const sql = "UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?";
        db.run(sql, [firstname, lastname, gender, age, id], function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: "Estudiante actualizado", id });
            }
        });
    })
    .delete((req, res) => {
        const { id } = req.params;
        const sql = "DELETE FROM students WHERE id = ?";
        db.run(sql, [id], function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: `Estudiante con ID ${id} eliminado` });
            }
        });
    });

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

