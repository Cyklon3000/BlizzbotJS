import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { permissions } from "../../modules/utils.js";
import CustomCommand from "../../modules/DBModels/CustomCommand.js";
import { Command } from "../../modules/command.js";
import { client } from "../../blizzbot.js";

class Help extends Command {
    perm = permissions.user;

    /**
     * @param  {import("discord.js").CommandInteraction<"cached">} interaction
     */
    async execute(interaction) {
        const embed = new MessageEmbed()
            .setThumbnail(client.user.avatarURL({ format: "png" }))
            .setTitle("**__Der Bot kann folgende Befehle:__**")
            .setColor(0xedbc5d)
            .addField("/minecraft [Name]", "Registriere deinen Minecraft-Account")
            .addField("/minecraftname [Name]", "Gibt deinen aktuellen Minecraft-Account wieder")
            .addField("/rank [Name]", "Gibt Erfahrung wieder")
            .addField("/ranking [Name]", "Zeigt die Aktuelle Rangliste an")
            .addField("/anfrage", "Schreibe dem Bot eine Anfrage, die direkt an die Moderatoren privat weitergeleitet werden");

        const ccmds = (await CustomCommand.findAll()).map((c) => `!${c.commandName}`);
        if (ccmds.length > 0) embed.addField("**__Temporäre Befehle:__**", ccmds.join(", "));
        await interaction.reply({ embeds: [embed] });
    }

    register() {
        return new SlashCommandBuilder()
            .setName("help")
            .setDescription("Shows the currently existing commands")
            .setDescriptionLocalization("de", "Zeigt die Hilfe an welche Befehle derzeit exestieren");
    }
}

export default new Help();