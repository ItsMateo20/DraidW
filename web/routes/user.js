const client = require("../../bot/discord.js").client;
const dashuser = require("../../models/dashuser.js");
const user = require("../../models/user.js");
const jwt = require("jsonwebtoken");

const dateFormat = require("date-and-time");

module.exports = {
    name: "User",
    url: "/user/:id",
    run: async (req, res) => {
        delete require.cache[require.resolve("../pages/user.ejs")]

        if (req.params.id && req.params.id !== "settings") {

            let data
            let userSS
            if (req.cookies.token) {
                let decoded
                try {
                    decoded = jwt.verify(req.cookies.token, process.env.JWTSECRET)
                } catch (e) { }
                if (!decoded) return res.redirect("/notloggedin")

                data = await dashuser.findOne({ _id: decoded.uuid, userID: decoded.userID })
                if (!data) return res.redirect("/login?redirect=/user/" + req.params.id)

                userSS = await user.findOne({ userID: data.userID })
                if (!userSS) return res.redirect("/login")
            }


            let dataS = await dashuser.findOne({ userID: req.params.id })
            if (!dataS) return res.redirect("/user")

            let userS = await user.findOne({ userID: req.params.id })
            if (!userS) return res.redirect("/user")

            let userFind = client.users.cache.get(req.params.id)
            if (!userFind) return res.redirect("/user")


            let staff
            if (userS.draiddevs[0]["staff"] && userS.draiddevs[0]["staff"] == true) {
                staff = "True"
            } else if (!userS.draiddevs[0]["staff"] || userS.draiddevs[0]["staff"] == false) {
                staff = "False"
            }
            let developer
            if (userS.draiddevs[0]["developer"] == false) {
                developer = "False"
            } else if (userS.draiddevs[0]["developer"] == true) {
                developer = "True"
            }
            let lang
            if (userS.settings[0]["lang"] == "english") {
                lang = "English"
            } else if (userS.settings[0]["lang"] == "polish") {
                lang = "Polish"
            }

            let owner = "False"
            if (userSS) {
                if (userS.userID == userSS.userID) {
                    owner = "True"
                } else if (userS.userID !== userSS.userID) {
                    owner = "False"
                }
            }

            let args
            let admin = false
            if (userSS) {
                if (userS.draiddevs[0]["developer"] == true && userS.draiddevs[1]["blacklisted"] == false) admin = true
                let profile = [userS.profile[1]["bio"], userS.profile[1]["email"], userS.profile[1]["number"], userS.profile[2]["github"], userS.profile[2]["youtube"], userS.profile[2]["spotify"], userS.profile[2]["twitter"], userS.profile[2]["instagram"], userS.profile[2]["twitch"], userS.profile[2]["reddit"], userS.profile[2]["website"], dateFormat.format(userFind.createdAt, 'ddd, MMM DD YYYY'), developer, lang, staff].map((value) => value || '');
                args = {
                    body: [`${dataS.user.username}'s profile | Draid`],
                    avatar: `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png`,
                    username: data.user.username,
                    globalname: data.user.globalname,
                    id: data.user.id,

                    admin: admin,
                    loggedIn: true,


                    avatar1: `https://cdn.discordapp.com/avatars/${dataS.user.id}/${dataS.user.avatar}.png`,
                    username1: dataS.user.username,
                    globalname1: dataS.user.globalname,
                    id1: dataS.user.id,
                    owner: owner,

                    profileTF: true,
                    profile,
                }
            } else if (!userSS) {
                let profile = [userS.profile[1]["bio"], userS.profile[1]["email"], userS.profile[1]["number"], userS.profile[2]["github"], userS.profile[2]["youtube"], userS.profile[2]["spotify"], userS.profile[2]["twitter"], userS.profile[2]["instagram"], userS.profile[2]["twitch"], userS.profile[2]["reddit"], userS.profile[2]["website"], dateFormat.format(userFind.createdAt, 'ddd, MMM DD YYYY'), developer, lang].map((value) => value || '');
                args = {
                    body: [`${dataS.user.username}'s profile | Draid`],
                    avatar: "../assets/icons/DraidDefaultLogin.png",
                    username: "",
                    globalname: "",
                    id: "",

                    admin: admin,
                    loggedIn: false,


                    avatar1: `https://cdn.discordapp.com/avatars/${dataS.user.id}/${dataS.user.avatar}.png`,
                    username1: dataS.user.username,
                    globalname1: dataS.user.globalname,
                    id1: dataS.user.id,
                    owner: owner,

                    profileTF: true,
                    profile,
                }
            }
            res.render("../pages/user.ejs", args)
        } else if (req.params.id == "settings") {
            if (!req.cookies.token) return res.redirect("/notloggedin")
            let decoded
            try {
                decoded = jwt.verify(req.cookies.token, process.env.JWTSECRET)
            } catch (e) { }
            if (!decoded) return res.redirect("/notloggedin")

            let data = await dashuser.findOne({ _id: decoded.uuid, userID: decoded.userID })
            if (!data) return res.redirect("/login")

            let userS = await user.findOne({ userID: data.user.id })
            let admin = false
            if (userS.draiddevs[0]["developer"] == true && userS.draiddevs[1]["blacklisted"] == false) admin = true
            let args = {
                body: [`User settings | Draid`],
                avatar: `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png`,
                username: data.user.username,
                globalname: data.user.globalname,
                id: data.user.id,


                admin: admin,
                loggedIn: true,

                success: false,
                settings: {
                    language: userS.settings[0]["lang"],
                    betamode: userS.settings[0]["betamode"],
                    notifications: userS.settings[0]["notifications"],
                    email: userS.profile[1]["email"],
                    number: userS.profile[1]["number"],
                    bio: userS.profile[1]["bio"],
                    github: userS.profile[2]["github"],
                    youtube: userS.profile[2]["youtube"],
                    spotify: userS.profile[2]["spotify"],
                    twitter: userS.profile[2]["twitter"],
                    instagram: userS.profile[2]["instagram"],
                    twitch: userS.profile[2]["twitch"],
                    reddit: userS.profile[2]["reddit"],
                    website: userS.profile[2]["website"],
                }
            }

            res.render("../pages/userSettings.ejs", args)
        }
    },
    run2: async (req, res) => {
        if (req.body && req.body.search) {
            let userSS
            if (req.body.search) {
                userSS = await dashuser.findOne({ userID: req.body.search })
                if (!userSS) {
                    userSS = await dashuser.findOne({ 'user.username': req.body.search })
                    if (!userSS) {
                        userSS = await dashuser.findOne({ 'user.globalname': req.body.search })
                    }
                }
                if (userSS) {
                    if (userSS.userID == req.body.search || userSS.user.username == req.body.search || userSS.user.globalname == req.body.search) {
                        res.redirect("/user/" + userSS.userID)
                    } else return res.redirect("/user")
                } else if (!userSS) return res.redirect("/user")
            } else {
                res.redirect("/user")
            }
        } else if (req.body || req.url == "/user/settings") {

            let { data } = await verify(req, res);
            let userS = await user.findOne({ userID: data.user.id });

            let email = req.body.email || userS.profile[1]["email"];
            let number = req.body.number || userS.profile[1]["number"];
            let bio = req.body.bio || userS.profile[1]["bio"];

            let github = req.body.github || userS.profile[2]["github"];
            let youtube = req.body.youtube || userS.profile[2]["youtube"];
            let spotify = req.body.spotify || userS.profile[2]["spotify"];
            let twitter = req.body.twitter || userS.profile[2]["twitter"];
            let instagram = req.body.instagram || userS.profile[2]["instagram"];
            let twitch = req.body.twitch || userS.profile[2]["twitch"];
            let reddit = req.body.reddit || userS.profile[2]["reddit"];
            let website = req.body.website || userS.profile[2]["website"];


            // if (req.body.betamode == "on") {
            //     req.body.betamode = true
            // } else if (!req.body.betamode) {
            //     req.body.betamode = false
            // }

            // if (req.body.notifications == "on") {
            //     req.body.notifications = true
            // } else if (!req.body.notifications) {
            //     req.body.notifications = false
            // }

            // if (req.body.language) {
            //     if (req.body.language == 'English') {
            //         req.body.language = 'english'
            //     } else if (req.body.language == 'Polish') {
            //         req.body.language = 'polish'
            //     }
            // }


            let language = req.body.language || userS.settings[0]["lang"];
            let betamode = req.body.betamode
            let notifications = req.body.notifications

            if (!betamode) {
                betamode = false
            }
            if (!notifications) {
                notifications = false
            }

            userS.profile.set(2, { github: github, youtube: youtube, spotify: spotify, twitter: twitter, instagram: instagram, twitch: twitch, reddit: reddit, website: website });
            userS.profile.set(1, { email: email, number: number, bio: bio });
            userS.settings.set(0, { lang: language, betamode: betamode, notifications: notifications });

            await userS.save();

            let admin = false
            if (userS.draiddevs[0]["developer"] == true && userS.draiddevs[1]["blacklisted"] == false) admin = true
            let args = {
                body: [`User settings | Draid`],
                avatar: `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png`,
                username: data.user.username,
                globalname: data.user.globalname,
                id: data.user.id,

                admin: admin,
                loggedIn: true,

                success: true,
                settings: {
                    language: userS.settings[0]["lang"],
                    betamode: userS.settings[0]["betamode"],
                    notifications: userS.settings[0]["notifications"],
                    email: userS.profile[1]["email"],
                    number: userS.profile[1]["number"],
                    bio: userS.profile[1]["bio"],
                    github: userS.profile[2]["github"],
                    youtube: userS.profile[2]["youtube"],
                    spotify: userS.profile[2]["spotify"],
                    twitter: userS.profile[2]["twitter"],
                    instagram: userS.profile[2]["instagram"],
                    twitch: userS.profile[2]["twitch"],
                    reddit: userS.profile[2]["reddit"],
                    website: userS.profile[2]["website"],
                }
            }

            res.render("../pages/userSettings.ejs", args)
        } else return res.redirect("/user/settings")
    }
}

async function verify(req, res) {
    delete require.cache[require.resolve("../pages/userSettings.ejs")];

    if (!req.cookies.token) return res.redirect("/notloggedin")
    let decoded
    try {
        decoded = jwt.verify(req.cookies.token, process.env.JWTSECRET)
    } catch (e) { }
    if (!decoded) return res.redirect("/notloggedin")

    let data = await dashuser.findOne({ _id: decoded.uuid, userID: decoded.userID })
    if (!data) return res.redirect("/login")

    return { data }
}