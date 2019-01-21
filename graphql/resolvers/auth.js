const bcrypt = require('bcryptjs');

const User = require('../../models/user');

const {
  transformUser
} = require('./merge');

module.exports = {
  createUser: async (args) => {
    try {
      const user = await User
        .findOne({
          email: args.userInput.email
        });

      if (user) {
        throw new Error('User exists already.');
      }

      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const newUser = new User({
        email: args.userInput.email,
        password: hashedPassword
      });

      const result = await newUser.save();
      return transformUser(result);
    } catch (err) {
      throw err;
    }
  },
}