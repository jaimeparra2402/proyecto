const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

if (!admin.apps.length && process.env.FIREBASE_CONFIG_PATH) {
  try {
    const path = require('path');
    const absolutePath = path.resolve(process.env.FIREBASE_CONFIG_PATH);
    const serviceAccount = require(absolutePath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (fbInitError) {
    console.error(fbInitError.message);
  }
}

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '24h' });
};

exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ status: 'fail', message: 'Missing fields' });
    }
    const newUser = await User.create({ username, password, role });
    const token = signToken(newUser._id);
    return res.status(201).json({ status: 'success', token, data: { user: newUser } });
  } catch (error) {
    return res.status(400).json({ status: 'error', message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ status: 'fail', message: 'Missing fields' });
    }
    const user = await User.findOne({ username });
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect username or password' });
    }
    const token = signToken(user._id);
    return res.status(200).json({ status: 'success', token });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'Not logged in' });
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
        
      }
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ status: 'fail', message: 'User no longer exists' });
    }
    req.user = currentUser;
    return next();

  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'fail', message: 'Permission denied' });
    }
    return next();
  };
};