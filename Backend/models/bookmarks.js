'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bookmarks extends Model {
    static associate(models) {
      // Define associations here
      Bookmarks.belongsTo(models.Users, {
        foreignKey: 'userId', // Foreign key for the Users model
        onDelete: 'CASCADE', // If a user is deleted, delete their bookmarks as well.
      });

      Bookmarks.belongsTo(models.Movies, {
        foreignKey: 'movieId', // Foreign key for the Movies model
        onDelete: 'CASCADE', // If a movie is deleted, delete its bookmarks as well.
      });
    }
  }
  Bookmarks.init({
    movieId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Bookmarks',
  });
  return Bookmarks;
};