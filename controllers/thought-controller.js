//require thought through models
const { thought } = require('../models');


// will catch all thoughts
module.exports = {
  getThoughts(req, res) {
    thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

// will only catch a single thought using findOne, select, populate or throw error if an ID is not found
  getSingleThought(req, res) {
    thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .populate('reactions')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  
  //to create a new thought
  createThought(req, res) {
    thought.create(req.body)
      .then((dbthoughtData) => res.json(dbthoughtData))
      .catch((err) => res.status(500).json(err));
  },

//update thoughts using findOneAndUpdate
 updateThought(req, res) {
    thought.findOneAndUpdate(
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
    thought.findByIdAndRemove({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
            )
      )
      .then(() => res.json({ message: 'thought deleted!' }))
      .catch((err) => res.status(500).json(err));
  },


//creates a reaction
addReaction(req, res) {
  thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $push: { reactions: req.params.reactionId } },
    { runValidators: true, new: true },
  )
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: 'No thought with this id!' })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
},


// deletes a reaction using findOneAndDelete in conjunction with findOneAndUpdate
deleteReaction(req, res) {
  thought.findOneAndDelete({ _id: req.params.reactionId })
  .then((reaction) =>
    !reaction
      ? res.status(404).json({ message: 'No reaction with that ID' })
      : thought.findOneAndUpdate(
        { reactions: req.params.reactionId },
        { $pull: { reaction: req.params.reactionId } },
        { new: true }
        )
  )
  .then(() => res.json({ message: 'Reaction deleted!' }))
  .catch((err) => res.status(500).json(err));
},
};