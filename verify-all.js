const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/tasks';

async function verifyPersistence() {
  try {
    console.log('\n--- 1. Testing Creation Persistence ---');
    const createRes = await axios.post(BASE_URL, {
      title: 'Persistent Task',
      owner: 'verify@example.com',
      dueDate: new Date(),
      priority: 'Medium',
    });
    const taskId = createRes.data.data._id;
    console.log('Created ID:', taskId);

    // Verify it exists in the list
    const listResAfterCreate = await axios.get(BASE_URL);
    const createdExists = listResAfterCreate.data.data.some(t => t._id === taskId);
    console.log('Exists in list after creation:', createdExists);

    console.log('\n--- 2. Testing Completion Persistence ---');
    const completeRes = await axios.patch(`${BASE_URL}/${taskId}/complete`);
    console.log('Status after patch:', completeRes.data.data.status);

    // Verify it remains completed in a new fetch
    const fetchAfterComplete = await axios.get(`${BASE_URL}/${taskId}`);
    console.log('Status after re-fetching:', fetchAfterComplete.data.data.status);
    const completePersists = fetchAfterComplete.data.data.status === 'completed';
    console.log('Completion status persists:', completePersists);

    console.log('\n--- 3. Testing Deletion Persistence ---');
    await axios.delete(`${BASE_URL}/${taskId}`);
    console.log('Delete request sent.');

    // Verify it is gone from the list
    const listResAfterDelete = await axios.get(BASE_URL);
    const stillExists = listResAfterDelete.data.data.some(t => t._id === taskId);
    console.log('Exists in list after deletion:', stillExists);

    if (createdExists && completePersists && !stillExists) {
      console.log('\n✅ ALL PERSISTENCE TESTS PASSED!');
    } else {
      console.log('\n❌ PERSISTENCE TEST FAILED!');
    }

  } catch (error) {
    console.error('Test error:', error.response ? error.response.data : error.message);
  }
}

verifyPersistence();
