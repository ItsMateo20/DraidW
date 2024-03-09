const jwt = require("jsonwebtoken");

module.exports = {
    name: "Profile",
    url: "/user",
    run: async (req, res) => {
        delete require.cache[require.resolve("../pages/user.ejs")]

        if (req.cookies.token) {
            let decoded
            try {
                decoded = jwt.verify(req.cookies.token, process.env.JWTSECRET)
            } catch (e) { }
            if (!decoded) return res.redirect("/login?redirect=/user")

            res.redirect("/user/" + decoded.userID)
        } else if (!req.cookies.token) {
            res.redirect("/login?redirect=/user")
        }
    }
}