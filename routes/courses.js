const express = require('express');
const router = express.Router();
const { Course, User } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/authenticate');

router.get('/', asyncHandler(async(req,res,next) => {
  const courses = await Course.findAll({
    attributes: ["id", "title", "description", "estimatedTime", "materialsNeeded"],
    include: [
      {
        model: User,
        as: 'teacher',
        attributes: ["id","firstName", "lastName", "emailAddress"],
      },
    ],
  });
  res.status(200).json(courses);
}));

router.post('/', authenticateUser, asyncHandler(async(req,res,next) => {
  try {
    await Course.create(req.body);
    res.status(201).end();
  } catch (error) {
    if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraint") {
      const errors = error.errors.map(error => error.message);
      res.status(400).json({errors});
    } else {
      throw error;
    }
  }
}));

router.get('/:id', asyncHandler(async(req,res,next) => {
  const id = req.params.id;
  const course = await Course.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: User,
        as: 'teacher',
      }
    ]
  });
  res.status(200).json(course);
}));

router.put('/:id', authenticateUser, asyncHandler(async(req,res,next) => {
  try {
    const id = req.params.id;
    const course = await Course.findByPk(id);
    if (course) {
      if (req.currentUser.id === course.userId) {
        await Course.update(req.body,{
          where: {
            id: id,
          }
        })
        res.status(204).end();
      } else {
        res.status(403).json({message:"Only the course owner can update."})
      }
    } else {
      res.status(404).json({message:`The course with id ${id} was not found.`})
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraint") {
      const errors = error.errors.map(error => error.message);
      res.status(400).json({errors});
    } else {
      throw error;
    }
  }
}));

router.delete('/:id', authenticateUser, asyncHandler(async(req,res,next) => {
  const id = req = req.params.id;
  await Course.destroy({
    where: {
      id: id,
    }
  })
  res.status(204).end();
}));

module.exports = router;