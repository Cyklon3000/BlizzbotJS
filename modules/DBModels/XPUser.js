import { DataTypes, Model, Op } from "sequelize";
import { db } from "../db.js";

class XPUser extends Model {
    /**
     *
     * @returns {number}
     */
    get level() {
        return Math.floor(Math.sqrt(this.experience / 10));
    }

    /**
     *
     * @returns {Promise<number>}
     */
    async getPosition() {
        return await XPUser.count({
            distinct: "experience",
            where: {
                experience: {
                    [Op.gte]: this.experience,
                },
            },
        });
    }
}

XPUser.init({
    discordId: DataTypes.BIGINT,
    guildId: DataTypes.BIGINT,
    experience: DataTypes.INTEGER,
    available: DataTypes.BOOLEAN,
    username: DataTypes.STRING,
}, {
    sequelize: db,
    tableName: "ranking",
    paranoid: false,
    alter: true,
});

await XPUser.sync({ alter: true });
export default XPUser;