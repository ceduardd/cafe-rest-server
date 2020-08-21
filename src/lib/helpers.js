const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    console.error(err);
  }
};

helpers.matchPassword = async (password, encryptPassword) => {
  try {
    return await bcrypt.compare(password, encryptPassword);
  } catch (err) {
    console.error(err);
  }
};

module.exports = helpers;
