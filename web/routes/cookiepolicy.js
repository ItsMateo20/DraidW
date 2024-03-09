module.exports = {
    name: "CookiePolicy",
    url: "/cookiepolicy",
    run: async (req, res) => {
        res.redirect("/privacypolicy")
    }
}