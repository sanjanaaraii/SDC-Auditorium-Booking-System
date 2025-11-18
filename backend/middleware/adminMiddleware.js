export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
    
    next();
  } catch (err) {
    console.error("Admin middleware error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// backend/middleware/adminMiddleware.js

const adminMiddleware = (req, res, next) => {
  // We assume 'authenticate' middleware has already run and attached 'req.user'
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admin access required.' });
  }
};

export default adminMiddleware;