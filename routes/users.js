// const {sequelize} = require('../models');
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/authenticate');

// returns all users and filters out not needed attributes
router.get('/', authenticateUser, asyncHandler(async(req,res,next) => {
  let user = await User.findOne({
    where: {
      emailAddress: req.currentUser.emailAddress,
    },  
    attributes: ["id", "firstName", "lastName", "emailAddress"],
  });
  res.status(200).json(user);
}));

// create a new user if the required fields are valid
router.post('/', asyncHandler(async(req,res,next) => {
  try {
    await User.create(req.body);
    res.location("/").status(201).end();
  } catch (error) {
    if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
      const errors = error.errors.map(error => error.message);
      res.status(400).json(errors);
    } else {
      throw error;
    }
  }
}));

module.exports = router;