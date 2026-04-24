const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/async');

// @desc    Get all notifications for an owner
// @route   GET /api/notifications
// @access  Public
exports.getNotifications = asyncHandler(async (req, res, next) => {
  let query = {};
  
  if (req.query.owner) {
    query.owner = req.query.owner;
  }

  const notifications = await Notification.find(query).sort('-sentAt').limit(20);

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications,
  });
});
