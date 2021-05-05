const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

// Authenticates user
exports.authenticateUser = async (req,res,next) => {
  let message;
  const credentials = auth(req);
  if (credentials) {
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name,
      },
    });
    if (user) {
      const authenticated = bcrypt.compareSync(credentials.pass,user.password);
      if (authenticated) {
        req.currentUser = user;
      } else {
        message = "Could not authenticate.";
      }
    } else {
      message = "User not found.";
    }
  } else {
    message = "Auth header not found.";
  }

  if (message) {
    console.error(message);
    res.status(401).json({message: "Access Denied"});
  } else {
    next();
  }
}