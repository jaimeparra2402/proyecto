const admin = require('firebase-admin');
const path = require('path');

if (!admin.apps.length && process.env.FIREBASE_CONFIG_PATH) {
  try {
    const absolutePath = path.resolve(process.env.FIREBASE_CONFIG_PATH);
    const serviceAccount = require(absolutePath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin inicializado correctamente');
  } catch (fbInitError) {
    console.error('Error al inicializar Firebase Admin:', fbInitError.message);
  }
}

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        status: 'fail', 
        message: 'No has iniciado sesión. Falta el token de autenticación.' 
      });
    }

    // 🕵️ CHIVATO: Veremos en la terminal qué token está llegando desde Swagger
    console.log("🎟️ Token recibido en el servidor:", token);
    console.log("🔑 Token esperado (.env):", process.env.JWT_SECRET);

    // Comparamos limpiando posibles espacios en blanco
    if (token.trim() === process.env.JWT_SECRET.trim()) {
      console.log("🟢 ¡Bypass de desarrollo activado con éxito! Entrando como Admin.");
      req.user = {
        id: "mock_admin_123",
        username: "admin_tester@proyecto.com",
        role: "admin"
      };
      return next();
    }

    if (admin.apps.length) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = {
          id: decodedToken.uid,
          username: decodedToken.email || decodedToken.name,
          role: decodedToken.role || 'user'
        };
        return next();
      } catch (fbError) {
        return res.status(401).json({ 
          status: 'fail', 
          message: 'Token de Firebase inválido o expirado.' 
        });
      }
    } else {
      return res.status(500).json({
        status: 'error',
        message: 'Firebase Admin no está configurado en el servidor.'
      });
    }

  } catch (error) {
    return res.status(401).json({ 
      status: 'error', 
      message: 'Error en la autenticación: ' + error.message 
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        status: 'fail', 
        message: 'No tienes permisos de administrador para realizar esta acción.' 
      });
    }
    return next();
  };
};