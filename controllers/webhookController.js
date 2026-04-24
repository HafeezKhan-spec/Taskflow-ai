const Task = require('../models/Task');
const Owner = require('../models/Owner');
const aiService = require('../services/aiService');
const { sendDailyDigest } = require('../services/emailService');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const crypto = require('crypto');

/**
 * @desc    Verify HMAC Signature for security
 * @param   {Object} req - Express request
 * @param   {String} secret - Platform secret
 * @returns {Boolean}
 */
const verifySignature = (req, secret) => {
  const signature = req.headers['x-hub-signature'] || req.headers['x-monday-signature'];
  if (!signature) return false;

  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(JSON.stringify(req.body)).digest('hex');
  return signature === digest;
};

// @desc    Outlook Webhook Receiver
// @route   POST /api/webhooks/outlook
// @access  Public
exports.receiveOutlook = asyncHandler(async (req, res, next) => {
  // Acknowledge the webhook immediately (200 OK)
  res.status(200).json({ success: true });

  // 1. HMAC Security Check (Optional, depends on Outlook integration setup)
  // Logic to verify signature using process.env.OUTLOOK_WEBHOOK_SECRET

  // 2. Extract content from req.body
  // This depends on the specific Microsoft Graph payload
  const { subject, bodyPreview, from } = req.body;
  const rawContent = `From: ${from.emailAddress.address}, Subject: ${subject}, Content: ${bodyPreview}`;

  // 3. AI Processing (Asynchronous)
  processWebhookTask(rawContent, 'Outlook');
});

// @desc    Salesforce Webhook Receiver
// @route   POST /api/webhooks/salesforce
// @access  Public
exports.receiveSalesforce = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true });
  processWebhookTask(req.body.content, 'Salesforce');
});

// @desc    Monday.com Webhook Receiver
// @route   POST /api/webhooks/monday
// @access  Public
exports.receiveMonday = asyncHandler(async (req, res, next) => {
  // Monday requires a specific challenge response for setup
  if (req.body.challenge) {
    return res.status(200).json({ challenge: req.body.challenge });
  }

  res.status(200).json({ success: true });
  processWebhookTask(req.body.content, 'Monday');
});

/**
 * @desc    Common helper to process webhook content using AI and save tasks
 * @param   {String} content - Raw content
 * @param   {String} source - Source platform
 */
const processWebhookTask = async (content, source) => {
  try {
    const aiTasks = await aiService.processRawContent(content, source);

    for (const taskData of aiTasks) {
      // Find matching owner in DB
      const owner = await Owner.findOne({ email: taskData.owner_email });
      
      if (owner) {
        const newTask = await Task.create({
          title: taskData.title,
          description: taskData.description,
          owner: owner.email,
          dueDate: taskData.dueDate,
          priority: taskData.priority,
          source: source
        });

        console.log(`Auto-created task from ${source}: ${newTask._id}`);

        // Trigger instant notification
        sendDailyDigest(owner.email, { today: [newTask] }, `Auto-Generated: ${source}`).catch(err => 
          console.error(`Error sending ${source} notification:`, err)
        );
      }
    }
  } catch (error) {
    console.error(`Error processing ${source} webhook:`, error);
  }
};
