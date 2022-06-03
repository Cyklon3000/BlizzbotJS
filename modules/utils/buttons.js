import { MessageButton } from "discord.js";
import config from "../config.js";

class LeftButton extends MessageButton {
    /**
     *
     * @param {boolean} enabled
     */
    constructor(enabled) {
        super();
        this.setEmoji(config.discord.emojis.left);
        this.setCustomId("left");
        this.setDisabled(!enabled);
        this.setLabel("Links");
        this.setStyle("PRIMARY");
    }
}

class RightButton extends MessageButton {
    /**
     *
     * @param {boolean} enabled
     */
    constructor(enabled) {
        super();
        this.setEmoji(config.discord.emojis.right);
        this.setCustomId("right");
        this.setDisabled(!enabled);
        this.setLabel("Rechts");
        this.setStyle("PRIMARY");
    }
}
export {
    LeftButton,
    RightButton,
};