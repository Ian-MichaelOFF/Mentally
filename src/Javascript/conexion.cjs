const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Configuración de Multer para manejar la carga de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

let conexion = mysql.createConnection({
  host: "localhost",
  database: "usuarios",
  user: "IanCastellanos",
  password: "Mario311-",
});

conexion.connect(function (error) {
  if (error) {
    throw error;
  } else {
    console.log("Conexión correcta");
  }
});

// Ruta para guardar alumnos (existente)
app.post("/guardar", (req, res) => {
  console.log("Datos recibidos:", req.body);
  const { Usuario, contraseña, Pregunta_seguridad, Respuesta } = req.body;

  const nuevoUsuario =
    "INSERT INTO alumnos (Usuario, contraseña, Pregunta_seguridad, Respuesta) VALUES (?, ?, ?, ?)";

  conexion.query(
    nuevoUsuario,
    [Usuario, contraseña, Pregunta_seguridad, Respuesta],
    (err, result) => {
      if (err) {
        console.error("Error en la consulta:", err);
        res.status(500).json({
          error: "Hubo un problema al guardar el usuario",
          detalles: err.message,
        });
      } else {
        res.json({ mensaje: "Usuario guardado correctamente" });
      }
    }
  );
});

// Nueva ruta para guardar maestros
app.post("/guardar-maestro", upload.single('imagen'), (req, res) => {
  console.log("Datos recibidos para maestro:", req.body);
  
  const { correo, contraseña, nombre, apellido, fechaNacimiento } = req.body;
  
  // Si no se subió imagen, usar un valor por defecto o cadena vacía
  const imagenPath = req.file ? req.file.path : 'default.jpg';

  const nuevoMaestro = `
    INSERT INTO maestros 
    (Correo, Contraseña, Imagen, Fecha, Nombre, Apellido) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  conexion.query(
    nuevoMaestro,
    [correo, contraseña, imagenPath, fechaNacimiento, nombre, apellido],
    (err, result) => {
      if (err) {
        console.error("Error en la consulta:", err);
        res.status(500).json({
          error: "Hubo un problema al guardar el maestro",
          detalles: err.message,
        });
      } else {
        res.json({ mensaje: "Maestro registrado correctamente" });
      }
    }
  );
});

app.listen(4000, () => {
  console.log("Servidor corriendo en http://localhost:4000");
});