//require user through models
const { user } = require('../models');


//will get all users
module.exports = {
  getUsers(req, res) {
    user.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  
  //will find a single user by using findOne
  getSingleUser(req, res) {
    user.findOne({ _id: req.params.userId })
    .select('-__v')
    .populate('friends')
    .populate('thoughts')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  //will create a user using create
  createUser(req, res) {
    user.create(req.body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(500).json(err));
  },

 // to update user using findOneAndUpdate
 updateUser(req, res) {
    user.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // will delete the user
  deleteUser(req, res) {
    user.findByIdAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user))
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


// used this for testing in order to find friend and msg confirming if found
getFriend(req, res) {
  return res.json({ message: 'Friend got!'})
},
};