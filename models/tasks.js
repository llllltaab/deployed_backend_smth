const { DataTypes } = require("sequelize");
const db = require("../db");
const validateStrings = require("../validations");


const Task = db.define("task", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    
    title: {
        type: DataTypes.STRING(200),
        allowNull: false,

        validate: {
            validateStrings: validateStrings("title", 200)
        }
    },

    completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})


module.exports = Task;