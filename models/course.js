'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {};

  Course.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "title is a required field",
        },
        notNull: {
          msg: "title is a required field",
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "description is a required field",
        },
        notNull: {
          msg: "description is a required field",
        }
      }
    },
    estimatedTime: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    materialsNeeded: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  }, {
    sequelize,
    modelName: 'Course',
  });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {  
      as: 'teacher',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false
      }
    })
  }
  return Course;
};