const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Cambia por el puerto de tu frontend
    credentials: true, // Permite el envío de cookies entre frontend y backend
  })
);
app.use(express.json());

app.use(
  session({
    secret: "mi_clave_secreta", // Cambia esto por algo más seguro
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2, // 2 horas de sesión
      sameSite: "lax", // O usa 'none' + https en producción
    },
  })
);

// Conexión a MySQL
const conexion = mysql.createConnection({
  host: "localhost",
  port: 3306,
  database: "usuarios",
  user: "IanCastellanos",
  password: "Mario311-", // Cambia por tu password si es necesario
});

conexion.connect((error) => {
  if (error) {
    console.error("Error al conectar a la base de datos:", error);
    return;
  }
  console.log("Conexión a la base de datos exitosa");
});

// -----------------------------------------------------
// Ruta para iniciar sesión
// -----------------------------------------------------
app.post("/login", (req, res) => {
  console.log("Datos recibidos en el backend:", req.body); // Este log debería mostrar los datos enviados
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "Campos incompletos" });
  }

  const query = "SELECT * FROM alumnos WHERE Usuario = ? AND contraseña = ?";

  conexion.query(query, [name, password], (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ message: "Error en el servidor" });
    }

    console.log("Resultados de la consulta SQL:", results); // Esto te ayudará a verificar los resultados
    if (results.length === 0) {
      return res
        .status(401)
        .json({ message: "Usuario o contraseña incorrectos" });
    }

    req.session.user = {
      id: results[0].id,
      Usuario: results[0].Usuario,
    };

    res.json({ message: "Inicio de sesión exitoso", user: req.session.user });
  });
});

// -----------------------------------------------------
// Ruta protegida para verificar si hay sesión activa
// -----------------------------------------------------
app.get("/session", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// -----------------------------------------------------
// Ruta para cerrar sesión
// -----------------------------------------------------
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error al cerrar sesión" });
    }
    res.clearCookie("connect.sid"); // Borra la cookie de sesión
    res.json({ message: "Sesión cerrada exitosamente" });
  });
});

// -----------------------------------------------------
// Inicia el servidor
// -----------------------------------------------------
app.listen(PORT, () => {
  console.log(`Servidor backend en http://localhost:${PORT}`);
});
