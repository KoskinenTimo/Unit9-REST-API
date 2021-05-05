'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {};
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "firstName is a required field.",
        },
        notNull: {
          msg: "firstName is a required field.",
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "lastName is a required field",
        },
        notNull: {
          msg: "lastName is a required field",
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "emailAddress already exists",
      },      
      validate: {
        notEmpty: {
          msg: "emailAddress is a required field",
        },
        notNull: {
          msg: "emailAddress is a required field",
        },
        isEmail: {
          msg: "Not a valid email"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "password is a required field",
        },
        notNull: {
          msg: "password is a required field",
        }
      },
      set(value) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(value, salt);
        this.setDataValue("password", hash);
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  User.associate = (models) => {
    User.hasMany(models.Course, {
      as: 'teacher',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      }
    });
  };

  return User;
};