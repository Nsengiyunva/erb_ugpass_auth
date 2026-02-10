import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ERBEngineer = sequelize.define(
  "ERBEngineer",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    reg_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    organisation: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    reg_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    field: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    phones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    emails: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    primary_email: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    secondary_email: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    primary_contact: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    secondary_contact: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    uipe_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    qualification: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "erb_engineer",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["reg_no"] },
    ],
  }
);

export default ERBEngineer;