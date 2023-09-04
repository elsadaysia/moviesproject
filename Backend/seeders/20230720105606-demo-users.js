'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      name: 'Eren',
      username: 'Yeager',
      email: 'eren@gmail.com',
      password:'yeager1234',
      role:'admin',
      address:'paradise',
      phonenumber:'0928312732',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
