const client = require("../../bot/discord.js").client
const dashuser = require("../../models/dashuser.js");
const jwt = require("jsonwebtoken");

module.exports = {
    name: "Dashboard",
    url: "/dashboard",
    run: async (req, res) => {
        res.redirect("/dashboard/guilds")
    }
}