const client = require("../../bot/discord.js").client
const dashuser = require("../../models/dashuser.js");
const user = require("../../models/user.js");
const jwt = require("jsonwebtoken");

module.exports = {
    name: "Contact",
    url: "/contact",
    run: async (req, res) => {
        delete require.cache[require.resolve("../pages/contact.ejs")]

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
                body: ["Contact | Draid Official Website"],
                avatar: `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png`,
                username: data.user.username,
                globalname: data.user.globalname,
                id: data.user.id,


                admin: admin,
                loggedIn: true,

                userNames: [],
                userIDs: [],
                userAvatars: [],
                userEmails: [],
                userRoles: [],
            }
        } else if (!decoded) {
            args = {
                body: ["Contact | Draid"],
                avatar: "../assets/icons/DraidDefaultLogin.png",
                username: "",
                globalname: "",
                id: "",


                admin: admin,
                loggedIn: false,

                userNames: [],
                userIDs: [],
                userAvatars: [],
                userEmails: [],
                userRoles: [],
            }
        }

        const contacts = ["630812692659044352", "434669571685744662"]

        for (let i = 0; i < contacts.length; i++) {
            const userFind = await client.users.fetch(contacts[i])
            const userS = await user.findOne({ userID: userFind.id })
            args.userNames.push(userFind.username)
            args.userIDs.push(userFind.id)
            args.userAvatars.push(userFind.avatarURL())
            args.userEmails.push(userS.profile[1]["email"])
            if (userFind.id === "630812692659044352") {
                args.userRoles.push("Owner, Developer")
            } else if (userFind.id === "434669571685744662") {
                args.userRoles.push("Developer, Assistant")
            }
        }

        res.render("../pages/contact.ejs", args)
    }
}