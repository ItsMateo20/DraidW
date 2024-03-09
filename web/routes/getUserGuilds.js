const { PermissionsBitField } = require('discord.js')
const client = require("../../bot/discord.js").client;
const dashuser = require("../../models/dashuser.js");
const user = require("../../models/user.js");
const jwt = require("jsonwebtoken");

module.exports = {
    name: "Dashboard/guilds",
    url: "/dashboard/guilds",
    run: async (req, res) => {
        delete require.cache[require.resolve("../pages/guilds.ejs")]

        if (!req.cookies.token) return res.redirect("/notloggedin?redirect=" + req.originalUrl)
        let decoded
        try {
            decoded = jwt.verify(req.cookies.token, process.env.JWTSECRET)
        } catch (e) { }
        if (!decoded) return res.redirect("/notloggedin?redirect=" + req.originalUrl)

        let data = await dashuser.findOne({ _id: decoded.uuid, userID: decoded.userID })
        if (!data) return res.redirect("/login?redirect=" + req.originalUrl)

        let guildArray = await process.oauth.getUserGuilds(data.access_token)
        let mutualArray = []

        guildArray.forEach(async g => {
            if (client.guilds.cache.get(g.id)) {
                const member = client.guilds.cache.get(g.id).members.cache.get(data.userID)
                if (member) {
                    if (g.icon !== null) {
                        g.avatar = `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`
                    } else if (g.icon === null) {
                        g.avatar = `../assets/icons/DraidDefaultLogin.png`
                    }
                    if (member.permissions.has(PermissionsBitField.Flags.ManageGuild) || member.permissions.has(PermissionsBitField.Flags.Administrator) || client.guilds.cache.get(g.id).ownerId == data.user.id) g.hasPerm = true
                    mutualArray.push(g)
                    var i = Math.floor(Math.random() * 9) + 1;
                    g.banner = `../assets/images/cardbanners/${i}.png`
                } else g.hasPerm = false;
            } else g.hasPerm = false;
        });

        let userS = await user.findOne({ userID: data.user.id })
        let admin = false
        if (userS.draiddevs[0]["developer"] == true && userS.draiddevs[1]["blacklisted"] == false) admin = true
        let args = {
            body: ["Dashboard's | Draid"],
            avatar: `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png`,
            username: data.user.username,
            globalname: data.user.globalname,
            id: data.user.id,
            user: userS,


            admin: admin,
            loggedIn: true,

            guilds: guildArray,
            adminGuilds: mutualArray,
        }

        res.render("../pages/guilds.ejs", args)
    }
}