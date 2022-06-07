import { SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption } from "@discordjs/builders";
import { GuildMember } from "discord.js";
import { permissions } from "../../modules/utils.js";
import { Command } from "../../modules/command.js";

class Timeout extends Command {
    perm = permissions.mod;

    /**
     * @param  {import("discord.js").CommandInteraction<"cached">} interaction
     */
    async execute(interaction) {
        let member = interaction.options.getMember("user", true);
        if (!(member instanceof GuildMember)) member = await member.fetch();
        const time = interaction.options.getString("time", true).split(":");
        const reason = interaction.options.getString("reason", false);
        const seconds = parseInt(time.pop());
        const minutes = parseInt(time.pop());
        const hours = parseInt(time.pop());
        const days = parseInt(time.pop());
        let timeout = 0;
        if (!isNaN(days)) timeout += days;
        timeout *= 24;
        if (!isNaN(hours)) timeout += hours;
        timeout *= 60;
        if (!isNaN(minutes)) timeout += minutes;
        timeout *= 60;
        if (!isNaN(seconds)) timeout += seconds;
        timeout *= 1000;
        await member.timeout(timeout, reason);
        await interaction.reply({ content: `Der Nutzer ${member.user.tag} wurde getimeoutet.`, ephemeral: true });
    }

    register() {
        return new SlashCommandBuilder()
            .setDMPermission(false)
            .setDefaultMemberPermissions(false)
            .setName("timeout")
            .setDescription("Timeout a user")
            .setDescriptionLocalization("de", "Timeoute einen Nutzer")
            .addUserOption(
                new SlashCommandUserOption()
                    .setDescriptionLocalization("de", "Der Nutzer, den du timeouten möchtest")
                    .setDescription("The user you want to timeout")
                    .setName("user")
                    .setRequired(true),
            )
            .addStringOption(
                new SlashCommandStringOption()
                    .setName("time")
                    .setDescription("how long the user shall be timeouted (format dd:hh:mm:ss)")
                    .setDescriptionLocalization("de", "Wie lange der Nutzer getimeoutet werden soll (Format dd:hh:mm:ss)")
                    .setRequired(true),
            )
            .addStringOption(
                new SlashCommandStringOption()
                    .setName("reason")
                    .setDescription("Reason for the timeout")
                    .setDescriptionLocalization("de", "Grund für den Timeout")
                    .setRequired(false),
            );
    }
}

export default new Timeout();
