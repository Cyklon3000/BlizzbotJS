import { SlashCommandBuilder } from "@discordjs/builders";
import { DMChannel, User } from "discord.js";
import logger from "../../modules/logger.js";
import { permissions } from "../../modules/utils.js";
import ctx from "../../modules/ctx.js";
import config from "../../modules/config.js";

const perm = permissions.user;

/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").CommandInteraction<"cached">} interaction
 */
async function run(client, interaction) {
    let user = interaction.user;
    if (!(user instanceof User)) user = await client.users.fetch(user.id);
    const msg = await user.send("Bitte schreiben Sie mir Ihre Anfrage in einer Nachricht:").catch(async (reason) => {
        await interaction.reply(`Beim Senden der Nachricht ist ein Fehler aufgetreten: ${reason.toString()}`);

    });
    if (!msg) return;
    await interaction.reply({ content: "Sie haben eine neue Direktnachricht erhalten.", ephemeral: true });
    if (!msg) return;
    const messageChannel = msg.channel;
    if (!(messageChannel instanceof DMChannel)) return;
    const coll = messageChannel.createMessageCollector({ max: 1, filter: (m) => m.author.id === user.id });
    coll.on("collect", async (m) => {
        const channel = m.channel;
        if (!(channel instanceof DMChannel)) return;
        await channel.send("Vielen Dank für Ihre Anfrage!");
        if (!ctx.anfrageChannel) ctx.anfrageChannel = await client.channels.fetch(config.discord.channels.anfrage);
        if (!ctx.anfrageChannel || !ctx.anfrageChannel.isText()) {
            logger.info(`Anfrage: ${m.author.tag}: ${m.content}`);
            logger.error("Der Anfrage Kanal ist kein Textkanal.");
            return;
        }
        if (m.content) {
            await (await ctx.getAnfrageChannel()).send(`${m.author.tag}: ${m.content}`);
        } else if (m.attachments) {
            const attachments = [...m.attachments.values()];
            await (await ctx.getAnfrageChannel).send({ content: m.author.tag, files: attachments });
        }
    });
}

const setup = new SlashCommandBuilder()
    .setName("anfrage")
    .setDescription("Send a request to the mods")
    .setDescriptionLocalization("de", "Sende eine Anfrage an die Moderatoren").toJSON();

export { perm, run, setup };
