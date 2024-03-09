const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    userID: { type: String },
    userUSERNAME: { type: String },

    profile: {
        type: Array, default: [
            {
                commandsused: 0,
                messagessent: 0,
                afk: false,
                afkreason: "None",
            },
            {
                email: "",
                number: "",
                bio: "Not set.",
            },
            {
                github: "Not set.",
                youtube: "Not set.",
                twitter: "Not set.",
                instagram: "Not set.",
                twitch: "Not set.",
                reddit: "Not set.",
                website: "Not set.",
            }
        ]
    },

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

    voting: {
        type: Array, default: [
            {
                sitevoted: "none",
                timeleft: 0,
                lastvoted: "date",
            }
        ]
    },

    settings: {
        type: Array, default: [
            {
                lang: "english",
                betamode: false,
                notifications: true,
            },
            {
                notepad: "none",
            },
            {
                showcontacts: false,
            }
        ]
    },

    // music: {
    //     type: Array, default: [
    //         {
    //             playlist1: [],
    //             playlist2: [],
    //             playlist3: []
    //         }
    //     ]
    // },

    tickets: {
        type: Array, default: [
            {
                channel: "None",
                ticketby: "None",
                claimed: "None",
                ticket: false,
            },
        ]
    },

    inventory: {
        type: Array, default: [
            {
                currency: 5000,
            },
            {
                laptop: 1,
                draidplush: 0,
            },
            {
                job: "Nobody",
                leftuses: 12,
                buildskill: 0,
                mechskill: 0,
                workskill: 0,
                progskill: 0,
                buildwork: 0,
                mechwork: 0,
                workwork: 0,
                progwork: 0
            }
        ]
    },


    achievements: {
        type: Array, default: [
            {
                finishedonestar: 0,
                finishedtwostar: 0,
                finishedthreestar: 0,
                finishedfourstar: 0,
                finishedfivestar: 0,
            },
            {
                finished: false,
                name: "Member :)",
                reward: 100,
                difficulty: "⭐",
            },
            {
                finished: false,
                name: "Beginner",
                reward: 50,
                difficulty: "⭐",
            },
            {
                finished: false,
                name: "Newbie :3",
                reward: 120,
                difficulty: "⭐",
            },
            {
                finished: false,
                name: "Shopper",
                reward: 150,
                difficulty: "⭐",
            },
            {
                finished: false,
                name: "Disappointed",
                reward: 200,
                difficulty: "⭐",
            },
            {
                finished: false,
                name: "Artist",
                reward: 150,
                difficulty: "⭐",
            },
            {
                finished: false,
                name: "AFK",
                reward: 100,
                difficulty: "⭐",
            },
            {
                finished: false,
                name: "Worker",
                reward: 225,
                difficulty: "⭐",
            },
            {
                finished: false,
                name: "Awesome!",
                reward: 500,
                difficulty: "⭐ ⭐",
            },
            {
                finished: false,
                name: "Voted!",
                reward: 500,
                difficulty: "⭐ ⭐",
            },
            {
                finished: false,
                name: "Adventurer",
                reward: 500,
                difficulty: "⭐ ⭐",
            },
            {
                finished: false,
                name: "Verified",
                reward: 650,
                difficulty: "⭐ ⭐",
            },
            {
                finished: false,
                name: "Reporter",
                reward: 750,
                difficulty: "⭐ ⭐",
            },
            {
                finished: false,
                name: "Active",
                reward: 1000,
                difficulty: "⭐ ⭐",
            },
            {
                finished: false,
                name: "Crazy",
                reward: 1500,
                difficulty: "⭐ ⭐ ⭐",
            },
            {
                finished: false,
                name: "Mona Lisa",
                reward: 2000,
                difficulty: "⭐ ⭐ ⭐",
            },
            {
                finished: false,
                name: "Contributor",
                reward: 2500,
                difficulty: "⭐ ⭐ ⭐",
            },
            {
                finished: false,
                name: "Millionaire",
                reward: 5000,
                difficulty: "⭐ ⭐ ⭐",
            },
            {
                finished: false,
                name: "Funny",
                reward: 7500,
                difficulty: "⭐ ⭐ ⭐ ⭐",
            },
            {
                finished: false,
                name: "Trustful",
                reward: 10000,
                difficulty: "⭐ ⭐ ⭐ ⭐",
            },
            {
                finished: false,
                name: "Tropical Seeker",
                reward: 12500,
                difficulty: "⭐ ⭐ ⭐ ⭐",
            },
            {
                finished: false,
                name: "Supportive",
                reward: 15000,
                difficulty: "⭐ ⭐ ⭐ ⭐",
            },
            {
                finished: false,
                name: "Chosen One",
                reward: 17500,
                difficulty: "⭐ ⭐ ⭐ ⭐"
            },
            {
                finished: false,
                name: "Tester",
                reward: 20000,
                difficulty: "⭐ ⭐ ⭐ ⭐",
            },
            {
                finished: false,
                name: "Power",
                reward: 25000,
                difficulty: "⭐ ⭐ ⭐ ⭐",
            },
            {
                finished: false,
                name: "Billionaire",
                reward: 50000,
                difficulty: "⭐ ⭐ ⭐ ⭐ ⭐",
            },
            {
                finished: false,
                name: "Tryhard",
                reward: 100000,
                difficulty: "⭐ ⭐ ⭐ ⭐ ⭐",
            },
            {
                finished: false,
                name: "Collabration",
                reward: 150000,
                difficulty: "⭐ ⭐ ⭐ ⭐ ⭐",
            },
            {
                finished: false,
                name: "Friendly",
                reward: 250000,
                difficulty: "⭐ ⭐ ⭐ ⭐ ⭐"
            },
            {
                finished: false,
                name: "Master Achiever",
                reward: 500000,
                difficulty: "⭐ ⭐ ⭐ ⭐ ⭐",
            }
        ]
    },
});

module.exports = model('User', UserSchema);