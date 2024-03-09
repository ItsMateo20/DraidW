const dashuser = require("../../models/dashuser.js");
const user = require("../../models/user.js");
const server = require("../../models/server.js");
const serveruser = require("../../models/serveruser.js");
const jwt = require("jsonwebtoken");

module.exports = {
    name: "AdminPanel",
    url: "/adminpanel",
    run: async (req, res) => {
        delete require.cache[require.resolve("../pages/admin.ejs")]

        if (!req.cookies.token) return res.redirect("/notloggedin?redirect=" + req.originalUrl)
        let decoded
        try {
            decoded = jwt.verify(req.cookies.token, process.env.JWTSECRET)
        } catch (e) { }
        if (!decoded) return res.redirect("/notloggedin?redirect=" + req.originalUrl)

        let data = await dashuser.findOne({ _id: decoded.uuid, userID: decoded.userID })
        if (!data) return res.redirect("/login?redirect=" + req.originalUrl)

        let userS = await user.findOne({ userID: data.userID })
        if (!userS) return res.redirect("/login?redirect=" + req.originalUrl)
        if (userS.draiddevs[0]["developer"] == false || userS.draiddevs[1]["blacklisted"] == true) return res.redirect("/home")

        let userData = data
        let serverData = {}
        let serverUserData = {}
        let selectedData = false
        let selectedDataType = ""

        if (req.cookies.dbtype || req.cookies.dbtype == "user" || req.cookies.dbtype == "server" || req.cookies.dbtype == "serveruser") {
            if (req.cookies.dbtype == "user" && req.cookies.dbid2 !== "|") {
                userData = await user.findOne({ userID: req.cookies.dbid2 })
                if (!userData) {
                    res.clearCookie("dbid")
                    res.clearCookie("dbid2")
                    res.clearCookie("dbtype")
                    selectedData = false
                    error = "Invalid user ID"
                    return res.redirect("/adminpanel?error=" + error)
                }
                selectedDataType = "user"
                selectedData = true
            } else if (req.cookies.dbtype == "server" && req.cookies.dbid !== "|") {
                serverData = await server.findOne({ guildID: req.cookies.dbid })
                if (!serverData) {
                    res.clearCookie("dbid")
                    res.clearCookie("dbid2")
                    res.clearCookie("dbtype")
                    selectedData = false
                    error = "Invalid server ID"
                    return res.redirect("/adminpanel?error=" + error)
                }
                selectedDataType = "server"
                selectedData = true
            } else if (req.cookies.dbtype == "serveruser" && req.cookies.dbid !== "|" && req.cookies.dbid2 !== "|") {
                serverUserData = await serveruser.findOne({ guildID: req.cookies.dbid2, userID: req.cookies.dbid })
                if (!serverUserData) {
                    res.clearCookie("dbid")
                    res.clearCookie("dbid2")
                    res.clearCookie("dbtype")
                    selectedData = false
                    error = "Invalid serveruser ID"
                    return res.redirect("/adminpanel?error=" + error)
                }
                selectedDataType = "serveruser"
                selectedData = true
            }
        }




        let args = {
            body: [`Admin | Draid`],
            avatar: `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png`,
            username: data.user.username,
            globalname: data.user.globalname,
            id: data.user.id,


            selectedData,
            selectedDataType,

            userData,
            serverData,
            serverUserData,

            errormsg: req.query.error || false,
            admin: true,
            loggedIn: true,
        }

        res.render("../pages/admin.ejs", args)
    },
    run2: async (req, res) => {
        if (!req.body) return res.redirect("/adminpanel")
        delete require.cache[require.resolve("../pages/admin.ejs")]

        if (req.body.back && req.body.back == "true") {
            res.clearCookie("dbid")
            res.clearCookie("dbid2")
            res.clearCookie("dbtype")
            return res.redirect("/adminpanel")
        }

        if (!req.cookies.token) return res.redirect("/notloggedin?redirect=" + req.originalUrl)
        let decoded
        try {
            decoded = jwt.verify(req.cookies.token, process.env.JWTSECRET)
        } catch (e) { }
        if (!decoded) return res.redirect("/notloggedin?redirect=" + req.originalUrl)

        let data = await dashuser.findOne({ _id: decoded.uuid, userID: decoded.userID })
        if (!data) return res.redirect("/login?redirect=" + req.originalUrl)

        let userS = await user.findOne({ userID: data.userID })
        if (!userS) return res.redirect("/login?redirect=" + req.originalUrl)
        if (userS.draiddevs[0]["developer"] == false || userS.draiddevs[1]["blacklisted"] == true) return res.redirect("/home")

        let userData = data
        let serverData
        let serverUserData
        let selectedData
        let selectedDataType

        console.log(req.body)


        if (req.body.dbtype || req.body.dbtype == "user" || req.body.dbtype == "server" || req.body.dbtype == "serveruser") {
            if (req.body.dbtype == "user" && req.body.dbid2 !== "|") {
                userData = await user.findOne({ userID: req.body.dbid2 })
                if (!userData) {
                    res.clearCookie("dbid")
                    res.clearCookie("dbid2")
                    res.clearCookie("dbtype")
                    selectedData = false
                    error = "Invalid user ID"
                    return res.redirect("/adminpanel?error=" + error)
                }
                selectedDataType = "user"
                selectedData = true
            } else if (req.body.dbtype == "server" && req.body.dbid !== "|") {
                serverData = await server.findOne({ guildID: req.body.dbid })
                if (!serverData) {
                    res.clearCookie("dbid")
                    res.clearCookie("dbid2")
                    res.clearCookie("dbtype")
                    selectedData = false
                    error = "Invalid server ID"
                    return res.redirect("/adminpanel?error=" + error)
                }
                selectedDataType = "server"
                selectedData = true
            } else if (req.body.dbtype == "serveruser" && req.body.dbid !== "|" && req.body.dbid2 !== "|") {
                serverUserData = await serveruser.findOne({ guildID: req.body.dbid2, userID: req.body.dbid })
                if (!serverUserData) {
                    res.clearCookie("dbid")
                    res.clearCookie("dbid2")
                    res.clearCookie("dbtype")
                    selectedData = false
                    error = "Invalid server or user ID"
                    return res.redirect("/adminpanel?error=" + error)
                }
                selectedDataType = "serveruser"
                selectedData = true
            }
            res.cookie("dbid", req.body.dbid, { maxAge: 86400000 })
            res.cookie("dbtype", req.body.dbtype, { maxAge: 86400000 })
            if (req.body.dbid2 !== "") res.cookie("dbid2", req.body.dbid2, { maxAge: 86400000 })
        } else {
            selectedData = false
            error = "Invalid data type or ID"
            return res.redirect("/adminpanel?error=" + error)
        }


        let args = {
            body: [`Admin | Draid`],
            avatar: `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png`,
            username: data.user.username,
            globalname: data.user.globalname,
            id: data.user.id,


            selectedData,
            selectedDataType,

            userData,
            serverData,
            serverUserData,

            errormsg: req.query.error || false,
            admin: true,
            loggedIn: true,
        }

        res.render("../pages/admin.ejs", args)
    }
}