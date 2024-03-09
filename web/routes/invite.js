
module.exports = {
    name: "Invite",
    url: "/invite",
    run: async (req, res) => {
        res.redirect("https://discord.com/api/oauth2/authorize?client_id=831829384884518923&permissions=1642790845687&scope=bot%20applications.commands")
    }
}