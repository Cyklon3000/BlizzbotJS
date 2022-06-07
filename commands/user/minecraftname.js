import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import logger from "../../modules/logger.js";
import { permissions } from "../../modules/utils.js";
import { inspect } from "node:util";
import MCUser from "../../modules/DBModels/MCUser.js";
import { Command } from "../../modules/command.js";

class Minecraftname extends Command {
    perm = permissions.user;

    /**
     * @param  {import("discord.js").CommandInteraction<"cached">} interaction
     */
    async execute(interaction) {
        const user = interaction.options.getUser("user") || interaction.user;
        logger.debug(`commands/slash/user/minecraftname: userId = ${user.id}`);
        const mcUser = await MCUser.findOne({ where: { discordId: user.id } });
        logger.debug(inspect(mcUser));
        if (!mcUser || !mcUser.get("mcId")) return interaction.reply({ content: "Dein Minecraft Name konnte nicht gefunden werden." });
        const embed = new MessageEmbed()
            .setTitle(user.username)
            .setColor(0xedbc5d)
            .setThumbnail(`https://crafatar.com/renders/body/${mcUser.get("mcId")}?overlay`)
            .addField("Minecraft-Name", mcUser.get("mcName").toString());
        await interaction.reply({ embeds: [embed] });
    }

    register() {
        return new SlashCommandBuilder()
            .addUserOption((option) => option
                .setName("user")
                .setDescription("The user you want the minecraft name from")
                .setDescriptionLocalization("de", "Der Nutzer, dessen Minecraft Namen du wissen möchtest")
                .setRequired(false),
            )
            .setName("minecraftname")
            .setDescription("Request the Minecraft name of a user")
            .setDescriptionLocalization("de", "Frage einen Minecraft Namen ab");
    }
}
export default new Minecraftname();
