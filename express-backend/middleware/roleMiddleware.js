// roleMiddleware.js

module.exports = (allowedRoles) => {
    return (req, res, next) => {
      try {
        const userRole = req.user.role; // this assumes authMiddleware has attached req.user
        
        if (!allowedRoles.includes(userRole)) {
          return res.status(403).json({
            success: false,
            message: "Access denied. Insufficient permissions.",
          });
        }
  
        next();
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Server error in role middleware.",
        });
      }
    };
  };
  