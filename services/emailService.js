const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');

const sendDailyDigest = async (ownerEmail, tasks, timeOfDay = 'Daily') => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { today } = tasks;
  const now = new Date();
  const month = now.toLocaleString('default', { month: 'short' });
  const day = now.getDate();

  const renderTaskList = (list, color) => {
    if (list.length === 0) return '<p>No pending tasks for today!</p>';
    return `
      <ul style="list-style: none; padding: 0;">
        ${list
          .map(
            (task) => `
          <li style="border-left: 5px solid ${color}; padding: 10px; margin-bottom: 10px; background: #f9f9f9;">
            <strong style="font-size: 1.1em;">${task.title}</strong><br/>
            <small>Priority: ${task.priority}</small><br/>
            <p style="margin: 5px 0 0 0;">${task.description || 'No description'}</p>
          </li>
        `
          )
          .join('')}
      </ul>
    `;
  };

  const dynamicCalendarIcon = `
    <div style="display: inline-block; width: 32px; height: 34px; border: 1px solid #d9534f; border-radius: 6px; overflow: hidden; font-family: 'Inter', Arial, sans-serif; text-align: center; vertical-align: middle; margin-right: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="background-color: #d9534f; color: white; font-size: 8px; font-weight: bold; line-height: 12px; text-transform: uppercase; padding: 1px 0;">${month}</div>
      <div style="background-color: white; color: #333; font-size: 16px; font-weight: 800; line-height: 20px;">${day}</div>
    </div>
  `;

  let titleText = `${timeOfDay} Task Digest`;
  let subtitleText = "Here are your pending tasks for today.";

  if (timeOfDay === 'Task Completed') {
    titleText = "Task Completed! 🎉";
    subtitleText = "Great job! Here are your remaining tasks for today.";
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #ffffff;">
      <h2 style="text-align: center; color: #333;">${titleText}</h2>
      <p style="text-align: center; color: #666;">${subtitleText}</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
      
      <h3 style="color: #f0ad4e; display: flex; align-items: center;">
        ${dynamicCalendarIcon}
        Today's Pending Tasks
      </h3>
      ${renderTaskList(today, '#f0ad4e')}
      
      <p style="text-align: center; color: #777; font-size: 0.8em; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
        Sent by To-Do Tracker App
      </p>
    </div>
  `;

  const mailOptions = {
    from: `"To-Do Tracker" <${process.env.EMAIL_USER}>`,
    to: ownerEmail,
    subject: `${timeOfDay} - ${new Date().toLocaleDateString()}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`${timeOfDay} Email sent successfully to ${ownerEmail}`);

    // Log notification in DB
    await Notification.create({
      owner: ownerEmail,
      subject: mailOptions.subject,
      type: timeOfDay === 'Daily' ? 'Morning' : (timeOfDay === 'Task Completed' ? 'Task Completed' : timeOfDay),
    });
  } catch (error) {
    console.error(`Error sending ${timeOfDay} email to ${ownerEmail}:`, error);
  }
};

module.exports = { sendDailyDigest };
