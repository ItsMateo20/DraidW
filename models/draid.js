const { Schema, model } = require("mongoose");

const draidSchema = new Schema({
    userID: { type: String },
    spying: {
        type: Array, default: [
            {
                spy: false,
                spying: "None",
                type: "None",
            }
        ]
    },
    changelog: {
        type: Array, default: [
            {
                editedby: "None",
                lastedited: "",
                settingTitle: "None",
                settingDescription1: "None",
                settingDescription2: "None",
                settingDescription3: "None",
                settingDescription4: "None",
                settingDescription5: "None"
            },
            {
                Title: "None",
                Description1: "None",
                Description2: "None",
                Description3: "None",
                Description4: "None",
                Description5: "None"
            },
            {
                Title: "None",
                Description1: "None",
                Description2: "None",
                Description3: "None",
                Description4: "None",
                Description5: "None"
            },
            {
                Title: "None",
                Description1: "None",
                Description2: "None",
                Description3: "None",
                Description4: "None",
                Description5: "None"
            },
            {
                Title: "None",
                Description1: "None",
                Description2: "None",
                Description3: "None",
                Description4: "None",
                Description5: "None"
            },
            {
                Title: "None",
                Description1: "None",
                Description2: "None",
                Description3: "None",
                Description4: "None",
                Description5: "None"
            },
            {
                Title: "None",
                Description1: "None",
                Description2: "None",
                Description3: "None",
                Description4: "None",
                Description5: "None"
            }
        ],
    },
});

module.exports = model('Draid', draidSchema);