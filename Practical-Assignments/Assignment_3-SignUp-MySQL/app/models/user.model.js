module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    mobile: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    }
  });

  return User;
};
