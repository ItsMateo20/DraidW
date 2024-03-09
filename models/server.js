const { Schema, model } = require("mongoose");

const ServerSchema = new Schema({
    guildID: { type: String },

    draiddevs: {
        type: Array, default: [
            {
                developer: false,
            },
            {
                blacklisted: false,
            },
        ]
    },


    settings: {
        type: Array, default: [
            {
                welcome: false,
                welcomemessage: "Welcome to the server, ${user_name}!",
                welcomemessageTF: false,
                welcomedmTF: false,
                welcomechannel: "None",
                welcomechannelTF: false,
                welcomerole: "None",
                welcomeroleTF: false,
            },
            {
                badwords: false,
                links: false,
            },
            {
                currency: false,
                music: false,
                logs: false,
            },
            {
                prefix: ",",
                disallowedcommandchannels: [],
            },
            {
                notifysongs: true,
                djrole: "None",
            }
        ]
    },

    logs: {
        type: Array, default: [
            {
                channel: "None",
            },
            {
                applicationCommandPermissionsUpdate: false,
                autoModerationActionExecution: false,
                autoModerationRuleCreate: false,
                autoModerationRuleDelete: false,
                autoModerationRuleUpdate: false,
                channelCreate: false,
                channelDelete: false,
                channelPinsUpdate: false,
                channelUpdate: false,
                emojiCreate: false,
                emojiDelete: false,
                emojiUpdate: false,
                guildBanAdd: false,
                guildBanRemove: false,
                guildIntegrationsUpdate: false,
                guildMemberUpdate: false,
                guildScheduledEventCreate: false,
                guildScheduledEventDelete: false,
                guildScheduledEventUpdate: false,
                guildUpdate: false,
                inviteCreate: false,
                inviteDelete: false,
                messageDelete: false,
                messageDeleteBulk: false,
                messageReactionRemoveAll: false,
                messageReactionRemoveEmoji: false,
                messageUpdate: false,
                roleCreate: false,
                roleDelete: false,
                roleUpdate: false,
                stageInstanceCreate: false,
                stageInstanceDelete: false,
                stageInstanceUpdate: false,
                stickerCreate: false,
                stickerDelete: false,
                stickerUpdate: false,
                threadCreate: false,
                threadDelete: false,
                threadUpdate: false,
                webhooksUpdate: false
            }
        ]
    },

    warns: {
        type: Array, default: [
            {
                warnsamounttier1: 3,
                warnsamounttier2: 4,
                warnsamounttier3: 5,
            },
            {
                warnsactiontier1: "mute",
                warnsactiontier2: "kick",
                warnsactiontier3: "ban",
            }
        ]
    },

    tickets: {
        type: Array, default: [
            {
                channel: "None",
                channelTF: false,
                role: "None",
                roleTF: false,
            },
        ]
    },
});

module.exports = model('Server', ServerSchema);