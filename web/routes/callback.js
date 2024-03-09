const dashuser = require("../../models/dashuser.js");
const jwt = require("jsonwebtoken");

module.exports = {
    name: "Api/callback",
    url: "/api/callback",
    run: async (req, res) => {
        if (!req.query.code) return res.redirect("/login")
        let redirect = "/user"
        if (req.cookies.redirect) {
            redirect = req.cookies.redirect
        }
        let oauthData
        try {
            oauthData = await process.oauth.tokenRequest({
                code: req.query.code,
                scope: ["identify", "guilds"],
                grantType: "authorization_code",
            })
        } catch (e) { }

        if (!oauthData) return res.redirect("/login")

        const user = await process.oauth.getUser(oauthData.access_token)
        let data = await dashuser.findOne({ userID: user.id })
        if (!data) data = new dashuser({ userID: user.id })

        const id = data._id.toString()
        data.access_token = oauthData.access_token
        data.refresh_token = oauthData.refresh_token
        data.expires_in = oauthData.expires_in
        data.secretAccessKey = jwt.sign({ userID: user.id, uuid: id }, process.env.JWTSECRET)
        data.user = {
            id: user.id,
            globalname: user.global_name,
            username: user.username,
            banner: user.banner,
            avatar: user.avatar,
        }
        await data.save()
        res.cookie("token", data.secretAccessKey, { maxAge: 86400000 })
        res.redirect(redirect)
    }
}