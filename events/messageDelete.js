import { MessageEmbed } from "discord.js";
import logger from "../modules/logger.js";
import ctx from "../modules/ctx.js";

const disabled = false;
const name = "messageDelete";

/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").Message<true>} message
 */
async function handle(client, message) {
    if (!message.guild) return;
    const embed = new MessageEmbed()
        .setTitle("Gelöschte Nachricht")
        .setColor(0xedbc5d)
        .addField("Name", message.author?.username || "Name unbekannt", true)
        .addField("Channel", message.channel.name || "Channel unbekannt???", true);
    if (message.author?.avatar) embed.setThumbnail(message.author.avatarURL({ dynamic: true }));
    embed.addField("Inhalt", message.content?.slice(0, 1000) || "Inhalt nicht auslesbar", false);
    const logChannel = await ctx.getLogChannel();
    if (logChannel) {
        logChannel.send({ embeds: [embed] }).catch((e) => {
            logger.error(`Could not send deleted message to the log channel: ${e.message}
                ${e.stack}
                
                The message was \`${message.content || "Inhalt nicht auslesbar"}\`
                by ${message.author.tag} in ${message.channel.name} (${message.guild.name})`);
        });
    }
}

export {
    handle,
    name,
    disabled,
};