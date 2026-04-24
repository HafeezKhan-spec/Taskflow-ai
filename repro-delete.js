const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/tasks';

async function reproduceDeleteIssue() {
  try {
    console.log('--- 1. Creating a task ---');
    const createRes = await axios.post(BASE_URL, {
      title: 'Reproduction Task',
      owner: 'test@example.com',
      dueDate: new Date(),
      priority: 'Low',
    });
    const taskId = createRes.data.data._id;
    console.log('Created ID:', taskId);

    console.log('\n--- 2. Deleting the task ---');
    await axios.delete(`${BASE_URL}/${taskId}`);
    console.log('Delete request sent.');

    console.log('\n--- 3. Verifying deletion (immediate fetch) ---');
    try {
      const fetchRes = await axios.get(`${BASE_URL}/${taskId}`);
      console.log('Task STILL EXISTS:', fetchRes.data.data.title);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.log('Task correctly returned 404 (Not Found).');
      } else {
        console.error('Unexpected error on fetch:', err.message);
      }
    }

    console.log('\n--- 4. Listing all tasks to check for persistence ---');
    const listRes = await axios.get(BASE_URL);
    const found = listRes.data.data.some(t => t._id === taskId);
    if (found) {
      console.log('FAILURE: Task still appears in the list!');
    } else {
      console.log('SUCCESS: Task is NOT in the list.');
    }

  } catch (error) {
    console.error('Test failed:', error.response ? error.response.data : error.message);
  }
}

reproduceDeleteIssue();
