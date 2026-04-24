const cron = require('node-cron');
const Task = require('../models/Task');
const Owner = require('../models/Owner');
const { sendDailyDigest } = require('./emailService');

const initScheduler = () => {
  // 1. Morning Digest - 6:00 AM
  cron.schedule('0 6 * * *', async () => {
    console.log('Running Morning Task Digest Job at 6:00 AM...');
    await processDigests('Morning');
  });

  // 2. Evening Digest - 10:10 PM
  cron.schedule('10 22 * * *', async () => {
    console.log('Running Evening Task Digest Job at 10:10 PM...');
    await processDigests('Evening');
  });

  console.log('Scheduler initialized (Morning 6 AM & Evening 10:10 PM)');
};

const processDigests = async (timeOfDay) => {
  try {
    const owners = await Owner.find();

    for (const owner of owners) {
      // Get only pending tasks for today
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

      const tasks = await Task.find({
        owner: owner.email,
        status: 'pending',
        dueDate: { $gte: startOfToday, $lte: endOfToday }
      }).sort('dueDate');

      if (tasks.length > 0) {
        await sendDailyDigest(owner.email, { today: tasks }, timeOfDay);
      }
    }
  } catch (error) {
    console.error(`Error in ${timeOfDay} scheduler job:`, error);
  }
};

module.exports = initScheduler;
