import { Message, MessageActionRow, MessageEmbed } from "discord.js";
import sequelize from "sequelize";
import { LeftButton, RightButton } from "../modules/utils/buttons.js";
import XPUser from "../modules/DBModels/XPUser.js";

/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").ButtonInteraction<"cached">} interaction
 */
export async function handle(client, interaction) {
    if (!interaction.isButton()) return;
    const message = interaction.message;
    if (!(message instanceof Message)) return;
    if (message.embeds) {
        const embed = message.embeds[0];
        if (!embed) return;
        switch (embed.title) {
            case "Rangfunktion": {
                let position = parseInt(
                    message.embeds[0].fields.find((f) => f.name === "Rang").value,
                );
                if (interaction.customId === "left") {
                    position = Math.max(1, position - 1);
                }
                if (interaction.customId === "right") position += 1;
                const next = await XPUser.findOne({
                    where: { guildId: message.guildId, available: true },
                    order: [["experience", "DESC"]],
                    offset: position - 1,
                    attributes: [
                        sequelize.literal("distinct on(experience) 1"),
                    ].concat(Object.keys([...XPUser.getAttributes()])),
                });
                const newEmbed = new MessageEmbed(embed);
                if (next !== null) {
                    newEmbed.setFields([
                        {
                            name: "Benutzer",
                            value: next.username ||
                                client.users.resolve(next.discordId)?.username ||
                                "Unbekannt",
                            inline: false,
                        },
                        { name: "Rang", value: `${position}`, inline: true },
                        { name: "Exp", value: `${next.experience}`, inline: true },
                    ]);
                    const user = client.users.resolve(next.discordId);
                    newEmbed.setThumbnail(user ?
                        (
                            user.partial ?
                                (await user.fetch()).avatarURL({ dynamic: true })
                                : user.avatarURL({ dynamic: true })
                        ) : client.user.avatarURL({ dynamic: true }),
                    );
                } else {
                    newEmbed.setFields([
                        { name: "Fehler", value: "Kein Benutzer gefunden" },
                        { name: "Rang", value: `${position || 0}` },
                    ]);
                    newEmbed.setThumbnail(client.user.avatarURL({ dynamic: true }));
                }
                const row = new MessageActionRow()
                    .addComponents(
                        new LeftButton(position !== 1),
                        new RightButton(next !== null),
                    );
                await interaction.update({ embeds: [newEmbed], components: [row] });
            }
                break;
            default:
                break;
        }
    }
}

export const disabled = false;
export const name = "interactionCreate";