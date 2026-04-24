const express = require('express');
const {
  getOwners,
  createOwner,
  deleteOwner,
} = require('../controllers/ownerController');

const router = express.Router();

router.route('/').get(getOwners).post(createOwner);
router.route('/:id').delete(deleteOwner);

module.exports = router;
