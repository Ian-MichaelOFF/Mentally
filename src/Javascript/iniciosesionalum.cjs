const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Función para generar tokens (añade esto al inicio del archivo)
function generateToken() {
  return 'xxxx-xxxx-xxxx'.replace(/[x]/g, () => {
    return Math.floor(Math.random() * 16).toString(16);
  });
}

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
// RUTAS PARA MAESTROS
// -----------------------------------------------------

// Inicio de sesión para maestros
app.post("/login-maestro", (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ message: "Campos incompletos" });
  }

  const query = "SELECT IDmaestro, nombre, apellido, correo, Imagen FROM maestros WHERE correo = ? AND contraseña = ?";

  pool.query(query, [correo, contraseña], (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ message: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

    req.session.user = {
      IDmaestro: results[0].IDmaestro,
      correo: results[0].correo,
      tipo: "maestro" // Para diferenciar la sesión de alumno/maestro
    };

    res.json({ 
      message: "Inicio de sesión exitoso", 
      user: {
        IDmaestro: results[0].IDmaestro,
        nombre: results[0].nombre,
        apellido: results[0].apellido,
        correo: results[0].correo,
        Imagen: results[0].Imagen,
        Fecha: results[0].Fecha
      } 
    });
  });
});

// Verificar sesión de maestro
app.get("/session-maestro", (req, res) => {
  if (req.session.user && req.session.user.tipo === "maestro") {
    return res.json({ loggedIn: true, user: req.session.user });
  } else {
    return res.json({ loggedIn: false });
  }
});

// Obtener datos del maestro
app.get("/api/maestro", (req, res) => {
  if (!req.session.user || req.session.user.tipo !== "maestro") {
    return res.status(401).json({ message: "No hay sesión activa" });
  }

  const query = "SELECT IDmaestro, nombre, apellido, correo, Imagen,Fecha FROM maestros WHERE IDmaestro = ?";
  
  pool.query(query, [req.session.user.IDmaestro], (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ message: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Maestro no encontrado" });
    }

    res.json({
      IDmaestro: results[0].IDmaestro,
      nombre: results[0].nombre,
      apellido: results[0].apellido,
      correo: results[0].correo,
      Imagen: results[0].Imagen,
      Fecha: results[0].Fecha
    });
  });
});

// Actualizar imagen de perfil del maestro
app.put("/api/maestro", (req, res) => {
  if (!req.session.user || req.session.user.tipo !== "maestro") {
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

  const query = "UPDATE maestros SET Imagen = ? WHERE IDmaestro = ?";
  
  pool.query(query, [nombreImagen, req.session.user.IDmaestro], (err, results) => {
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
// RUTAS PARA GRUPOS (MAESTROS)
// -----------------------------------------------------

// Crear un nuevo grupo
app.post('/api/grupos', (req, res) => {
  if (!req.session.user || req.session.user.tipo !== "maestro") {
    return res.status(401).json({ message: "No autorizado" });
  }

  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ message: "Nombre del grupo es requerido" });
  }

  const token = generateToken();
  const query = "INSERT INTO grupos (nombre, token, maestro_id) VALUES (?, ?, ?)";

  pool.query(query, [nombre, token, req.session.user.IDmaestro], (err, results) => {
    if (err) {
      console.error("Error al crear grupo:", err);
      return res.status(500).json({ message: "Error al crear grupo" });
    }

    res.status(201).json({
      message: "Grupo creado exitosamente",
      grupo: {
        id: results.insertId,
        nombre,
        token
      }
    });
  });
});

// Obtener todos los grupos de un maestro
app.get('/api/grupos', (req, res) => {
  if (!req.session.user || req.session.user.tipo !== "maestro") {
    return res.status(401).json({ message: "No autorizado" });
  }

  const query = `
    SELECT g.id, g.nombre, g.token, g.fecha_creacion, 
           COUNT(ga.alumno_id) as total_alumnos
    FROM grupos g
    LEFT JOIN grupo_alumnos ga ON g.id = ga.grupo_id
    WHERE g.maestro_id = ?
    GROUP BY g.id
  `;

  pool.query(query, [req.session.user.IDmaestro], (err, results) => {
    if (err) {
      console.error("Error al obtener grupos:", err);
      return res.status(500).json({ message: "Error al obtener grupos" });
    }

    res.json(results);
  });
});

// Añadir alumno a un grupo (por ID de alumno)
app.post('/api/grupos/:grupoId/alumnos', (req, res) => {
  if (!req.session.user || req.session.user.tipo !== "maestro") {
    return res.status(401).json({ message: "No autorizado" });
  }

  const { grupoId } = req.params;
  const { alumnoId } = req.body;

  if (!alumnoId) {
    return res.status(400).json({ message: "ID de alumno es requerido" });
  }

  // Verificar que el grupo pertenece al maestro
  const verifyQuery = "SELECT id FROM grupos WHERE id = ? AND maestro_id = ?";
  
  pool.query(verifyQuery, [grupoId, req.session.user.IDmaestro], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "Grupo no encontrado o no autorizado" });
    }

    const insertQuery = "INSERT INTO grupo_alumnos (grupo_id, alumno_id) VALUES (?, ?)";
    
    pool.query(insertQuery, [grupoId, alumnoId], (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: "El alumno ya está en este grupo" });
        }
        console.error("Error al añadir alumno:", err);
        return res.status(500).json({ message: "Error al añadir alumno" });
      }

      res.json({ message: "Alumno añadido al grupo exitosamente" });
    });
  });
});

// Obtener alumnos de un grupo específico
app.get('/api/grupos/:grupoId/alumnos', (req, res) => {
  if (!req.session.user || req.session.user.tipo !== "maestro") {
    return res.status(401).json({ message: "No autorizado" });
  }

  const { grupoId } = req.params;

  const query = `
    SELECT a.IDalumno, a.Usuario, a.Imagen
    FROM alumnos a
    JOIN grupo_alumnos ga ON a.IDalumno = ga.alumno_id
    WHERE ga.grupo_id = ?
  `;

  pool.query(query, [grupoId], (err, results) => {
    if (err) {
      console.error("Error al obtener alumnos:", err);
      return res.status(500).json({ message: "Error al obtener alumnos" });
    }

    res.json(results);
  });
});

// Eliminar grupo
app.delete('/api/grupos/:grupoId', (req, res) => {
  if (!req.session.user || req.session.user.tipo !== "maestro") {
    return res.status(401).json({ message: "No autorizado" });
  }

  const { grupoId } = req.params;

  // Verificar que el grupo pertenece al maestro
  const verifyQuery = "SELECT id FROM grupos WHERE id = ? AND maestro_id = ?";
  
  pool.query(verifyQuery, [grupoId, req.session.user.IDmaestro], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "Grupo no encontrado o no autorizado" });
    }

    const deleteQuery = "DELETE FROM grupos WHERE id = ?";
    
    pool.query(deleteQuery, [grupoId], (err, results) => {
      if (err) {
        console.error("Error al eliminar grupo:", err);
        return res.status(500).json({ message: "Error al eliminar grupo" });
      }

      res.json({ message: "Grupo eliminado exitosamente" });
    });
  });
});

// -----------------------------------------------------
// RUTAS PARA GRUPOS (ALUMNOS)
// -----------------------------------------------------

// Unirse a un grupo usando token
app.post('/api/grupos/unirse', (req, res) => {
  if (!req.session.user || !req.session.user.IDalumno) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Token es requerido" });
  }

  // 1. Buscar el grupo por token
  const findGroupQuery = "SELECT id FROM grupos WHERE token = ?";
  
  pool.query(findGroupQuery, [token], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }

    const grupoId = results[0].id;
    const alumnoId = req.session.user.IDalumno;

    // 2. Verificar si el alumno ya está en el grupo
    const checkQuery = "SELECT * FROM grupo_alumnos WHERE grupo_id = ? AND alumno_id = ?";
    
    pool.query(checkQuery, [grupoId, alumnoId], (err, results) => {
      if (err) {
        console.error("Error al verificar membresía:", err);
        return res.status(500).json({ message: "Error al unirse al grupo" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "Ya estás en este grupo" });
      }

      // 3. Añadir alumno al grupo
      const insertQuery = "INSERT INTO grupo_alumnos (grupo_id, alumno_id) VALUES (?, ?)";
      
      pool.query(insertQuery, [grupoId, alumnoId], (err, results) => {
        if (err) {
          console.error("Error al unirse al grupo:", err);
          return res.status(500).json({ message: "Error al unirse al grupo" });
        }

        res.json({ message: "Te has unido al grupo exitosamente" });
      });
    });
  });
});

// Obtener grupos a los que pertenece un alumno
app.get('/api/mis-grupos', (req, res) => {
  if (!req.session.user || !req.session.user.IDalumno) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const query = `
    SELECT g.id, g.nombre, g.token, m.nombre as maestro_nombre, 
           m.apellido as maestro_apellido, g.fecha_creacion
    FROM grupos g
    JOIN grupo_alumnos ga ON g.id = ga.grupo_id
    JOIN maestros m ON g.maestro_id = m.IDmaestro
    WHERE ga.alumno_id = ?
  `;

  pool.query(query, [req.session.user.IDalumno], (err, results) => {
    if (err) {
      console.error("Error al obtener grupos:", err);
      return res.status(500).json({ message: "Error al obtener grupos" });
    }

    res.json(results);
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