const dashuser = require("../../models/dashuser.js");
const jwt = require("jsonwebtoken");

module.exports = {
    name: "TermsOfService",
    url: "/termsofservice",
    run: async (req, res) => {
        delete require.cache[require.resolve("../pages/termsofservice.ejs")]

        let decoded
        let data
        if (req.cookies.token) {
            try {
                decoded = jwt.verify(req.cookies.token, process.env.JWTSECRET)
            } catch (e) { }
            if (decoded) {
                data = await dashuser.findOne({ _id: decoded.uuid, userID: decoded.userID })
                if (!data) return res.redirect("/login?redirect=" + req.originalUrl)
            }
        }


        let args
        if (decoded) {
            args = {
                body: ["Terms of service | Draid"],
                avatar: `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png`,
                username: data.user.username,
                globalname: data.user.globalname,
                id: data.user.id,


                admin: false,
                loggedIn: true,
            }
        } else if (!decoded) {
            args = {
                body: ["Terms of service | Draid"],
                avatar: "../assets/icons/DraidDefaultLogin.png",
                username: "",
                globalname: "",
                id: "",


                admin: false,
                loggedIn: false,
            }
        }


        res.render("../pages/termsofservice.ejs", args)
    }
}