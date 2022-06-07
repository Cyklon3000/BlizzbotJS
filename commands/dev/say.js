import { SlashCommandBuilder } from "@discordjs/builders";
import { permissions } from "../../modules/utils.js";
import ctx from "../../modules/ctx.js";
import { Command } from "../../modules/command.js";
import { TextChannel } from "discord.js";

class Say extends Command {
    perm = permissions.dev;

    /**
     * @param  {import("discord.js").CommandInteraction<"cached">} interaction
     */
    async execute(interaction) {
        const text = interaction.options.getString("message", true);
        let channel = interaction.options.getChannel("channel", false);
        if (!channel) channel = await ctx.getStandardChannel();
        if (channel && channel instanceof TextChannel && "send" in channel) {
            await channel.send(text);
            await interaction.deferReply();
        } else {
            await interaction.reply("Der in der Config angegebene Kanal ist kein Textkanal.");

        }
    }

    register() {
        return new SlashCommandBuilder()
            .setDMPermission(false)
            .setDefaultMemberPermissions(false)
            .setName("say")
            .setDescription("Send a message using the bot")
            .setDescriptionLocalization("de", "Gibt eine Nachricht über den Bot aus")
            .addStringOption((option) => option
                .setName("message")
                .setNameLocalization("de", "nachricht")
                .setDescription("The message to be sent")
                .setDescriptionLocalization("de", "Die Nachricht, die gesendet werden soll")
                .setRequired(true),
            )
            .addChannelOption((option) => option
                .setName("channel")
                .setNameLocalization("de", "kanal")
                .setDescription("The channel the message is sent to, defaults to the general channel")
                .setDescriptionLocalization("de", "Der Kanal in den die Nachricht geschickt wird")
                .setRequired(false),
            );
    }
}

export default new Say();