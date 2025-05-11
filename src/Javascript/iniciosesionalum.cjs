
const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5000;

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
app.use("/uploads", express.static("uploads"));
app.use('/logos', express.static(path.join(__dirname, 'logos')));


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
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
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
  charset: 'utf8mb4'
});

pool.on('error', (err) => {
  console.error('Error in MySQL pool:', err);
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
// RUTAS DE REGISTRO (NUEVAS)
// -----------------------------------------------------

// Ruta para guardar alumnos - MODIFICADA PARA INCLUIR NOMBRE Y APELLIDO
app.post("/guardar", (req, res) => {
  console.log("Datos recibidos:", req.body);
  const { nombre, apellido, Usuario, contraseña, Pregunta_seguridad, Respuesta } = req.body;

  const nuevoUsuario = 
    "INSERT INTO alumnos (nombre, apellido, Usuario, contraseña, Pregunta_seguridad, Respuesta) VALUES (?, ?, ?, ?, ?, ?)";

  pool.query(
    nuevoUsuario,
    [nombre, apellido, Usuario, contraseña, Pregunta_seguridad, Respuesta],
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

// Ruta para guardar maestros
app.post("/guardar-maestro", upload.single('imagen'), (req, res) => {
  console.log("Datos recibidos para maestro:", req.body);
  
  const { correo, contraseña, nombre, apellido, fechaNacimiento } = req.body;
  
  // Si no se subió imagen, usar un valor por defecto o cadena vacía
  const imagenPath = req.file ? req.file.filename : 'default.jpg';

  const nuevoMaestro = `
    INSERT INTO maestros 
    (correo, contraseña, Imagen, Fecha, nombre, apellido) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  pool.query(
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

// -----------------------------------------------------
// Ruta para iniciar sesión CORREGIDA (incluye nombre y apellido)
// -----------------------------------------------------
app.post("/login", (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "Campos incompletos" });
  }

  // Consulta CORREGIDA incluyendo nombre y apellido
  const query = "SELECT IDalumno, nombre, apellido, Usuario, Respuesta, Imagen FROM alumnos WHERE Usuario = ? AND contraseña = ?";

  pool.query(query, [name, password], (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ message: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    req.session.user = {
      IDalumno: results[0].IDalumno,
      Usuario: results[0].Usuario,
      nombre: results[0].nombre,
      apellido: results[0].apellido
    };

    res.json({ 
      message: "Inicio de sesión exitoso", 
      user: {
        IDalumno: results[0].IDalumno,
        Usuario: results[0].Usuario,
        nombre: results[0].nombre,
        apellido: results[0].apellido,
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

  // Consulta CORREGIDA incluyendo nombre y apellido
  const query = "SELECT IDalumno, nombre, apellido, Usuario, Respuesta, Imagen FROM alumnos WHERE Usuario = ?";
  
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
      nombre: results[0].nombre,
      apellido: results[0].apellido,
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

// Modificación de la ruta para crear un nuevo grupo (incluyendo nuevos campos)
app.post('/api/grupos', (req, res) => {
  if (!req.session.user || req.session.user.tipo !== "maestro") {
    return res.status(401).json({ message: "No autorizado" });
  }

  const { nombre, Nombre_Escuela, Descripcion } = req.body;
  if (!nombre) {
    return res.status(400).json({ message: "Nombre del grupo es requerido" });
  }

  const token = generateToken();
  const query = "INSERT INTO grupos (nombre, token, maestro_id, Nombre_Escuela, Descripcion) VALUES (?, ?, ?, ?, ?)";

  pool.query(query, [nombre, token, req.session.user.IDmaestro, Nombre_Escuela || null, Descripcion || null], (err, results) => {
    if (err) {
      console.error("Error al crear grupo:", err);
      return res.status(500).json({ message: "Error al crear grupo" });
    }

    res.status(201).json({
      message: "Grupo creado exitosamente",
      grupo: {
        id: results.insertId,
        nombre,
        token,
        Nombre_Escuela,
        Descripcion,
        total_alumnos: 0,
        fecha_creacion: new Date()
      }
    });
  });
});

// Modificación de la ruta para obtener todos los grupos de un maestro (incluyendo nuevos campos)
app.get('/api/grupos', (req, res) => {
  if (!req.session.user || req.session.user.tipo !== "maestro") {
    return res.status(401).json({ message: "No autorizado" });
  }

  const query = `
    SELECT g.id, g.nombre, g.token, g.fecha_creacion, g.Nombre_Escuela, g.Descripcion,
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

// Obtener alumnos de un grupo específico - MODIFICADA PARA INCLUIR NOMBRE Y APELLIDO
app.get('/api/grupos/:grupoId/alumnos', (req, res) => {
  if (!req.session.user || req.session.user.tipo !== "maestro") {
    return res.status(401).json({ message: "No autorizado" });
  }

  const { grupoId } = req.params;

  const query = `
    SELECT a.IDalumno, a.nombre, a.apellido, a.Usuario, a.Imagen
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
// Eliminar alumno de un grupo
app.delete('/api/grupos/:grupoId/alumnos/:alumnoId', (req, res) => {
  if (!req.session.user || req.session.user.tipo !== "maestro") {
    return res.status(401).json({ message: "No autorizado" });
  }

  const { grupoId, alumnoId } = req.params;

  // Verificar que el grupo pertenece al maestro
  const verifyQuery = "SELECT id FROM grupos WHERE id = ? AND maestro_id = ?";
  
  pool.query(verifyQuery, [grupoId, req.session.user.IDmaestro], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "Grupo no encontrado o no autorizado" });
    }

    const deleteQuery = "DELETE FROM grupo_alumnos WHERE grupo_id = ? AND alumno_id = ?";
    
    pool.query(deleteQuery, [grupoId, alumnoId], (err, results) => {
      if (err) {
        console.error("Error al eliminar alumno del grupo:", err);
        return res.status(500).json({ message: "Error al eliminar alumno del grupo" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Alumno no encontrado en este grupo" });
      }

      res.json({ message: "Alumno eliminado del grupo exitosamente" });
    });
  });
});

// Añadir una ruta para obtener todos los alumnos disponibles - MODIFICADA PARA INCLUIR NOMBRE Y APELLIDO
app.get('/api/alumnos', (req, res) => {
  if (!req.session.user || req.session.user.tipo !== "maestro") {
    return res.status(401).json({ message: "No autorizado" });
  }

  const query = "SELECT IDalumno, nombre, apellido, Usuario, Imagen FROM alumnos";
  
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener alumnos:", err);
      return res.status(500).json({ message: "Error al obtener alumnos" });
    }

    res.json(results);
  });
});


// -----------------------------------------------------
// RUTAS PARA GRUPOS (ALUMNOS)
// -----------------------------------------------------


// Ruta para que un alumno se una a un grupo usando un token
app.post('/api/unirse-grupo', (req, res) => {
  if (!req.session.user || !req.session.user.IDalumno) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ message: "Token es requerido" });
  }

  // Primero verificamos si el grupo existe con ese token
  const findGroupQuery = "SELECT id FROM grupos WHERE token = ?";
  
  pool.query(findGroupQuery, [token], (err, results) => {
    if (err) {
      console.error("Error al buscar grupo:", err);
      return res.status(500).json({ message: "Error al buscar grupo" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No se encontró ningún grupo con ese token" });
    }

    const grupoId = results[0].id;

    // Verificamos si el alumno ya está en el grupo
    const checkMembershipQuery = "SELECT * FROM grupo_alumnos WHERE grupo_id = ? AND alumno_id = ?";
    
    pool.query(checkMembershipQuery, [grupoId, req.session.user.IDalumno], (err, results) => {
      if (err) {
        console.error("Error al verificar membresía:", err);
        return res.status(500).json({ message: "Error al verificar membresía en el grupo" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "Ya eres miembro de este grupo" });
      }

      // Si no está en el grupo, lo agregamos
      const joinGroupQuery = "INSERT INTO grupo_alumnos (grupo_id, alumno_id) VALUES (?, ?)";
      
      pool.query(joinGroupQuery, [grupoId, req.session.user.IDalumno], (err, results) => {
        if (err) {
          console.error("Error al unirse al grupo:", err);
          return res.status(500).json({ message: "Error al unirse al grupo" });
        }

        res.json({ message: "Te has unido al grupo exitosamente" });
      });
    });
  });
});

// Obtener todos los grupos a los que pertenece un alumno
app.get('/api/mis-grupos', (req, res) => {
  if (!req.session.user || !req.session.user.IDalumno) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const query = `
    SELECT g.id, g.nombre, g.token, g.fecha_creacion,
           m.nombre as maestro_nombre, m.apellido as maestro_apellido
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

// Obtener detalles de un grupo específico incluyendo la lista de alumnos
app.get('/api/grupo/:grupoId', (req, res) => {
  if (!req.session.user || !req.session.user.IDalumno) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const { grupoId } = req.params;

  // Verificar que el alumno pertenece al grupo
  const checkMembershipQuery = "SELECT * FROM grupo_alumnos WHERE grupo_id = ? AND alumno_id = ?";
  
  pool.query(checkMembershipQuery, [grupoId, req.session.user.IDalumno], (err, memberResults) => {
    if (err) {
      console.error("Error al verificar membresía:", err);
      return res.status(500).json({ message: "Error al verificar membresía en el grupo" });
    }

    if (memberResults.length === 0) {
      return res.status(403).json({ message: "No tienes acceso a este grupo" });
    }

    // Obtener datos generales del grupo
    const grupoQuery = `
      SELECT g.id, g.nombre, g.token, g.fecha_creacion,
             m.IDmaestro, m.nombre as maestro_nombre, m.apellido as maestro_apellido
      FROM grupos g
      JOIN maestros m ON g.maestro_id = m.IDmaestro
      WHERE g.id = ?
    `;

    pool.query(grupoQuery, [grupoId], (err, grupoResults) => {
      if (err) {
        console.error("Error al obtener detalles del grupo:", err);
        return res.status(500).json({ message: "Error al obtener detalles del grupo" });
      }

      if (grupoResults.length === 0) {
        return res.status(404).json({ message: "Grupo no encontrado" });
      }

      const grupoData = grupoResults[0];

      // Obtener alumnos del grupo
      const alumnosQuery = `
        SELECT a.IDalumno, a.nombre, a.apellido, a.Usuario, a.Imagen
        FROM alumnos a
        JOIN grupo_alumnos ga ON a.IDalumno = ga.alumno_id
        WHERE ga.grupo_id = ?
      `;

      pool.query(alumnosQuery, [grupoId], (err, alumnosResults) => {
        if (err) {
          console.error("Error al obtener alumnos del grupo:", err);
          return res.status(500).json({ message: "Error al obtener alumnos del grupo" });
        }

        // Devolver toda la información
        res.json({
          grupo: grupoData,
          alumnos: alumnosResults
        });
      });
    });
  });
});

// Salir de un grupo
app.delete('/api/salir-grupo/:grupoId', (req, res) => {
  if (!req.session.user || !req.session.user.IDalumno) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const { grupoId } = req.params;

  const query = "DELETE FROM grupo_alumnos WHERE grupo_id = ? AND alumno_id = ?";
  
  pool.query(query, [grupoId, req.session.user.IDalumno], (err, results) => {
    if (err) {
      console.error("Error al salir del grupo:", err);
      return res.status(500).json({ message: "Error al salir del grupo" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "No eres miembro de este grupo" });
    }

    res.json({ message: "Has salido del grupo exitosamente" });
  });
});

// -----------------------------------------------------
// RUTAS PARA RECUPERACIÓN DE CONTRASEÑA
// -----------------------------------------------------
// Ruta para validar datos de recuperación (usuario, pregunta y respuesta)
app.post("/validar-recuperacion", (req, res) => {
  const { Usuario, Pregunta_seguridad, Respuesta } = req.body;

  if (!Usuario || !Pregunta_seguridad || !Respuesta) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  // Primero verificamos si el usuario existe
  const query = "SELECT * FROM alumnos WHERE Usuario = ?";
  
  pool.query(query, [Usuario], (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ message: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificamos que la pregunta y respuesta coincidan
    const usuario = results[0];
    
    if (usuario.Pregunta_seguridad !== Pregunta_seguridad) {
      return res.status(400).json({ message: "La pregunta de seguridad no coincide" });
    }
    
    if (usuario.Respuesta !== Respuesta) {
      return res.status(400).json({ message: "La respuesta es incorrecta" });
    }

    // Si todo es correcto, enviamos una respuesta positiva
    res.json({ 
      success: true, 
      message: "Datos validados correctamente",
      valido: true
    });
  });
});

// Ruta para obtener la pregunta de seguridad de un usuario (opcional)
app.get("/obtener-pregunta/:usuario", (req, res) => {
  const { usuario } = req.params;

  if (!usuario) {
    return res.status(400).json({ message: "Usuario es requerido" });
  }

  const query = "SELECT Pregunta_seguridad FROM alumnos WHERE Usuario = ?";
  
  pool.query(query, [usuario], (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ message: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ 
      pregunta: results[0].Pregunta_seguridad 
    });
  });
});

// Ruta para actualizar la contraseña
app.post("/api/actualizar-password", (req, res) => {
  const { Usuario, nuevaContraseña } = req.body;

  if (!Usuario || !nuevaContraseña) {
    return res.status(400).json({ message: "Usuario y nueva contraseña son requeridos" });
  }

  if (nuevaContraseña.length < 6) {
    return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
  }

  const query = "UPDATE alumnos SET contraseña = ? WHERE Usuario = ?";
  
  pool.query(query, [nuevaContraseña, Usuario], (err, results) => {
    if (err) {
      console.error("Error al actualizar contraseña:", err);
      return res.status(500).json({ message: "Error al actualizar la contraseña" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Contraseña actualizada exitosamente" });
  });
});

// -----------------------------------------------------
// RUTAS PARA RECUPERACIÓN DE CONTRASEÑA MAESTROS
// -----------------------------------------------------

// Ruta para validar datos de recuperación de maestros (correo y fecha de nacimiento)
app.post("/validar-recuperacion-maestro", (req, res) => {
  const { correo, fechaNacimiento } = req.body;

  if (!correo || !fechaNacimiento) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  // Verificamos si el maestro existe con ese correo
  const query = "SELECT * FROM maestros WHERE correo = ?";
  
  pool.query(query, [correo], (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ message: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Correo no encontrado" });
    }

    // Verificamos que la fecha de nacimiento coincida
    const maestro = results[0];
    
    // Formatear las fechas para comparación
    const fechaBD = new Date(maestro.Fecha).toISOString().split('T')[0];
    const fechaInput = new Date(fechaNacimiento).toISOString().split('T')[0];
    
    if (fechaBD !== fechaInput) {
      return res.status(400).json({ message: "La fecha de nacimiento no coincide" });
    }

    // Si todo es correcto, enviamos una respuesta positiva
    res.json({ 
      success: true, 
      message: "Datos validados correctamente",
      valido: true
    });
  });
});

// Ruta para verificar si existe un correo
app.get("/verificar-correo-maestro/:correo", (req, res) => {
  const { correo } = req.params;

  if (!correo) {
    return res.status(400).json({ message: "Correo es requerido" });
  }

  const query = "SELECT COUNT(*) as existe FROM maestros WHERE correo = ?";
  
  pool.query(query, [correo], (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ message: "Error en el servidor" });
    }

    res.json({ 
      existe: results[0].existe > 0,
      message: results[0].existe > 0 ? "Correo encontrado" : "Correo no registrado"
    });
  });
});

// Ruta para actualizar la contraseña del maestro
app.post("/api/actualizar-password-maestro", (req, res) => {
  const { correo, nuevaContraseña } = req.body;

  if (!correo || !nuevaContraseña) {
    return res.status(400).json({ message: "Correo y nueva contraseña son requeridos" });
  }

  if (nuevaContraseña.length < 6) {
    return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
  }

  const query = "UPDATE maestros SET contraseña = ? WHERE correo = ?";
  
  pool.query(query, [nuevaContraseña, correo], (err, results) => {
    if (err) {
      console.error("Error al actualizar contraseña:", err);
      return res.status(500).json({ message: "Error al actualizar la contraseña" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Correo no encontrado" });
    }

    res.json({ message: "Contraseña actualizada exitosamente" });
  });
});

// Ruta para guardar partida con manejo correcto de dificultad y medallas
app.post("/api/guardar-partida", (req, res) => {
  if (!req.session.user || !req.session.user.IDalumno) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const { IDjuego, dificultad, puntuacion } = req.body;
  
  if (!IDjuego || dificultad === undefined || puntuacion === undefined) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  // Primero guardamos la partida
  const query = `
    INSERT INTO partidas (IDalumno, IDjuego, dificultad, puntuacion) 
    VALUES (?, ?, ?, ?)
  `;

  pool.query(
    query, 
    [req.session.user.IDalumno, IDjuego, dificultad, puntuacion],
    (err, results) => {
      if (err) {
        console.error("Error al guardar partida:", err);
        return res.status(500).json({ message: "Error al guardar partida" });
      }
      
      // Ahora obtenemos el nombre del juego para otorgar la medalla
      const juegoQuery = "SELECT nombre FROM juegos WHERE IDjuego = ?";
      
      pool.query(juegoQuery, [IDjuego], (err, juegos) => {
        if (err || juegos.length === 0) {
          console.error("Error al buscar juego:", err || "Juego no encontrado");
          // Si hay error o no se encuentra el juego, seguimos sin asignar medalla
          return res.json({ 
            message: "Partida guardada exitosamente",
            medalla: false
          });
        }
        
        const nombreJuego = juegos[0].nombre;
        let nivelDificultad;
        
        // Convertir el valor de dificultad a texto
        // Primero asegurémonos de que dificultad sea un número
        const dificultadValue = Number(dificultad) || parseInt(dificultad) || 1;

        // Convertir a texto exactamente como aparece en la tabla
        switch (dificultadValue) {
          case 1:
            nivelDificultad = "Facil";  // Exactamente como aparece en tu tabla
            break;
          case 2:
            nivelDificultad = "Medio";  // Exactamente como aparece en tu tabla
            break;
          case 3:
            nivelDificultad = "Dificil";  // Exactamente como aparece en tu tabla
            break;
          default:
            console.log(`Dificultad no reconocida: ${dificultad}`);
            nivelDificultad = "Facil";  // Valor por defecto
        }
        
        console.log(`Buscando medalla para juego: ${nombreJuego}, dificultad: ${nivelDificultad}`);
        
        // Consulta para buscar la medalla correspondiente
        const medallaQuery = "SELECT id FROM medallas WHERE juego = ? AND dificultad = ?";
        
        pool.query(medallaQuery, [nombreJuego, nivelDificultad], (err, medallas) => {
          if (err) {
            console.error("Error al buscar medalla:", err);
            return res.json({ 
              message: "Partida guardada exitosamente",
              medalla: false
            });
          }
          
          if (medallas.length === 0) {
            console.log(`No se encontró medalla para: ${nombreJuego} - ${nivelDificultad}`);
            return res.json({ 
              message: "Partida guardada exitosamente",
              medalla: false
            });
          }
          
          const medallaId = medallas[0].id;
          console.log(`Medalla encontrada con ID: ${medallaId}`);
          
          // Verificar si el alumno ya tiene esta medalla
          const checkMedallaQuery = "SELECT id FROM alumno_medallas WHERE alumno_id = ? AND medalla_id = ?";
          
          pool.query(checkMedallaQuery, [req.session.user.IDalumno, medallaId], (err, existentes) => {
            if (err) {
              console.error("Error al verificar medalla existente:", err);
              return res.json({ 
                message: "Partida guardada exitosamente",
                medalla: false
              });
            }
            
            // Si ya tiene la medalla, no hacemos nada más
            if (existentes.length > 0) {
              console.log(`El alumno ya tiene la medalla ID: ${medallaId}`);
              return res.json({ 
                message: "Partida guardada exitosamente",
                medalla: false
              });
            }
            
            // Si no tiene la medalla, se la asignamos
            const asignarMedallaQuery = "INSERT INTO alumno_medallas (alumno_id, medalla_id) VALUES (?, ?)";
            
            pool.query(asignarMedallaQuery, [req.session.user.IDalumno, medallaId], (err, result) => {
              if (err) {
                console.error("Error al asignar medalla:", err);
                return res.json({ 
                  message: "Partida guardada exitosamente",
                  medalla: false
                });
              }
              
              console.log(`Medalla ID: ${medallaId} asignada al alumno ID: ${req.session.user.IDalumno}`);
              res.json({ 
                message: "Partida guardada exitosamente",
                medalla: true,
                medallaId: medallaId
              });
            });
          });
        });
      });
    }
  );
});

// Ruta para obtener el historial de partidas de un alumno
app.get("/api/historial/:alumnoId", (req, res) => {
  if (!req.session.user || req.session.user.tipo !== "maestro") {
    return res.status(401).json({ message: "No autorizado" });
  }

  const { alumnoId } = req.params;

  const query = `
    SELECT p.IDpartida, j.nombre as juego, p.dificultad, p.puntuacion, p.fecha_partida
    FROM partidas p
    JOIN juegos j ON p.IDjuego = j.IDjuego
    WHERE p.IDalumno = ?
    ORDER BY p.fecha_partida DESC
    LIMIT 5
  `;

  pool.query(query, [alumnoId], (err, results) => {
    if (err) {
      console.error("Error al obtener historial:", err);
      return res.status(500).json({ message: "Error al obtener historial" });
    }

    res.json(results);
  });
});

// -------------------------------------------------
// RUTAS PARA MEDALLAS
// -------------------------------------------------

// Ruta para obtener todas las medallas de un alumno - versión corregida
app.get("/api/mis-medallas", (req, res) => {
  if (!req.session.user || !req.session.user.IDalumno) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const alumnoId = req.session.user.IDalumno;

  const query = `
    SELECT 
      m.id,
      m.nombre,
      m.descripcion,
      m.juego,
      m.dificultad,
      m.imagen,
      CASE WHEN am.id IS NOT NULL THEN TRUE ELSE FALSE END AS obtenida
    FROM 
      medallas m
    LEFT JOIN 
      alumno_medallas am ON m.id = am.medalla_id AND am.alumno_id = ?
    ORDER BY 
      m.juego, m.dificultad
  `;

  pool.query(query, [alumnoId], (err, results) => {
    if (err) {
      console.error("Error al obtener medallas:", err);
      return res.status(500).json({ message: "Error al obtener medallas" });
    }

    res.json(results);
  });
});

// Script para verificar la estructura de la base de datos (ejecutar al inicio)
app.get("/api/verificar-tablas-medallas", (req, res) => {
  // Solo para administradores
  if (!req.session.user || req.session.user.tipo !== "administrador") {
    return res.status(401).json({ message: "No autorizado" });
  }

  // Verificar la tabla de medallas
  pool.query("SHOW TABLES LIKE 'medallas'", (err, tables) => {
    if (err) {
      return res.status(500).json({ error: "Error al verificar tablas: " + err.message });
    }
    
    if (tables.length === 0) {
      return res.status(404).json({ error: "No existe la tabla 'medallas'" });
    }
    
    // Verificar la estructura de la tabla medallas
    pool.query("DESCRIBE medallas", (err, fields) => {
      if (err) {
        return res.status(500).json({ error: "Error al verificar estructura: " + err.message });
      }
      
      // Ahora verificar la tabla alumno_medallas
      pool.query("SHOW TABLES LIKE 'alumno_medallas'", (err, tables) => {
        if (err) {
          return res.status(500).json({ error: "Error al verificar tablas: " + err.message });
        }
        
        if (tables.length === 0) {
          return res.status(404).json({ error: "No existe la tabla 'alumno_medallas'" });
        }
        
        // Verificar la estructura de alumno_medallas
        pool.query("DESCRIBE alumno_medallas", (err, amFields) => {
          if (err) {
            return res.status(500).json({ error: "Error al verificar estructura: " + err.message });
          }
          
          // Verificar contenido de la tabla medallas
          pool.query("SELECT COUNT(*) as total FROM medallas", (err, count) => {
            if (err) {
              return res.status(500).json({ error: "Error al contar medallas: " + err.message });
            }
            
            res.json({
              status: "OK",
              mensaje: "Estructura de tablas verificada",
              estructuraMedallas: fields,
              estructuraAlumnoMedallas: amFields,
              totalMedallas: count[0].total
            });
          });
        });
      });
    });
  });
});

// Ruta para obtener los detalles de una medalla específica por ID
app.get("/api/medalla/:id", (req, res) => {
  if (!req.session.user || !req.session.user.IDalumno) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const medallaId = req.params.id;

  if (!medallaId) {
    return res.status(400).json({ message: "ID de medalla requerido" });
  }

  const query = "SELECT nombre, descripcion, imagen FROM medallas WHERE id = ?";

  pool.query(query, [medallaId], (err, results) => {
    if (err) {
      console.error("Error al obtener detalles de medalla:", err);
      return res.status(500).json({ message: "Error al obtener detalles de medalla" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Medalla no encontrada" });
    }

    res.json(results[0]);
  });
});

// Ruta para asignar una medalla al alumno cuando completa un nivel
app.post("/api/otorgar-medalla", (req, res) => {
  if (!req.session.user || !req.session.user.IDalumno) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const { juego, dificultad } = req.body;
  const alumnoId = req.session.user.IDalumno;

  if (!juego || !dificultad) {
    return res.status(400).json({ message: "Juego y dificultad son requeridos" });
  }

  // Primero encontramos la medalla correspondiente
  const findMedallaQuery = "SELECT id FROM medallas WHERE juego = ? AND dificultad = ?";

  pool.query(findMedallaQuery, [juego, dificultad], (err, medallas) => {
    if (err) {
      console.error("Error al buscar medalla:", err);
      return res.status(500).json({ message: "Error al buscar medalla" });
    }

    if (medallas.length === 0) {
      return res.status(404).json({ message: "Medalla no encontrada" });
    }

    const medallaId = medallas[0].id;

    // Ahora verificamos si el alumno ya tiene esta medalla
    const checkMedallaQuery = "SELECT id FROM alumno_medallas WHERE alumno_id = ? AND medalla_id = ?";

    pool.query(checkMedallaQuery, [alumnoId, medallaId], (err, existentes) => {
      if (err) {
        console.error("Error al verificar medalla:", err);
        return res.status(500).json({ message: "Error al verificar medalla" });
      }

      // Si ya tiene la medalla, no hacemos nada más
      if (existentes.length > 0) {
        return res.json({ 
          message: "Ya tienes esta medalla", 
          nueva: false,
          medallaId
        });
      }

      // Si no tiene la medalla, se la asignamos
      const asignarMedallaQuery = "INSERT INTO alumno_medallas (alumno_id, medalla_id) VALUES (?, ?)";

      pool.query(asignarMedallaQuery, [alumnoId, medallaId], (err) => {
        if (err) {
          console.error("Error al asignar medalla:", err);
          return res.status(500).json({ message: "Error al asignar medalla" });
        }

        res.json({ 
          message: "¡Has obtenido una nueva medalla!", 
          nueva: true,
          medallaId
        });
      });
    });
  });
});

// Ruta para obtener estadísticas de las medallas del alumno
app.get("/api/estadisticas-medallas", (req, res) => {
  if (!req.session.user || !req.session.user.IDalumno) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const alumnoId = req.session.user.IDalumno;

  const query = `
    SELECT 
      COUNT(DISTINCT m.id) AS total_medallas,
      COUNT(DISTINCT am.medalla_id) AS medallas_obtenidas
    FROM 
      medallas m
    LEFT JOIN 
      alumno_medallas am ON m.id = am.medalla_id AND am.alumno_id = ?
  `;

  pool.query(query, [alumnoId], (err, results) => {
    if (err) {
      console.error("Error al obtener estadísticas:", err);
      return res.status(500).json({ message: "Error al obtener estadísticas" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No se encontraron estadísticas" });
    }

    const stats = results[0];
    stats.porcentaje = stats.total_medallas > 0 
      ? Math.round((stats.medallas_obtenidas / stats.total_medallas) * 100) 
      : 0;

    res.json(stats);
  });
});

// Ruta para verificar la existencia de archivos de imágenes
app.get("/api/verificar-imagenes", (req, res) => {
  if (!req.session.user || req.session.user.tipo !== "administrador") {
    return res.status(401).json({ message: "No autorizado" });
  }
  
  // Consultar todas las rutas de imágenes en la base de datos
  const query = "SELECT id, nombre, imagen FROM medallas";
  
  pool.query(query, [], (err, medallas) => {
    if (err) {
      console.error("Error al obtener lista de medallas:", err);
      return res.status(500).json({ message: "Error al verificar imágenes" });
    }
    
    // Verificar la existencia de cada archivo
    const fs = require('fs');
    const resultados = [];
    
    medallas.forEach(medalla => {
      // Quitar la barra inicial si existe para convertir a ruta relativa
      const rutaRelativa = medalla.imagen.startsWith('/') ? 
        medalla.imagen.substring(1) : medalla.imagen;
      
      // Verificar si el archivo existe
      const rutaCompleta = path.join(__dirname, rutaRelativa);
      const existe = fs.existsSync(rutaCompleta);
      
      resultados.push({
        id: medalla.id,
        nombre: medalla.nombre,
        rutaEnBD: medalla.imagen,
        rutaCompleta: rutaCompleta,
        existe: existe
      });
    });
    
    // Verificar también la estructura de directorios
    const directorios = {
      logos: fs.existsSync(path.join(__dirname, 'logos')),
      uploads: fs.existsSync(path.join(__dirname, 'uploads'))
    };
    
    // Obtener información sobre la estructura de carpetas
    let contenidoLogos = [];
    if (directorios.logos) {
      try {
        contenidoLogos = fs.readdirSync(path.join(__dirname, 'logos'));
      } catch (e) {
        contenidoLogos = ["Error al leer directorio: " + e.message];
      }
    }
    
    res.json({
      directorios,
      contenidoLogos,
      totalMedallas: medallas.length,
      medallasVerificadas: resultados
    });
  });
});

// Endpoint para corregir rutas de imágenes
app.post("/api/corregir-rutas-imagenes", (req, res) => {
  if (!req.session.user || req.session.user.tipo !== "administrador") {
    return res.status(401).json({ message: "No autorizado" });
  }
  
  // Este endpoint puede usarse para renombrar archivos, 
  // actualizar rutas en la BD, o ambos, dependiendo del problema
  const { accion } = req.body;
  
  if (accion === "actualizar-bd") {
    // Actualizar rutas en la BD eliminando la barra inicial
    const query = "UPDATE medallas SET imagen = SUBSTRING(imagen, 2) WHERE imagen LIKE '/%'";
    
    pool.query(query, [], (err, resultado) => {
      if (err) {
        console.error("Error al actualizar rutas:", err);
        return res.status(500).json({ message: "Error al actualizar rutas" });
      }
      
      res.json({
        mensaje: "Rutas actualizadas en la base de datos",
        filasActualizadas: resultado.affectedRows
      });
    });
  } else if (accion === "crear-directorio") {
    // Crear directorio de logos si no existe
    const fs = require('fs');
    const logosDir = path.join(__dirname, 'logos');
    
    try {
      if (!fs.existsSync(logosDir)) {
        fs.mkdirSync(logosDir, { recursive: true });
        res.json({ mensaje: "Directorio de logos creado correctamente" });
      } else {
        res.json({ mensaje: "El directorio de logos ya existe" });
      }
    } catch (err) {
      console.error("Error al crear directorio:", err);
      res.status(500).json({ mensaje: "Error al crear directorio: " + err.message });
    }
  } else {
    res.status(400).json({ mensaje: "Acción no reconocida" });
  }
});

// Ruta para verificar cómo se sirven las imágenes estáticas
app.get("/api/test-imagen/:nombre", (req, res) => {
  const nombreImagen = req.params.nombre;
  
  // Respuesta con la URL correcta para acceder a la imagen
  res.json({
    urlCompleta: `${req.protocol}://${req.get('host')}/logos/${nombreImagen}`,
    rutaRelativa: `/logos/${nombreImagen}`
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