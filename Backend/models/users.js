'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/password');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasMany(models.Bookmarks, {
        foreignKey: 'userId', // Foreign key for the Bookmark model
        onDelete: 'CASCADE', // If a user is deleted, delete their bookmarks as well.
      })
    }
  }
  Users.init({
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    address: DataTypes.STRING,
    phonenumber: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
    hooks: {
      beforeCreate: (newUser)=>{
        const hashedPassword =hashPassword(newUser.password)
        newUser.password = hashedPassword
      }
    }
  });

  return Users;
};