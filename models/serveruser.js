const { Schema, model } = require("mongoose");

const ServerUserSchema = new Schema({
    guildID: { type: String },
    userID: { type: String },

    warns: {
        type: Array, default: [
            {
                warns: 0,
                reason: "None",
            },
        ]
    },

});

module.exports = model('ServerUser', ServerUserSchema);