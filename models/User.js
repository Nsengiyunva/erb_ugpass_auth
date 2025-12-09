import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const User = sequelize.define("User", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM( "user", "admin" ),
        defaultValue: "user"
    }
});

export default User;