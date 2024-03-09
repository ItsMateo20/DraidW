const { Schema, model } = require("mongoose");

const dashboardSchema = new Schema({
    userID: String,
    access_token: String,
    refresh_token: String,
    expires_in: String,
    secretAccessKey: String,
    user: {
        id: String,
        username: String,
        globalname: String,
        banner: String,
        avatar: String,
    }
});

module.exports = model('DashUser', dashboardSchema);