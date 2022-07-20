const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');
const thoughtController = require('./thoughtController');

//will get all users
module.exports = {
  getUsers(req, res) {
    User.find()
      .select('-__v')
      .populate({ path: 'thoughts', select: '-__v' })
      .populate({ path: 'friends', select: '-__v' })
      .then(users => res.json(users))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  },
  
  //will find a single user by using findOne
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate({ path: 'thoughts', select: '-__v' })
      .populate({ path: 'friends', select: '-__v' })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  //will create a user using create
  createUser(req, res) {
    User.create(req.body)
      .then((userData) => res.json(userData))
      .catch((err) => res.status(500).json(err));
  },

 // to update user using findOneAndUpdate
 updateUser(req, res) {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $set: req.body },
    { runValidators: true, new: true }
  )
  .then((user) =>
    !user
      ? res.status(404).json({ message: 'No user with this ID!' })
      : res.json(user)
  )
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
  },

  // will delete the user
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and associated thoughts deleted!' }))
      .catch((err) => res.status(500).json(err));
  },

// can add a friend 
addFriend(req, res) {
  user.findOneAndUpdate(
    { _id: req.params.userId },
    { $push: { friends: req.params.friendId } },
    { runValidators: true, new: true },
  )
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with this id!' })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
},


// delete a friend using findOneAndDelete
deleteFriend(req, res) {
  user.findOneAndDelete({ _id: req.params.friendId })
  .then((friend) =>
    !friend
      ? res.status(404).json({ message: 'No friend with that ID' })
      : user.findOneAndUpdate(
        { friends: req.params.friendId },
        { $pull: { friend: req.params.friendId } },
        { new: true }
        )
  )
  .then(() => res.json({ message: 'Friend deleted!' }))
  .catch((err) => res.status(500).json(err));
},
};