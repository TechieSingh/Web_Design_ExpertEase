import dotenv from "dotenv";
import {
  Like,
  Comment,
  Interest,
  UserInterestMapping,
  Topic,
  Article,
  MentorshipSlot,
  UserTopicMapping,
  User
} from '../models/expertease-schema.js'
import axios from "axios";
import { Types } from "mongoose";


const token = process.env.TOKEN;

// Interest Services

// Adjust fetchAllInterests function to accept the search query
export const fetchAllInterests = async (searchQuery) => {
  const existingInterests = await Interest.find(searchQuery).exec();
  return existingInterests;
};

export const createInterest = async (newInterest) => {
  const newlyInterest = new Interest(newInterest);
  return newlyInterest.save();
};

// Service to update an existing node
export const updateInterest = async (id, updatedInterest) => {
  try {
    const interest = await Interest.findOneAndUpdate(
      { interest_ID: id },
      updatedInterest,
      { new: true }
    );

    return interest;
  } catch (error) {
    throw error;
  }
};

// Service to delete an exisiting node
export const deleteInterest = async (id) => {
  try {
    const interest = await Interest.deleteOne({ interest_ID: id });
    return interest;
  } catch (error) {
    throw error;
  }
};

// Topic Services

export const filterTopicsByName = async (keywords) => {
  try {
    const query = {};

    if (keywords) {
      query.$or = [{ topic_Name: { $regex: keywords, $options: "i" } }];
    }

    const filteredTopics = await Topic.find(query).exec();
    return filteredTopics;
  } catch (error) {
    throw error;
  }
};

export const fetchAllTopics = async (params) => {
  const existingTopics = await Topic.find(params).exec();
  return existingTopics;
};

export const createTopic = async (newTopic) => {
  const newlyTopic = new Topic(newTopic);
  return newlyTopic.save();
};

// Service to update an existing node
export const updateTopic = async (id, updatedTopic) => {
  try {
    const topic = await Topic.findOneAndUpdate({ topic_ID: id }, updatedTopic, {
      new: true,
    });

    return topic;
  } catch (error) {
    throw error;
  }
};

// Service to delete an exisiting node
export const deleteTopic = async (id) => {
  try {
    const topic = await Topic.deleteOne({topic_ID: id });
    return topic;
  } catch (error) {
    throw error;
  }
};

// User - Interest Mapping Services

export const fetchAllUserInterestMappings = async (params) => {
  const existingUserInterestMappings = await UserInterestMapping.find(
    params
  ).exec();
  return existingUserInterestMappings;
};

// export const createUserInterestMapping = async (userId, newUserInterestMapping) =>{

//     const newlyUserInterestMapping = new UserInterestMapping(newUserInterestMapping)
//     newlyUserInterestMapping.user_ID = userId;
//     return newlyUserInterestMapping.save()

// }

export const addUserInterests = async (userId, newUserInterestIDs) => {
  try {
      const interestObjects = await Interest.find({
          interest_ID: { $in: newUserInterestIDs }
      });

      console.log('Fetched Interest Objects:', interestObjects);
      if (!interestObjects.length) {
          throw new Error("No valid interests found with the provided IDs");
      }

      const filter = { user_ID: userId };
      const update = { $set: { interests: interestObjects } };
      const options = { new: true, upsert: true };


      const updatedUser = await User.findOneAndUpdate(filter, update, options);
      console.log('Updated User:', updatedUser);

      return updatedUser;
  } catch (error) {
      console.error("Error updating interests for user:", error);
      throw error;
  }
};


export const deleteUserInterestMapping = async (interestId) => {
  try {
    const result = await UserInterestMapping.findOneAndDelete({
      // user_ID: userId,
      interest_ID: interestId,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const fetchUserInterestsByUserId = async (userId) => {
    try {
      // Fetch the user and include the interests field in the result
      const user = await User.findOne({ user_ID: userId })
        .populate('interests') // Only necessary if 'interests' are references to another collection
        .exec();
  
      if (!user) {
        console.log('No user found with the given ID:', userId);
        return null; // or you can throw an error depending on your error handling policy
      }
  
      // Log the number of interests found, if needed for debugging
      console.log('Number of interests found for the user:', user.interests.length);
  
      return user.interests;
    } catch (error) {
      console.error("Error fetching user interests:", error);
      throw error;
    }
  };
  

// User-Topic Mapping Services

export const fetchAllTopicsForUser = async (userId, search) => {
  try {
      const user = await User.findOne({ user_ID: userId });
      if (!user) {
          console.log('No user found with the given ID:', userId);
          return null;
      }
      console.log('Fetched user with ID:', userId);

      if (!user.topic || user.topic.length === 0) {
          console.log('No topics found for this user.');
          return [];
      }

      // If there is a search term, use it to filter topics by name
      const searchRegex = new RegExp(search, 'i'); // 'i' for case insensitive
      const topics = await Promise.all(
          user.topic.map(async (topicEmbed) => {
              // Modify the findOne to include the search condition
              return Topic.findOne({ 
                  topic_ID: topicEmbed.topic_ID, 
                  topic_Name: { $regex: searchRegex }
              });
          })
      ).then(results => results.filter(topic => topic !== null)); // Filter out null results if topic not found

      console.log('Number of topics found for the user:', topics.length);
      return topics;
  } catch (error) {
      console.error("Error fetching user topics:", error);
      throw error;
  }
};


export const followTopic = async (userId, newTopicId) => {
  try {
      // First, increment the followers count of the topic
      const updatedTopic = await Topic.findOneAndUpdate(
          { topic_ID: newTopicId },
          { $inc: { followers: 1 } },
          { new: true } // Returns the updated document
      );

      if (!updatedTopic) {
        throw new Error("Topic not found or unable to update");
      }

      // Define the filter for locating the user and checking if the topic is already added
      const userFilter = { user_ID: userId, "topic.topic_ID": { $ne: newTopicId } };

      // Update operation to add the updated topic object if not already included
      const update = {
          $addToSet: { topic: updatedTopic }  // Adding the updated topic object with incremented follower count
      };

      const options = { new: true, upsert: true };

      // Update the User document to add the new topic
      const updatedUser = await User.findOneAndUpdate(userFilter, update, options);

      // Re-fetch the user to ensure populated topics reflect the latest state
      if (updatedUser) {
          return await User.findOne({ user_ID: userId }).populate('topic');
      }

      return updatedUser; // In case the topic was not added
  } catch (error) {
      console.error("Failed to add topic to user:", error);
      throw error;
  }
};





export const unfollowTopic = async (userId, topicId) => {
    try {
        console.log("entered unfollow service");
        // Define the filter for locating the user document
        const filter = { user_ID: userId };
        
        // Define the update operation to pull the topic from the topics array
        // This assumes that topics are stored as embedded objects with a 'topic_ID' field
        const update = { $pull: { topic: { topic_ID: topicId } } };
        
        // Specify options to get the updated document back
        const options = { new: true };
    
        // Update the user document to remove the topic
        const updatedUser = await User.findOneAndUpdate(filter, update, options);
        return updatedUser;
      } catch (error) {
        console.error('Failed to remove topic from user:', error);
        throw new Error("Internal server error");
      }
}


export const recommendTopicsForUser = async (userId) => {
    try {
        // Fetch user document with interests and topics
        console.log("entered unfollow service");
        const user = await User.findOne({ user_ID: userId }).exec();
        if (!user || !user.interests) {
            throw new Error('No interests found for this user');
        }

        // Extract topic IDs already followed by the user
        const existingTopicIds = user.topics ? user.topics.map(topic => topic.topic_ID) : [];

        // Find topics that match user interests but are not already followed
        const recommendedTopics = await Topic.find({
            interest_ID: { $in: user.interests.map(interest => interest.interest_ID) },
            topic_ID: { $nin: existingTopicIds }
        }).exec();

        return recommendedTopics;
    } catch (error) {
        console.error('Error recommending topics:', error);
        throw error;
    }
}




//    Discussion Service Methods



export const getArticlesForTopic = async (topicId, { page = 1, limit = 10, sortBy = 'created_at', order = 'desc' }) => {
  try {
      const options = {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          sort: { [sortBy]: (order === 'desc' ? -1 : 1) }
      };
      console.log(topicId);

      // Correctly use the paginate method
      console.log("Querying articles for topic ID:", topicId, "with options:", options);
      const result = await Article.paginate({ topic_ID: topicId }, options);
      console.log("Query result:", result);
      
      return result;
  } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
  }
};




export const createNewArticle = async (topicId, article) => {
    try{


        const topicArticle = new Article(article);
        const topic = await Topic.findOne({topic_ID: topicId});
        if (!topic) {
            throw new Error('Topic not found');
        }
        topicArticle.topic_ID = topicId;
        console.log(topic);
        topicArticle.topic_Name = topic.topic_Name;
        return topicArticle.save()

    } catch (error)
    {
        throw error;
    }
}


export const getAllArticlesForUser = async (userId, { page = 1, limit = 10, sortBy = 'created_at', order = 'desc' }) => {
  try {
      // Find user by userId to access their followed topics
      const user = await User.findOne({ user_ID: parseInt(userId, 10) });
      if (!user || !user.topic || user.topic.length === 0) {
          return { message: "No topics found for this user.", docs: [] };
      }

      // Extract topicIds from the user's followed topics
      const topicIds = user.topic.map(t => t.topic_ID);
      console.log("User is following topics IDs:", topicIds);

      // Pagination options
      const options = {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          sort: { [sortBy]: order === 'desc' ? -1 : 1 },
      };

      // Fetch discussions based on the topic IDs
      const discussions = await Article.paginate({ topic_ID: { $in: topicIds } }, options);
      return discussions;

  } catch (error) {
      console.error("Error fetching discussions for user:", error);
      throw error;
  }
}



// Like Service Methods:

export const likeArticle = async({ article_id, user_id }) => {
    try{ 

      const article = await Article.findOne({
        article_id,
        }).lean();
        let newArticle;

        if (article) {
            // Prevent duplicate likes.
            if (article.likes.includes(String(user_id))) {
                return ("User already liked article");
            }

            // Update the article with the new like.
            newArticle = await Article.findOneAndUpdate(
                { article_id },
                {
                $inc: { likes_count: 1 },
                $push: { likes: user_id },
                },
                { new: true }
            );
        }



        return newArticle;
    } catch (error) {
        throw error;
    }
}


export const unlikeArticle = async({ article_id, user_id }) => {
    try{

        // Fetch the article to check if the user has already liked it.
        const article = await Article.findOne({
          article_id,
          }).lean();


          if (!article || !article.likes.includes(user_id)) {
            return ("Can't unlike, as user didn't like article or article not found");
        }

        // Update the article, reducing the like count and removing the user's ID from likes.
        const updatedArticle = await Article.findOneAndUpdate(
          { article_id },
          {
              $inc: { likes_count: -1 },
              $pull: { likes: user_id },
          },
          { new: true }
          );

        return updatedArticle;
    } catch (error) {
        throw error;
    }
}


// Comment Service Methods:


export const getAllCommentsForArticle = async (articleId, { sort_by, page, limit }) => {
    try {
      const limitAsNumber = Number(limit);
      if (isNaN(limitAsNumber)) {
          throw new Error("Invalid request: limit must be a number");
      }
      const pageAsNumber = Number(page);
      if (isNaN(pageAsNumber)) {
              throw new Error("Invalid request: page must be a number");
          }
      if (pageAsNumber < 1 || pageAsNumber % 1 !== 0) {
            throw new Error(
                "Invalid request: 'page' must be a whole number greater than 0"
            );
        }

      // Define the sort filter based on 'sort_by' query parameter.
      let sort = {}; // Initializes the sort object

      // Determines the sort order based on the sort_by variable
      if (sort_by === "popular") {
          sort = { likes_count: -1, created_at: -1 }; // Sorting by popularity (more likes and newer dates first)
      }
      if (sort_by === "newest") {
          sort = { created_at: -1 }; // Sorting by newest first
      }
      if (sort_by === "oldest") {
          sort = { created_at: 1 }; // Sorting by oldest first
      }

      // Calculate the number of results to skip for pagination.
      const skipCount = (pageAsNumber - 1) * limitAsNumber;

      // Fetch comments based on filters, pagination, and sorting.
      const comments = await Comment.find({
        article_id: articleId
        })
        .limit(limitAsNumber)
        .skip(skipCount)
        .sort(sort);
      
        return comments;
      
      }
     catch (error) {
        throw error;
    }
  }


export const getCommentsCount = async(articleId) =>{
  try{
    const article = await Article.findOne({ article_id: articleId }, 'comments_count');
    const commentsCount = article.comments_count;
    return commentsCount;
  }catch(error){
    throw error;
  }
}


export const addComment = async ({ article_id, comment_body, user_ID  }) => {
  try {
      const comment = new Comment({
        article_id: article_id,
        comment_body: comment_body,
        likes: [],
        likes_count: 0,
        created_at: new Date(),
        user_ID: user_ID,
        });


      // Save the new comment
      await comment.save();

// Fetch the article to update its comment or reply count.
    const article = await Article.findOne({
      article_id,
      }).lean();

      if (article) {
        // Increment the comments count in the article
        const updateField = { $inc: { comments_count: 1 } };
        await Article.findOneAndUpdate({ article_id }, updateField);
    }
    


      return comment;
  } catch (error) {
      console.error('Service error adding comment:', error);
      throw error;
  }
};


export const getFollowerCount = async (topicId) => {
  try {
      const topic = await Topic.findOne({ topic_ID: topicId });
      if (!topic) {
          console.log("No topic found with the given ID:", topicId);
          return null; // or you can throw an error depending on your error handling policy
      }
      return topic.followers;
  } catch (error) {
      console.error("Error fetching follower count:", error);
      throw error;
  }
};


export const getTopTopics = async() =>{
  try{
    const topics = await Topic.find()
      .sort({ followers: -1 }) 
      .limit(5);
      return topics; 
  }catch(error){
    throw error;
  }
} 


// Mentorship Slots Service Methods

export const fetchAllMentorshipSlots = async () => {
  try {
    const slots = await MentorshipSlot.find().sort({ slot_StartTime: 'asc' });
    return slots;
  } catch (error) {
    throw error;
  }
}






export const getMentorshipSlotsForUser = async (userId) => {
  try {
    // Find the user by user_ID and only return the slots field
    const userWithSlots = await MentorshipSlot.find({ user_ID: userId });

    if (!userWithSlots || userWithSlots.length === 0) {
      console.log('No mentorship slots found for the given user ID:', userId);
      return null;  // or handle as you prefer, perhaps an empty array or an error message
    }

    // Return the slots array directly
    return userWithSlots;
  } catch (error) {
    console.error('Failed to fetch mentorship slots for user:', error);
    throw error;  // or return an error response depending on your error handling policy
  }
}



export const deleteMentorshipSlot = async (userId, meetingId) => {
  try {
    // Find the mentorship slot by user_ID and slot_ID and delete it
    const deletedSlot = await MentorshipSlot.deleteOne({ user_ID: userId, meeting_ID: meetingId });

    if (deletedSlot.deletedCount === 0) {
      console.log('No mentorship slot found with the given user ID and slot ID:', userId, meetingId);
      return null;  // or handle as you prefer, perhaps a message indicating no change was made
    }

    console.log('Mentorship slot deleted successfully');
    return deletedSlot;  // Depending on what you need, you might return only a success message
  } catch (error) {
    console.error('Failed to delete mentorship slot:', error);
    throw error;  // or return an error response depending on your error handling policy
  }
}



export const createMentorshipSlot  = async(userId, meetingBody) =>{
  const type = 2;
  const start_time = meetingBody.start_time;
  const topic = meetingBody.topic;
  const duration = meetingBody.duration;
  
  try{
    const response = await axios.post('https://api.zoom.us/v2/users/me/meetings',{
      topic,
      type,
      start_time,
      duration,
      settings:{
          host_video:true,
          participant_video:true,
          join_before_host:false,
          mute_upon_entry:true,
          watermark:false,
          use_pmi:false,
          approval_type:0,
          audio:'both',
          auto_recording:'none'
      }
  },{
      headers:{
          'Authorization':`Bearer eyJzdiI6IjAwMDAwMSIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6IjRlMTIzZTJhLWI2MmYtNDQ0Mi1iMDIwLTg3NDEzOTdlZTU5MyJ9.eyJ2ZXIiOjksImF1aWQiOiIwZDM4ZTcwZmJkNzBkNGE1YzgyNmU1NGU2YjBkZmUxOCIsImNvZGUiOiJ5MzJseDhKMjE0NVZaVnF0b1hyUVF5QlB0SnZ2VEo4aWciLCJpc3MiOiJ6bTpjaWQ6NTl2YV9HcUtSbERFZndpY2pKdnBBIiwiZ25vIjowLCJ0eXBlIjowLCJ0aWQiOjAsImF1ZCI6Imh0dHBzOi8vb2F1dGguem9vbS51cyIsInVpZCI6InlsSUJUX042VHRHbUdJUUU0ZkhjNnciLCJuYmYiOjE3MTM4NDI1MjEsImV4cCI6MTcxMzg0NjEyMSwiaWF0IjoxNzEzODQyNTIxLCJhaWQiOiJlMWYwM1dqRVJhR2RUYUFZSktjZ2p3In0.2Cu0FXtPlENeTxftNfw9ksBrwEHsfudeJz8zc0EBg73n9E93xgaWMU5ExPZ4bP4U3fogj-5sTPnlkKwHqLh4PA`
      },

  });
  const zoomMeeting = response.data;

  const mentorshipSlot = new MentorshipSlot({
// Associate the user_ID with the mentorship slot
    user_ID: userId,
    slot_StartTime: new Date(zoomMeeting.start_time),
    slot_Link: zoomMeeting.start_url, 
    slot_Duration: duration,
    slot_Topic: topic,
    meeting_ID: zoomMeeting.id
  });

  // Save the new mentorship slot to the database
  const savedSlot = await mentorshipSlot.save();

  return savedSlot;

  }catch(error){
    throw error;
  }

}


export const editMentorshipSlot = async(changes, meetingId) =>{
  try{
    // Destructure the changes object to get the updated values
    const newStartTime = changes.start_time;
    const newTopic= changes.topic;
    const newDuration = changes.duration;
    console.log(" inside edit meeting service")
    // Make the request to the Zoom API to update the meeting
    const response = await axios.patch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      topic: newTopic,
      start_time: newStartTime,
      duration: newDuration
    }, {
      headers: {
        'Authorization': `Bearer eyJzdiI6IjAwMDAwMSIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6IjRlMTIzZTJhLWI2MmYtNDQ0Mi1iMDIwLTg3NDEzOTdlZTU5MyJ9.eyJ2ZXIiOjksImF1aWQiOiIwZDM4ZTcwZmJkNzBkNGE1YzgyNmU1NGU2YjBkZmUxOCIsImNvZGUiOiJ5MzJseDhKMjE0NVZaVnF0b1hyUVF5QlB0SnZ2VEo4aWciLCJpc3MiOiJ6bTpjaWQ6NTl2YV9HcUtSbERFZndpY2pKdnBBIiwiZ25vIjowLCJ0eXBlIjowLCJ0aWQiOjAsImF1ZCI6Imh0dHBzOi8vb2F1dGguem9vbS51cyIsInVpZCI6InlsSUJUX042VHRHbUdJUUU0ZkhjNnciLCJuYmYiOjE3MTM4NDI1MjEsImV4cCI6MTcxMzg0NjEyMSwiaWF0IjoxNzEzODQyNTIxLCJhaWQiOiJlMWYwM1dqRVJhR2RUYUFZSktjZ2p3In0.2Cu0FXtPlENeTxftNfw9ksBrwEHsfudeJz8zc0EBg73n9E93xgaWMU5ExPZ4bP4U3fogj-5sTPnlkKwHqLh4PA`
      }
    });

    const updatedMeeting = await MentorshipSlot.findOneAndUpdate(
      { meeting_ID: meetingId },
      { slot_StartTime: newStartTime, slot_Duration: newDuration, slot_Topic: newTopic },
      { new: true }
    );

    // Return the updated meeting details
    return updatedMeeting
  } catch(error) {
    throw error;
  }
}
