const { PermissionsBitField, ChannelType } = require('discord.js')
const client = require("../../bot/discord.js").client;
const dashuser = require("../../models/dashuser.js");
const server = require("../../models/server.js");
const user = require("../../models/user.js");
const jwt = require("jsonwebtoken");

module.exports = {
    name: "Dashboard/GuildID",
    url: "/dashboard/:id",
    run: async (req, res) => {
        delete require.cache[require.resolve("../pages/guild.ejs")]

        if (!req.params.id || !client.guilds.cache.has(req.params.id)) return res.redirect("/dashboard/guilds")
        if (!req.cookies.token) return res.redirect("/notloggedin?redirect=" + req.originalUrl)
        let decoded
        try {
            decoded = jwt.verify(req.cookies.token, process.env.JWTSECRET)
        } catch (e) { }
        if (!decoded) return res.redirect("/notloggedin?redirect=" + req.originalUrl)

        let data = await dashuser.findOne({ _id: decoded.uuid, userID: decoded.userID })
        if (!data) return res.redirect("/login?redirect=" + req.originalUrl)

        const guild = client.guilds.cache.get(req.params.id)
        if (!guild) return res.redirect("/dashboard/guilds")
        const member = client.guilds.cache.get(req.params.id).members.cache.get(data.userID)
        if (!member) return res.redirect("/dashboard/guilds")


        if (member.permissions.has(PermissionsBitField.Flags.ManageGuild) || member.permissions.has(PermissionsBitField.Flags.Administrator) || client.guilds.cache.get(g.id).ownerId == data.user.id) {

            let guildS = await server.findOne({ guildID: guild.id })
            if (!guildS) {
                guildS = new server({
                    guildID: guild.id,
                })
                await guildS.save()
            }

            guild.settings = guildS
            if (guild.icon !== null) {
                guild.avatar = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
            } else if (guild.icon === null) {
                guild.avatar = `../assets/icons/DraidDefaultLogin.png`
            }

            let channels = guild.channels.cache.filter(c => c.type === ChannelType.GuildText) || []
            guild.channels.text = channels.map(c => c)
            guild.channels.textcount = channels.size
            let roles = guild.roles.cache.filter(r => r.name !== "@everyone") || []
            guild.role = roles.map(r => r)
            guild.rolecount = roles.size


            let userS = await user.findOne({ userID: data.user.id })
            let admin = false
            if (userS.draiddevs[0]["developer"] == true && userS.draiddevs[1]["blacklisted"] == false) admin = true
            let args = {
                body: [`${guild.name}'s Dashboard | Draid`],
                avatar: `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png`,
                username: data.user.username,
                globalname: data.user.globalname,
                id: data.user.id,
                user: userS,
                guild: guild,


                welcomefunctions: `${guildS.settings[0]["welcome"] ? "" : "disabled"}`,
                welcomedm: `${guildS.settings[0]["welcomedmTF"] ? "disabled" : ""}`,

                admin: admin,
                loggedIn: true,

                success: false,
                errormsg: "No error.",
            }

            res.render("../pages/guild.ejs", args)
        } else return res.redirect("/dashboard/guilds")
    },
    run2: async (req, res) => {
        if (!req.body) return res.redirect("/dashboard/" + req.params.id)

        let success = true
        let errormsg = "No error."

        let { guild, member, data } = await verify(req, res);
        let guildS = await server.findOne({ guildID: guild.id });

        // console.log(req.body)

        if (!req.body.disallowedcommandchannels || req.body.disallowedcommandchannels == "none" || req.body.disallowedcommandchannels.includes("none") || req.body.disallowedcommandchannels == undefined) {
            req.body.disallowedcommandchannels = []
        }
        let currency = false
        if (!req.body.currency || req.body.currency == "off") {
            currency = false
        } else {
            currency = true
        }
        let music = false
        if (!req.body.music || req.body.music == "off") {
            music = false
        } else {
            music = true
        }
        let welcome = false
        if (!req.body.welcome || req.body.welcome == "off") {
            welcome = false
        } else {
            welcome = true
        }
        let welcomemessageTF = false
        if (!req.body.welcomemessage || req.body.welcomemessage == undefined) {
            req.body.welcomemessage = "None"
            welcomemessageTF = false
        } else if (req.body.welcomemessage == "None") {
            welcomemessageTF = false
        } else {
            welcomemessageTF = true
        }
        let welcomedmTF = false
        if (!req.body.welcomedmTF || req.body.welcomedmTF == "off") {
            welcomedmTF = false
        } else {
            welcomedmTF = true
        }
        let welcomechannelTF = false
        if (!req.body.welcomechannel || welcomedmTF == true || req.body.welcomechannel == "none" || req.body.welcomechannel == undefined) {
            req.body.welcomechannel = "None"
            welcomechannelTF = false
        } else {
            welcomechannelTF = true
        }
        let welcomeroleTF = false
        if (!req.body.welcomerole || req.body.welcomerole == "none" || req.body.welcomerole == undefined) {
            req.body.welcomerole = "None"
            welcomeroleTF = false
        } else {
            welcomeroleTF = true
        }
        let notifysongs = false
        if (!req.body.notifysongs || req.body.notifysongs == "off") {
            notifysongs = false
        } else {
            notifysongs = true
        }



        guildS.settings.set(0, { welcome: welcome, welcomemessage: req.body.welcomemessage, welcomemessageTF: welcomemessageTF, welcomedmTF: welcomedmTF, welcomechannel: req.body.welcomechannel, welcomechannelTF: welcomechannelTF, welcomerole: req.body.welcomerole, welcomeroleTF: welcomeroleTF })
        guildS.settings.set(2, { currency: currency, music: music })
        guildS.settings.set(3, { prefix: req.body.prefix, disallowedcommandchannels: req.body.disallowedcommandchannels })
        guildS.settings.set(4, { notifysongs: notifysongs, djrole: guildS.settings[4]["djrole"] })


        await guildS.save().catch(err => {
            console.log(err)

            success = false
            errormsg = "An error occured while saving the settings."
        })

        guildS = await server.findOne({ guildID: guild.id });


        guild.settings = guildS
        if (guild.icon !== null) {
            guild.avatar = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
        } else if (guild.icon === null) {
            guild.avatar = `../assets/icons/DraidDefaultLogin.png`
        }

        let channels = guild.channels.cache.filter(c => c.type === ChannelType.GuildText) || []
        guild.channels.text = channels.map(c => c)
        guild.channels.textcount = channels.size
        let roles = guild.roles.cache.filter(r => r.name !== "@everyone") || []
        guild.role = roles.map(r => r)
        guild.rolecount = roles.size

        let userS = await user.findOne({ userID: data.user.id });
        let admin = false
        if (userS.draiddevs[0]["developer"] == true && userS.draiddevs[1]["blacklisted"] == false) admin = true
        let args = {
            body: [`${guild.name}'s Dashboard | Draid`],
            avatar: `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png`,
            username: data.user.username,
            globalname: data.user.globalname,
            id: data.user.id,
            user: userS,
            guild: guild,


            welcomefunctions: `${guildS.settings[0]["welcome"] ? "" : "disabled"}`,
            welcomedm: `${guildS.settings[0]["welcomedmTF"] ? "disabled" : ""}`,

            admin: admin,
            loggedIn: true,

            success: success,
            errormsg: errormsg,
        }

        res.render("../pages/guild.ejs", args)
    }
}

async function verify(req, res) {
    if (!req.params.id || !client.guilds.cache.has(req.params.id)) return res.redirect("/dashboard/guilds")

    if (!req.cookies.token) return res.redirect("/notloggedin")
    let decoded
    try {
        decoded = await jwt.verify(req.cookies.token, process.env.JWTSECRET)
    } catch (e) { }
    if (!decoded) return res.redirect("/notloggedin")

    let data = await dashuser.findOne({ _id: decoded.uuid, userID: decoded.userID })
    if (!data) return res.redirect("/login")

    const guild = await client.guilds.cache.get(req.params.id)
    if (!guild) return res.redirect("/dashboard/guilds")
    const member = await guild.members.cache.get(data.user.id)
    if (!member) return res.redirect("/dashboard/guilds")

    return { guild, member, data }
}