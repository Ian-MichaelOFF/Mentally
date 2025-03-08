const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

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

app.post("/guardar", (req, res) => {
  console.log("Datos recibidos:", req.body);
  const { Usuario, contraseña, Pregunta_seguridad, Respuesta } = req.body;

  const nuevoUsuario =
    "INSERT INTO alumnos (Usuario, contraseña, Pregunta_seguridad,Respuesta) VALUES (?, ?, ?, ?)";

  conexion.query(
    nuevoUsuario,
    [Usuario, contraseña, Pregunta_seguridad, Respuesta],
    (err, result) => {
      if (err) {
        console.error("Error en la consulta:", err); // Imprime el error en la consola
        res.status(500).json({
          error: "Hubo un problema al guardar el usuario",
          detalles: err.message, // Incluir detalles del error
        });
      } else {
        res.json({ mensaje: "Usuario guardado correctamente" });
      }
    }
  );
});

app.listen(4000, () => {
  console.log("Servidor corriendo en http://localhost:4000");
});


