const dashuser = require("../../models/dashuser.js");
const jwt = require("jsonwebtoken");

module.exports = {
    name: "Login",
    url: "/login",
    run: async (req, res) => {
        const url = process.oauth.generateAuthUrl({
            scope: ["identify", "guilds"],
            state: require("crypto").randomBytes(16).toString("hex"),
        })
        let redirect = "/user"
        if (req.query.redirect) {
            redirect = req.query.redirect
            res.cookie("redirect", req.query.redirect, { maxAge: 86400000 })
        }

        if (!req.cookies || !req.cookies.token) return res.redirect(url)
        if (req.cookies.token && req.cookies.token.length > 0) {
            let decoded
            try {
                decoded = jwt.verify(req.cookies.token, process.env.JWTSECRET)
            } catch (e) {
                return res.redirect("/login")
            }

            if (!decoded) return res.redirect(url)
            let data = await dashuser.findOne({ _id: decoded.uuid, userID: decoded.userID })
            if (!data) return res.redirect(url)

            else {
                if (Date.now() > data.expires_in * 1000) {
                    const oauthData = await process.oauth.tokenRequest({
                        refreshToken: data.refresh_token,
                        grantType: "refresh_token",
                        scope: ["identify", "guilds"],
                    })
                    data.access_token = oauthData.access_token
                    data.refresh_token = oauthData.refresh_token
                    data.expires_in = oauthData.expires_in
                }
                await data.save()
                res.redirect(redirect)
            }
        }
    }
}