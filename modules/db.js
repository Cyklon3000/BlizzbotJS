import sequelize from "sequelize";
import logger from "./logger.js";
import config from "./config.js";

const { Sequelize } = sequelize;

const db = new Sequelize({
    dialect: "postgres",
    logging: (sql) => logger.debug(sql),
    username: config.database.user,
    ...config.database,
});


await db.authenticate().catch((e) => {
    logger.error(e);
});

logger.info("Database connection successful.");

export { db };
