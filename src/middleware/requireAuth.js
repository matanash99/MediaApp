module.exports = (req, res, next) => {
    // If a session exists and has a userId, let them pass
    if (req.session && req.session.userId) {
        return next();
    }
    // Otherwise, kick them to the login screen
    res.redirect('/login');
};