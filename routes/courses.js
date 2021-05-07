const express = require('express');
const router = express.Router();
const { Course, User } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/authenticate');

// return all courses and filters out attributes that are not needed
router.get('/', asyncHandler(async(req,res,next) => {
  const courses = await Course.findAll({
    attributes: ["id", "title", "description", "estimatedTime", "materialsNeeded", "userId"],
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

// creates a new course if the required fields are valid
router.post('/', authenticateUser, asyncHandler(async(req,res,next) => {
  try {
    const course = await Course.create(req.body); 
    res.status(201).location(`/courses/${course.id}`).end();
  } catch (error) {
    if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
      const errors = error.errors.map(error => error.message);
      res.status(400).json(errors);
    } else {
      throw error;
    }
  }
}));

// returns a course with the :id value, return only needed values
router.get('/:id', asyncHandler(async(req,res,next) => {
  const id = req.params.id;
  const course = await Course.findOne({
    where: {
      id: id,
    },
    attributes: ["id", "title", "description", "estimatedTime", "materialsNeeded", "userId"],
    include: [
      {
        model: User,
        as: 'teacher',
        attributes: ["id","firstName", "lastName", "emailAddress"],
      }
    ]
  });
  res.status(200).json(course);
}));

// allows updating a specific course with the :id value if all required fields are valid and user is the course teacher
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
        res.status(403).json({message:"Only the course owner can update."});
      }
    } else {
      res.status(404).json({message:`The course with id ${id} was not found.`});
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

// allows deleting a specific course with the :id value if all required fields are valid and user is the course teacher
router.delete('/:id', authenticateUser, asyncHandler(async(req,res,next) => {
  const id = req.params.id;
  const course = await Course.findByPk(id);
  if (course) {
    if (req.currentUser.id === course.userId) {
      await Course.destroy({
        where: {
          id: id,
        }
      })
      res.status(204).end();
    } else {
      res.status(403).json({message:"Only the course owner can delete."});
    }
  } else {
    res.status(404).json({message:`The course with id ${id} was not found.`});
  }
}));

module.exports = router;