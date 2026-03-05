module.exports = (req, res, next) => {
    // First, verify they are logged in at all
    if (!req.session || !req.session.userId) {
        return res.redirect('/login');
    }
    
    // Second, verify their role is exactly 'admin'
    if (req.session.role !== 'admin') {
        return res.status(403).send('Access Denied: Admins only. Nice try, though.');
    }
    
    // If they pass both checks, let them through
    next();
};