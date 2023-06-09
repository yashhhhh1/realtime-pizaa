const User = require("../../models/user")
async function admin(req, res, next) {
    const admin=await User.findById(req.user)
    if (req.isAuthenticated() && admin.role === 'admin') {

        return next()
    }
    return res.redirect("/")

}

module.exports = admin;