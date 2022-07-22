const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');
const thoughtController = require('./thought-controller');

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
      .then((user) => res.json(user))
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
    User.findOneAndRemove({ _id: req.params.userId })
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
  User.findOneAndUpdate(
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
  User.findOneAndUpdate(
    { _id: req.params.userId}, 
    { $pull: { friends: req.params.friendId} },
    { runValidators: true, new: true}
  )
  .then((user) => {
    if (!user) {
        return res.status(404).json({ message: 'User with this ID does not exist.' });
    }
    res.json(user);
})
.catch((err) => res.status(500).json(err));
}
};