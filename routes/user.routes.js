const router = require("express").Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const {isAdmin} = require('../middleware/guard.middleware');

// Get route to display the profile page

router.get('/users/:userId', async(req, res) => {
  
  const { userId } = req.params;
  // if(userId === 'current'){
  //   userId = req.paload.userId;
  // }
  
  if(userId !== req.payload.userId  &&  req.payload.role !== 'admin') {
    res.status(401).json({message: 'Unauthorized access'});
    return;
  }
  
  try {
      const user = await User.findById(userId).select('-password');
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// Patch route to update the users profile details

router.patch('/users/:userId', async (req, res) => {

  const { userId } = req.params;

  if(userId !== req.payload.userId  &&  req.payload.role !== 'admin') {
    res.status(401).json({message: 'Unauthorized access'});
    return;
  }

    try {
      const user = await User.findByIdAndUpdate(req.payload.userId, req.body, { new: true }).select('-password');
      return res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

// PUT route to modify a specific user

router.put('/users/:userId', async(req, res, next) => {

  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "user id is not valid" });
      return;
  }

  try {
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, {new:true});
      res.status(200).json(updatedUser);
  } catch (error){
      console.log(error);
      res.status(500).json({ message: `Failed to update the user with userId: ${userId}`});
  }
})

// route to delete user, only Admin can access it

router.delete('/users/:userId', isAdmin, async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  User.findByIdAndDelete(userId)
    .then(() =>
      res.json({
        message: `User with ${userId} has been removed successfully.`,
      })
    )
    .catch((err) => {
      res.status(500).json({ message: "Error deleting the user" });
    }); 
});

// Get all the users data

router.get('/users', isAdmin, async (req, res) => {

  const { userId } = req.params;

  if(userId !== req.payload.userId  &&  req.payload.role !== 'admin') {
    res.status(401).json({message: 'Unauthorized access'});
    return;
  
  }

    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

module.exports = router;