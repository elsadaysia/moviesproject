'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Movies.hasMany(models.Bookmarks, {
        foreignKey: 'movieId', // Foreign key for the Bookmark model
        onDelete: 'CASCADE', // If a movie is deleted, delete its bookmarks as well.
      })
    }
  }
  Movies.init({
    title: DataTypes.STRING,
    synopsis: DataTypes.STRING,
    trailerurl: DataTypes.STRING,
    imgurl: DataTypes.STRING,
    rating: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Movies',
  });
  
  return Movies;
};