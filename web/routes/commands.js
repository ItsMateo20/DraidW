const dashuser = require("../../models/dashuser.js");
const user = require("../../models/user.js");
const jwt = require("jsonwebtoken");

module.exports = {
    name: "Commands",
    url: "/commands",
    run: async (req, res) => {
        delete require.cache[require.resolve("../pages/commands.ejs")]

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
        let admin = false
        if (decoded) {
            const userS = await user.findOne({ userID: data.user.id })
            if (userS.draiddevs[0]["developer"] == true && userS.draiddevs[1]["blacklisted"] == false) admin = true
            args = {
                body: ["Commands | Draid"],
                avatar: `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png`,
                username: data.user.username,
                globalname: data.user.globalname,
                id: data.user.id,


                admin: admin,
                loggedIn: true,
                developer: userS.draiddevs[0]["developer"],
            }
        } else if (!decoded) {
            args = {
                body: ["Commands | Draid"],
                avatar: "../assets/icons/DraidDefaultLogin.png",
                username: "",
                globalname: "",
                id: "",


                admin: admin,
                loggedIn: false,
                developer: false,
            }
        }

        if (args.loggedIN == true) {
            const userS = await user.findOne({ userID: data.user.id })
            if (userS) {
                if (userS.draiddevs[0]["developer"] == true) {
                    args.displayDeveloper = ""
                }
            }
        }

        res.render("../pages/commands.ejs", args)
    }
}