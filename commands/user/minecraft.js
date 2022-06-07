import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import fetch from "node-fetch";
import { permissions } from "../../modules/utils.js";
import MCUser from "../../modules/DBModels/MCUser.js";
import ctx from "../../modules/ctx.js";
import config from "../../modules/config.js";
import { Command } from "../../modules/command.js";

class Minecraft extends Command {
    perm = permissions.user;

    /**
     * @param  {import("discord.js").CommandInteraction<"cached">} interaction
     */
    async execute(interaction) {
        const name = interaction.options.getString("name");
        const siteData = await fetch(`https://api.mojang.com/users/profiles/minecraft/${name}`);
        if (siteData.status === 200) {
            let previous = true;
            let initialName;
            const jsonData = await siteData.json() || JSON.parse(await siteData.text());
            const [mcuser] = await MCUser.findOrCreate({ where: { discordId: interaction.member.id } });
            if (mcuser.get("mcName") == null) {
                previous = false;
            } else {
                initialName = mcuser.get("mcName");
            }
            mcuser.set({ mcId: jsonData.id });
            mcuser.set({ mcName: jsonData.name });
            mcuser.set({ whitelistTwitch: config.discord.roles.whitelist.twitch.some((r) => interaction.member.roles.cache.has(r)) });
            mcuser.set({ whitelistYouTube: config.discord.roles.whitelist.youtube.some((r) => interaction.member.roles.cache.has(r)) });
            await mcuser.save();
            await interaction.reply(!previous ? `Dein Minecraftname **${jsonData.name}** wurde erfolgreich hinzugefügt.` : `Du hast deinen Minecraftnamen von **${initialName}** auf **${jsonData.name}** aktualisiert.`);
            await ctx.syncWhitelist();
        } else {
            await interaction.reply("Dieser Name wurde nicht gefunden.");
        }
    }

    register() {
        return new SlashCommandBuilder()
            .addStringOption(
                new SlashCommandStringOption()
                    .setName("name")
                    .setDescription("Den Namen, den du angeben möchtest")
                    .setRequired(true),
            )
            .setName("minecraft")
            .setDescription("Tell the bot your minecraft name to get whitelisted on subservers")
            .setDescriptionLocalization("de", "Teile dem Bot deinen Minecraft Namen für die Subserver mit");
    }
}
export default new Minecraft();
