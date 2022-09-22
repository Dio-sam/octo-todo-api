'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("todos","status",
        {
          type: Sequelize.STRING,
          defaultValue: "EN_COURS",
          allowNull: false
        })
    await queryInterface.sequelize.query(
        `UPDATE todos SET status= 'EN RETARD' WHERE date_echeance < now()`
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("todos", "statut")
  }
};
