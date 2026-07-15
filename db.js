require("dotenv").config();
const { Sequelize } = require("sequelize");

const dbConnection = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: process.env.DB_DIALECT || "postgres",
        dialectOptions: {
            ssl: process.env.DB_SSL === "true"
                ? { require: true, rejectUnauthorized: false }
                : false
        }
    })
    : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT || "postgres"
    });

module.exports = dbConnection;