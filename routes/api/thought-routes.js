//require express
const router = require('express').Router();

//thoughts and reactions params, through thought-controller
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
} = require('../../controllers/thought-controller.js');

router.route('/').get(getThoughts).post(createThought);

router.route('/:thoughtId').get(getSingleThought).put(updateThought).delete(deleteThought);

router.route('/thoughts/:thoughtId/reactions').post(addReaction);
  
router.route('/thoughts/:thoughtId/reactions/:reactionId').delete(deleteReaction);

module.exports = router;