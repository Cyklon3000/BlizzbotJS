import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, StageChannel } from "discord.js";
import { permissions } from "../../modules/utils.js";
import config from "../../modules/config.js";
import { Command } from "../../modules/command.js";

class Streamchannel extends Command {
    perm = permissions.user;

    /**
     * @param  {import("discord.js").CommandInteraction<"cached">} interaction
     */
    async execute(interaction) {
        if (!interaction.member.voice) {
            await interaction.reply({
                content: "Du musst dich in einem Sprachkanal befinden um diesen Befehl ausführen zu können.",
                ephemeral: true,
            });
            return;
        }
        const vc = interaction.member.voice.channel;
        if (!config.discord.channels.voiceCategory.includes(vc.parentId)) {
            await interaction.reply({
                content: "Um einen Streamchannel zu erzeugen musst du dich in einem Standard Voicechannel befinden.",
                ephemeral: true,
            });
            return;
        }
        if (vc instanceof StageChannel) {
            await interaction.reply({
                content: "Du musst dich für diesen Befehl in einem Sprachkanal, nicht in einem Stage Kanal befinden.",
                ephemeral: true,
            });
            return;
        }
        const streamchannel = await vc.clone();
        await streamchannel.setName("Stream-Channel");
        let { member } = interaction;
        if (!(member instanceof GuildMember)) member = await interaction.guild.members.fetch(member.user.id);
        await member.voice.setChannel(streamchannel);
        await interaction.reply({ content: "Ein Streamchannel wurde erzeugt.", ephemeral: true });
    }

    register() {
        return new SlashCommandBuilder()
            .setName("streamchannel")
            .setDescription("Create a Stream-Channel")
            .setDescriptionLocalization("de", "Erzeuge einen Stream-Channel");
    }
}
export default new Streamchannel();
