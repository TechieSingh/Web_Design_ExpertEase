import axios from "axios";

// Function to generate an array of unique random numbers within a specified range
function getRandomUserIds(count, min, max) {
    const set = new Set();
    while (set.size < count) {
        const userId = Math.floor(Math.random() * (max - min + 1)) + min;
        set.add(userId);
    }
    return Array.from(set);
}

// Assume we have 29 topics and need users in the range 1 to 34
const topicsUserIds = [];
for (let i = 1; i <= 29; i++) {
    const userIds = getRandomUserIds(Math.floor(Math.random() * (30 - 20 + 1) + 20), 1, 34);
    topicsUserIds.push({ topic_ID: i, user_IDs: userIds });
}

// Function to assign a single user to a topic
async function assignUserToTopic(userId, topicId) {
    try {
        const response = await axios.post(`http://localhost:3000/expertease/users/topics/${userId}/topics/add`, {
            newTopicId: topicId
        });
        console.log(`User ${userId} assigned to topic ${topicId}:`, response.data);
    } catch (error) {
        if (error.response) {
            if (error.response.data && error.response.data.error === "Failed to add topic for user") {
                console.log(`Skipping User ${userId}: Already assigned to topic ${topicId}`);
            } else {
                console.error(`Server responded with error for User ${userId} to topic ${topicId}: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            }
        } else if (error.request) {
            console.error(`No response received for User ${userId} when assigning to topic ${topicId}:`, error.request);
        } else {
            console.error(`Error setting up request for User ${userId} to topic ${topicId}:`, error.message);
        }
    }
}

// Assign users to topics
topicsUserIds.forEach(topic => {
    topic.user_IDs.forEach(userId => {
        assignUserToTopic(userId, topic.topic_ID);
    });
});
