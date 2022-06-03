import { DataTypes, Model } from "sequelize";
import { db } from "../db.js";

class CustomCommand extends Model {
}

CustomCommand.init({
    commandName: DataTypes.TEXT,
    response: DataTypes.TEXT,
    lastEditedBy: DataTypes.BIGINT,
}, {
    sequelize: db,
    paranoid: false,
    alter: true,
});

await CustomCommand.sync({ alter: true });

export default CustomCommand;