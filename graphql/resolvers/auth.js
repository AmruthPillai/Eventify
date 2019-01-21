const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

  login: async ({
    email,
    password
  }) => {
    const user = await User.findOne({
      email: email
    });
    if (!user) {
      throw new Error('User does not exist.');
    }

    const authorized = await bcrypt.compare(password, user.password);
    if (!authorized) {
      throw new Error('Username/Password is incorrect.');
    }

    const token = jwt.sign({
      userId: user.id,
      email: user.email
    }, 'some-super-secret-key', {
      expiresIn: '1h'
    });

    return {
      userId: user.id,
      token: token,
      tokenExpiration: 1
    };
  }
}