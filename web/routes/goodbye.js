module.exports = {
    name: "goodbye",
    url: "/goodbye",
    run: async (req, res) => {
        delete require.cache[require.resolve("../pages/goodbye.ejs")]

        let args = {
            body: ["Farewell | Draid"],
            avatar: "../assets/icons/DraidDefaultLogin.png",
            username: "",
            globalname: "",
            id: "",

            admin: false,
            loggedIn: false,
        }
        res.render("../pages/goodbye.ejs", args)
    }
}