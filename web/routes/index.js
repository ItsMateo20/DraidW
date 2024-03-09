const dashuser = require("../../models/dashuser.js");
const user = require("../../models/user.js");
const jwt = require("jsonwebtoken");

module.exports = {
    name: "Home",
    url: "/",
    run: async (req, res) => {
        res.redirect("/goodbye")
        delete require.cache[require.resolve("../pages/home.ejs")]

        let decoded
        let data
        let userS
        if (req.cookies.token) {
            try {
                decoded = jwt.verify(req.cookies.token, process.env.JWTSECRET)
            } catch (e) { }
            if (decoded) {
                data = await dashuser.findOne({ _id: decoded.uuid, userID: decoded.userID })
                if (!data) return res.redirect("/login?redirect=" + req.originalUrl)
                userS = await user.findOne({ userID: data.userID })
                if (!userS) return res.redirect("/login?redirect=" + req.originalUrl)
            }
        }



        let args
        let admin = false
        if (decoded) {
            if (userS.draiddevs[0]["developer"] == true && userS.draiddevs[1]["blacklisted"] == false) admin = true
            args = {
                body: ["Home | Draid"],
                avatar: `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png`,
                username: data.user.username,
                globalname: data.user.globalname,
                id: data.user.id,


                admin: admin,
                loggedIn: true,
            }
        } else if (!decoded) {
            args = {
                body: ["Home | Draid"],
                avatar: "../assets/icons/DraidDefaultLogin.png",
                username: "",
                globalname: "",
                id: "",


                admin: admin,
                loggedIn: false,
            }
        }


        res.render("../pages/home.ejs", args)
    }
}