const Discord = require('discord.js');
const client = new Discord.Client({ intents: [98303], allowedMentions: { parse: ['users', 'roles'], repliedUser: false } })
const fs = require("fs")
const whitelist = require("../settings/whitelist.json")
const config = require("../settings/tokens.json")
const conf = require("../settings/config.json")


let embed = new Discord.MessageEmbed().setColor('RANDOM').setTimestamp().setFooter({ text: 'Rowy was here.' })
client.login(config.guardMain)

Promise.prototype.delete = function (time) {
    if (this) this.then(s => {
        if (s.deletable) {
            setTimeout(async () => {
                s.delete().catch(e => { });
            }, time * 1000)
        }
    });
};

class Guard {

    static async checkWhitelist(uye) {

        let guild = client.guilds.cache.get(await db.get(`serverData.guildId`))
        if (!guild) return;

        let members = client.guilds.cache.get(guild.id).members.cache.get(uye);
        let whitelisted = whitelist.whitelist || [];
        if (!members || members.id === client.user.id || conf.developers.includes(member.id) || conf.owners.includes(member.id) || members.id === members.guild.ownerId || whitelisted.some(x => members.id === x.slice(1))) return true
        else return false;

    }

    static async whitelist(uye, channel) {

        let whitelisted = whitelist.whitelist || []

        if (whitelisted.some(x => x.includes(uye))) {

            await client.channels.cache.get(channel).send({ content: `<@${uye}> (\`\`${uye}\`\`) adlı üye güvenilir listeden çıkartıldı.` })

            whitelisted = whitelisted.filter(x => !x.includes(uye));
            whitelist.whitelist = whitelisted;
            fs.writeFile("./settings/whitelist.json", JSON.stringify(whitelist), (err) => {
                if (err) console.log(err);
            });


        } else {

            whitelist.whitelist.push(`r${uye}`)

            fs.writeFile("./settings/whitelist.json", JSON.stringify(whitelist), (err) => {
                if (err) console.log(err);
            });

            await client.channels.cache.get(channel).send({ content: `<@${uye}> (\`\`${uye}\`\`) adlı üye güvenilir listeye eklendi.` })


        }
    }

}

module.exports = { Guard };