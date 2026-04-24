const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/tasks';

async function testAPI() {
  try {
    console.log('--- Testing Create Task ---');
    const createTaskRes = await axios.post(BASE_URL, {
      title: 'Test Task',
      description: 'This is a test task description',
      owner: 'test@example.com',
      dueDate: new Date(Date.now() + 86400000), // Tomorrow
      priority: 'High',
    });
    const taskId = createTaskRes.data.data._id;
    console.log('Created Task ID:', taskId);

    console.log('\n--- Testing Get All Tasks ---');
    const getTasksRes = await axios.get(BASE_URL);
    console.log('Total Tasks:', getTasksRes.data.count);

    console.log('\n--- Testing Get Single Task ---');
    const getTaskRes = await axios.get(`${BASE_URL}/${taskId}`);
    console.log('Task Title:', getTaskRes.data.data.title);

    console.log('\n--- Testing Update Task ---');
    const updateTaskRes = await axios.put(`${BASE_URL}/${taskId}`, {
      priority: 'Medium',
    });
    console.log('Updated Priority:', updateTaskRes.data.data.priority);

    console.log('\n--- Testing Complete Task ---');
    const completeTaskRes = await axios.patch(`${BASE_URL}/${taskId}/complete`);
    console.log('Task Status:', completeTaskRes.data.data.status);

    console.log('\n--- Testing Delete Task ---');
    await axios.delete(`${BASE_URL}/${taskId}`);
    console.log('Task deleted successfully');

    console.log('\nAll API tests passed!');
  } catch (error) {
    console.error('API Test Failed:', error.response ? error.response.data : error.message);
  }
}

testAPI();
