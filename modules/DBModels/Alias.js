import { DataTypes, Model } from "sequelize";
import { db } from "../db.js";

class Alias extends Model {
}

Alias.init({
    command: DataTypes.TEXT,
    name: DataTypes.TEXT,
    type: DataTypes.TEXT,
}, {
    sequelize: db,
    paranoid: false,
    alter: true,
});

await Alias.sync({ alter: true });

export default Alias;