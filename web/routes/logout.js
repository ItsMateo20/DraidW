module.exports = {
    name: "Logout",
    url: "/logout",
    run: async (req, res) => {
        res.clearCookie("token")
        res.redirect("/")
    }
}