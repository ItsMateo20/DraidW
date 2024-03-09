require("dotenv").config();
const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences]
})

const { gray, cyan } = require("chalk")

client.on('ready', () => {
  client.user.setStatus('idle')
  console.log(gray("[MAIN-BOT]: ") + cyan(`Logged in as ${client.user.tag}`))
})

module.exports.client = client

// const topggpost = require('topgg-autoposter')
// const topggapp = topggpost.AutoPoster(process.env.TOPGGTOKEN, client)
// topggapp.on('posted', () => {
//   console.log(gray("[Top-GG_AutoPoster]: ") + cyan("Posted stats to top.gg"));
// })

client.login(process.env.TOKEN)