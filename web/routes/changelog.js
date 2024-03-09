const dashuser = require("../../models/dashuser.js");
const user = require("../../models/user.js");
const draid = require("../../models/draid.js");
const jwt = require("jsonwebtoken");

module.exports = {
    name: "Changelog",
    url: "/changelog",
    run: async (req, res) => {
        delete require.cache[require.resolve("../pages/changelog.ejs")]

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

        const draidS = await draid.findOne()
        if (!draidS) return res.refresh()

        let changelog = [["PLACEHOLDER CUZ 0"]]

        for (let i = 1; i < draidS.changelog.length; i++) {
            draidS.changelog[i]["Title"] = draidS.changelog[i]["Title"].toString().replace(/_/g, "").replace(/\*/g, "").replace(/\+/g, "");
            changelog.push(draidS.changelog[i])
        }

        let args
        let admin = false
        if (decoded) {
            let userS = await user.findOne({ userID: data.user.id });
            if (userS.draiddevs[0]["developer"] == true && userS.draiddevs[1]["blacklisted"] == false) admin = true
            args = {
                body: ["Changelog | Draid"],
                avatar: `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png`,
                username: data.user.username,
                globalname: data.user.globalname,
                id: data.user.id,

                changelog: changelog,
                lastEdited: draidS.changelog[0]["lastedited"],

                admin: admin,
                loggedIn: true,
            }
        } else if (!decoded) {
            args = {
                body: ["Changelog | Draid"],
                avatar: "../assets/icons/DraidDefaultLogin.png",
                username: "",
                globalname: "",
                id: "",

                changelog: changelog,
                lastEdited: draidS.changelog[0]["lastedited"],

                admin: admin,
                loggedIn: false,
            }
        }


        res.render("../pages/changelog.ejs", args)
    }
}