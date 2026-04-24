const Owner = require('../models/Owner');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all owners
// @route   GET /api/owners
// @access  Public
exports.getOwners = asyncHandler(async (req, res, next) => {
  const owners = await Owner.find();

  res.status(200).json({
    success: true,
    count: owners.length,
    data: owners,
  });
});

// @desc    Create new owner
// @route   POST /api/owners
// @access  Public
exports.createOwner = asyncHandler(async (req, res, next) => {
  const owner = await Owner.create(req.body);

  res.status(201).json({
    success: true,
    data: owner,
  });
});

// @desc    Delete owner
// @route   DELETE /api/owners/:id
// @access  Public
exports.deleteOwner = asyncHandler(async (req, res, next) => {
  const owner = await Owner.findByIdAndDelete(req.params.id);

  if (!owner) {
    return next(new ErrorResponse(`Owner not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});
