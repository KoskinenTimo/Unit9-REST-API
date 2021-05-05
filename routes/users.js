// const {sequelize} = require('../models');
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/authenticate');


router.get('/', authenticateUser, asyncHandler(async(req,res,next) => {
  let users = await User.findAll({
    attributes: ["id", "firstName", "lastName", "emailAddress"],
  });
  res.status(200).json(users);
}));

router.post('/', asyncHandler(async(req,res,next) => {
  try {
    await User.create(req.body);
    res.status(201).json({message:"Account created!"});
  } catch (error) {
    if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraint") {
      const errors = error.errors.map(error => error.message);
      res.status(400).json({errors});
    } else {
      throw error;
    }
  }
}));

module.exports = router;