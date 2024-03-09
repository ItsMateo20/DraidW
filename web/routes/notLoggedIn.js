const dashuser = require("../../models/dashuser.js");
const jwt = require("jsonwebtoken");

module.exports = {
    name: "notLoggedIn",
    url: "/notloggedin",
    run: async (req, res) => {
        delete require.cache[require.resolve("../pages/notloggedin.ejs")]

        let decoded
        let data
        if (req.cookies.token) {
            try {
                decoded = jwt.verify(req.cookies.token, process.env.JWTSECRET)
            } catch (e) { }
            if (decoded) {
                data = await dashuser.findOne({ _id: decoded.uuid, userID: decoded.userID })
                if (!data) return res.redirect("/login")
            }
        }


        let args
        if (decoded) {
            return res.redirect(req.query.redirect || "/")
        } else if (!decoded) {
            args = {
                body: ["Not logged in | Draid"],
                avatar: "../assets/icons/DraidDefaultLogin.png",
                username: "",
                globalname: "",
                id: "",

                redirect: req.query.redirect || "/",

                admin: false,
                loggedIn: false,
            }
        }


        res.render("../pages/notloggedin.ejs", args)
    }
}