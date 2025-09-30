const jwt = require('jsonwebtoken');
const User = require('../model/User');

exports.protect = async (req, res, next) => {
  try {
    // دعم لرؤوس بأحرف صغيرة أو كبيرة
    let token = req.headers.authorization || req.headers.Authorization;
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized — token missing' });
    }

    token = token.split(' ')[1]; // استخراج التوكن الصحيح
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Token invalid' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user; // Attach user object
    next();
  } catch (err) {
    console.error('Protect middleware error:', err);
    return res.status(401).json({ message: 'Not authorized', error: err.message });
  }
};
