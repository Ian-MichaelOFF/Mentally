const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Configuración de middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Configuración de sesión CORREGIDA
app.use(
  session({
    secret: "mi_clave_secreta", // En producción usa process.env.SESSION_SECRET
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2, // 2 horas
      sameSite: "lax",
    },
  })
);

// Conexión a MySQL con pool de conexiones
const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  database: "usuarios",
  user: "IanCastellanos",
  password: "Mario311-",
  connectionLimit: 10,
});

// Verificar conexión a la base de datos
pool.getConnection((error, connection) => {
  if (error) {
    console.error("Error al conectar a la base de datos:", error);
    return;
  }
  console.log("Conexión a la base de datos exitosa");
  connection.release();
});

// -----------------------------------------------------
// Ruta para iniciar sesión CORREGIDA (usa IDalumno)
// -----------------------------------------------------
app.post("/login", (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "Campos incompletos" });
  }

  // Consulta CORREGIDA usando IDalumno en lugar de id
  const query = "SELECT IDalumno, Usuario,Respuesta, Imagen FROM alumnos WHERE Usuario = ? AND contraseña = ?";

  pool.query(query, [name, password], (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ message: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    req.session.user = {
      IDalumno: results[0].IDalumno, // Usando IDalumno
      Usuario: results[0].Usuario,
    };

    res.json({ 
      message: "Inicio de sesión exitoso", 
      user: {
        IDalumno: results[0].IDalumno,
        Usuario: results[0].Usuario,
        Respuesta: results[0].Respuesta,
        Imagen: results[0].Imagen
      } 
    });
  });
});

// -----------------------------------------------------
// Ruta para obtener datos del alumno CORREGIDA
// -----------------------------------------------------
app.get("/api/alumno", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "No hay sesión activa" });
  }

  // Consulta CORREGIDA usando IDalumno
  const query = "SELECT IDalumno, Usuario,Respuesta, Imagen FROM alumnos WHERE Usuario = ?";
  
  pool.query(query, [req.session.user.Usuario], (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ message: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    res.json({
      IDalumno: results[0].IDalumno,
      Usuario: results[0].Usuario,
      Respuesta: results[0].Respuesta,
      Imagen: results[0].Imagen
    });
  });
});

// -----------------------------------------------------
// Ruta para actualizar imagen de perfil
// -----------------------------------------------------
app.put("/api/alumno", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const { imagen } = req.body;
  if (!imagen) {
    return res.status(400).json({ message: "Imagen no proporcionada" });
  }

  // Validar que la imagen esté en la lista permitida
  const imagenesPermitidas = ["rana.png", "cartoon-capybara.png", "memoria.png"];
  const nombreImagen = imagen.split('/').pop();
  
  if (!imagenesPermitidas.includes(nombreImagen)) {
    return res.status(400).json({ message: "Imagen no válida" });
  }

  const query = "UPDATE alumnos SET Imagen = ? WHERE Usuario = ?";
  
  pool.query(query, [nombreImagen, req.session.user.Usuario], (err, results) => {
    if (err) {
      console.error("Error al actualizar perfil:", err);
      return res.status(500).json({ message: "Error al actualizar perfil" });
    }
    
    res.json({ 
      message: "Perfil actualizado exitosamente",
      nuevaImagen: nombreImagen
    });
  });
});

// -----------------------------------------------------
// Ruta para cerrar sesión
// -----------------------------------------------------
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error al cerrar sesión" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Sesión cerrada exitosamente" });
  });
});

// -----------------------------------------------------
// Manejo de errores
// -----------------------------------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Algo salió mal!" });
});

// -----------------------------------------------------
// Inicia el servidor
// -----------------------------------------------------
app.listen(PORT, () => {
  console.log(`Servidor backend en http://localhost:${PORT}`);
});