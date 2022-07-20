//require thought through models
const { Thought, User } = require('../models');


// will catch all thoughts
module.exports = {
  getThoughts(req, res) {
    Thought.find()
      .select('-__v')
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

// will only catch a single thought using findOne, select, populate or throw error if an ID is not found
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
    .select('-__v')
    .populate({
      path: 'reactions',
      select: '-__v'
    })
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: 'No thought with that ID' })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
},
  
  //to create a new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { _id: req.body.userID },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) =>
        !user
          ? res.status(404).json({
              message: 'Thought created, but found no user with that ID',
            })
          : res.json('Created the thought🎉')
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
    },
//update thoughts using findOneAndUpdate
updateThought(req, res) {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $set: req.body },
    { runValidators: true, new: true }
  )
  .then((thought) =>
    !thought
      ? res.status(404).json({ message: 'No thought with this id!' })
      : res.json(thought)
  )
  .catch((err) => res.status(500).json(err));
},
  
  // delete thought using findByIdAndRemove
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought found with this ID!' })
          : User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtID } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: 'Thought deleted but no user with this ID!',
            })
          : res.json({ message: 'Thought successfully deleted!' })
      )
      .catch((err) => res.status(500).json(err));
  },


//creates a reaction
addReaction(req, res) {
  Thought.findOneAndUpdate(
    {_id: req.params.thoughtId}, 
    {$set: {reactions: req.body}}, 
    {new: true, runValidators: true}
  )
  .select('-__v')
  .populate({path: 'reactions', select: '-__v'})
  .then((thought) =>
    !thought
      ? res.status(404).json({ message: 'No thought with this id!' })
      : res.json(thought)
  )
  .catch((err) => res.status(500).json(err));
},


// deletes a reaction using findOneAndDelete in conjunction with findOneAndUpdate
deleteReaction(req, res) {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: { reactionId: req.params.reactionID } } },
    { new: true }
  )
  .then((reaction) =>
    !reaction
      ? res.status(404).json({ message: 'No reaction with this id!' })
      : res.json(reaction)
  )
  .catch((err) => res.status(500).json(err));
},
};
