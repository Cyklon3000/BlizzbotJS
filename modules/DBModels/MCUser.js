import { DataTypes, Model } from "sequelize";
import { db } from "../db.js";

class MCUser extends Model {
}

MCUser.init({
    discordId: {
        primaryKey: true,
        type: DataTypes.BIGINT,
    },
    mcName: DataTypes.STRING,
    mcId: DataTypes.UUID,
    whitelistTwitch: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    whitelistYouTube: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize: db,
    tableName: "mcnames",
    paranoid: false,
    alter: true,
});

await MCUser.sync({ alter: true });
export default MCUser;