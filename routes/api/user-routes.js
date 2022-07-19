//require express
//do not forget router() as per last assignment *personal note
const router = require('express').Router();

//user & friend params through user-controller
const {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend,
    getFriend,
} = require('../../controllers/user-controller');

router.route('/').get(getUsers).post(createUser);

router
  .route('/:userId')
  .get(getSingleUser)
  .put(updateUser)
  .delete(deleteUser);

router
  .route('/:userId/friends/:friendId')
  .put(addFriend)
  .delete(deleteFriend);


  
// testing testing
router
.route('/:userId/friends/:friendId')
.get(getFriend);
  
module.exports = router;