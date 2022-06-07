import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { MessageActionRow, MessageEmbed } from "discord.js";
import { permissions } from "../../modules/utils.js";
import XPUser from "../../modules/DBModels/XPUser.js";
import { LeftButton, RightButton } from "../../modules/utils/buttons.js";
import { Command } from "../../modules/command.js";

class Rank extends Command {
    perm = permissions.user;

    /**
     * @param  {import("discord.js").CommandInteraction<"cached">} interaction
     */
    async execute(interaction) {
        const user = interaction.options.getUser("user") || interaction.member.user;
        const xpUser = await XPUser.findOne({ where: { discordId: user.id, guildId: interaction.guildId } });
        if (!xpUser) return interaction.reply("Benutzer nicht in Datenbank vorhanden.");
        const postition = await xpUser.getPosition();
        const row = new MessageActionRow()
            .addComponents(
                new LeftButton(postition !== 0),
                new RightButton(true),
            );
        const embed = new MessageEmbed()
            .setTitle("Rangfunktion")
            .setColor(0xedbc5d)
            .setThumbnail(user.avatarURL({ dynamic: true }))
            .addField("Benutzer", user.username, false)
            .addField("Rang", `${postition}`, true)
            .addField("Exp", xpUser.get("experience").toString(), true);
        await interaction.reply({
            embeds: [embed],
            components: [row],
        });
    }

    register() {
        return new SlashCommandBuilder()
            .addUserOption(
                new SlashCommandUserOption()
                    .setName("user")
                    .setRequired(false)
                    .setDescriptionLocalization("de", "Der Nutzer, dessen Rang du wissen möchtest")
                    .setDescription("The user you want to get the rank for"),
            )
            .setName("rank")
            .setDescription("Check a user's rank")
            .setDescriptionLocalization("de", "Frage den Rang eines Nutzers ab");
    }
}

export default new Rank();
