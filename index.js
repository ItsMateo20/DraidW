require("dotenv").config()
const { gray, cyan, red, green } = require("chalk")
if (!process.env.CLIENTID || !process.env.CLIENTSECRET || !process.env.MONGODBLOGIN || !process.env.REDIRECTURI || !process.env.JWTSECRET) {
    console.log(gray("[SITE]: ") + red("Missing .env variables"))
    process.exit(1)
} else if (!process.env.HOSTNAME && !process.env.HOSTNAMEDEV) {
    console.log(gray("[SITE]: ") + red("No hostname provided"))
    process.exit(1)
} else if (!process.env.PORT) {
    console.log(gray("[SITE]: ") + red("No port provided"))
    process.exit(1)
} else if (process.env.HOSTNAME && process.env.HOSTNAMEDEV) {
    console.log(gray("[SITE]: ") + red("Both hostname and hostnamedev provided"))
    process.exit(1)
} else if (process.env.HOSTNAME && !process.env.HOSTNAMEDEV) {
    console.log(gray("[SITE]: ") + green(`Using main hostname (${process.env.HOSTNAME})`))
} else if (!process.env.HOSTNAME && process.env.HOSTNAMEDEV) {
    console.log(gray("[SITE]: ") + green(`Using dev hostname (${process.env.HOSTNAMEDEV})`))
}

const express = require('express')
const app = express()

const DiscordLogin = require("discord-oauth2")
const CookieParser = require("cookie-parser")
const UrlEncodedParser = require("body-parser").urlencoded({ extended: false })

const { readdirSync } = require('fs')
const mongoose = require("mongoose");

const hostname = process.env.HOSTNAME || process.env.HOSTNAMEDEV

// mongoose.set('strictQuery', true);
// mongoose.connect(process.env.MONGODBLOGIN, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => {
//     console.log(gray("[SITE]: ") + cyan("Connected to MongoDB!"));

app.use((req, res, next) => {
    res.setHeader('x-content-type-options', 'nosniff');
    res.setHeader('cache-control', 'no-cache, proxy-revalidate');
    next();
});
app.disable('x-powered-by');
app.enable("trust proxy")
app.set("etag", false)
app.use(CookieParser())
app.use(UrlEncodedParser)
app.set("view engine", "ejs")
app.set("views", __dirname + "/web/pages")
// process.oauth = new DiscordLogin({
//     clientId: process.env.CLIENTID,
//     clientSecret: process.env.CLIENTSECRET,
//     redirectUri: hostname + process.env.REDIRECTURI,
// })

app.use(express.static(__dirname + '/web'))

let files = readdirSync(__dirname + '/web/routes/')
files.forEach(f => {
    const file = require(`./web/routes/${f}`)
    if (file && file.url) {
        if (file.url == "/" || file.url == "/goodbye" || file.url == "/termsofservice" || file.url == "/privacypolicy") {
            app.get(file.url, file.run)
            console.log(gray("[SITE]: ") + cyan(`Loaded /web/${file.name.toLowerCase()}`))
        }
        // app.get(file.url, file.run)
        // if (file.run2) app.post(file.url, file.run2)
        // if (file.run3) app.post(file.url, file.run3)
        // console.log(gray("[SITE]: ") + cyan(`Loaded /web/${file.name.toLowerCase()}`))
    }
})

app.get("/", (req, res) => {
    res.redirect("/goodbye")
})

app.get("/.well-known/discord", (req, res) => {
    res.sendFile(__dirname + "/.well-known/discord.txt")
})

app.use((req, res) => {
    res.status(404).redirect("/404")
});
app.use((req, res) => {
    res.status(302).redirect("/404")
});


app.listen(process.env.PORT || 3000, () => console.log(gray("[SITE]: ") + cyan(`Listening on port ${process.env.PORT || 3000}`)))
// });