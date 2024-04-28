import { request, response } from 'express';
import * as experteaseService from '../services/expertease-services.js'
import {setResponse, setError} from './response-handler.js'
import dotenv from 'dotenv';

import axios from 'axios';

// Interest Controller Methods

export const fetchallInterests = async(request, response) => {
    try {
      // Get the search query parameter from the client request
      const search = request.query.search;
  
      // Find interests that match the search query using a case-insensitive regex
      const searchQuery = search
        ? { interest_Name: new RegExp(search, 'i') } // 'i' makes it case-insensitive
        : {};
  
      const interests = await experteaseService.fetchAllInterests(searchQuery);
      setResponse(interests, response);
    } catch(error) {
      setError(error, response);
    }
  };



export const createInterest = async(request, response) =>{

    try{
        
        const interest  = {...request.body};
        const interestResponse = await experteaseService.createInterest(interest);
        setResponse(interestResponse, response);

    } catch(error){

        setError(error, response);

    }

}



export const updateInterest = async(request, response) =>{

    try{
        
        const interest_ID = request.params.id;
        const updatedInterest  = {...request.body};
        const interestResponse = await experteaseService.updateInterest(interest_ID,updatedInterest);
        setResponse(interestResponse, response);

    } catch(error){

        setError(error, response);

    }

}


export const deleteInterest = async(request, response) =>{

    try{
        
        const interest_ID = request.params.id;
        const interestResponse = await experteaseService.deleteInterest(interest_ID);
        setResponse(interestResponse, response);

    } catch(error){

        setError(error, response);

    }

}


// Topic Controller Methods

export const filterTopicsByName = async(request, response) =>{

    try {
        const {keywords} = request.query;

        const filteredTopics = await experteaseService.filterTopicsByName(keywords);
        setResponse(filteredTopics, response);
    } catch (error) {
        setError(error, response);
    }

}

export const fetchAllTopics = async(request, response) =>{

    try{
        const params = {...request.query};
        const topics = await experteaseService.fetchAllTopics(params);
        setResponse(topics, response);

    } catch(error){

        setError(error, response);

    }

}

export const createTopic = async(request, response) =>{

    try{
        
        const topic  = {...request.body};
        const topiclyResponse = await experteaseService.createTopic(topic);
        setResponse(topiclyResponse, response);

    } catch(error){

        setError(error, response);

    }

}

export const deleteTopic = async(request, response) =>{

    try{
        
        const topic_ID = request.params.id;
        const topicResponse = await experteaseService.deleteTopic(topic_ID);
        setResponse(topicResponse, response);

    } catch(error){

        setError(error, response);

    }

}



// User - Interest Mapping Controller 


export const fetchAllUserInterestMappings = async(request, response) =>{

    try{
        const params = {...request.query};
        const userInterestMappings = await experteaseService.fetchAllUserInterestMappings(params);
        setResponse(userInterestMappings, response);

    } catch(error){

        setError(error, response);

    }

}


export const addInterestsForUser = async(request, response) =>{

    try{
        const userId = request.params.id;
        const newUserInterestIDs = request.body.interest_IDs;        
        const userInterestlyResponse = await experteaseService.addUserInterests(userId, newUserInterestIDs);
        setResponse(userInterestlyResponse, response);

    } catch(error){

        setError(error, response);

    }

}


export const deleteUserInterestMapping = async(request, response) =>{

    try{
        const interestId = request.user.id
        const userInterestResponse = await experteaseService.deleteUserInterestMapping(interestId);

        setResponse(userInterestResponse, response);

    } catch(error){

        setError(error, response);

    }

}



export const fetchAllInterestsForUser = async(request, response) =>{

    try{
        const userId = request.params.id;
        const params = {...request.query};
        const userInterestMappings = await experteaseService.fetchUserInterestsByUserId(userId);
        setResponse(userInterestMappings, response);

    } catch(error){

        setError(error, response);

    }

}




// Controller methods for UserTopicMapping


export const fetchAllTopicsForUser = async(request, response) =>{

    try{
        const userId = request.user.id;
        const searchQuery = request.query.search || '';
        const userTopicMappings = await experteaseService.fetchAllTopicsForUser(userId,searchQuery);
        setResponse(userTopicMappings, response);

    } catch(error){

        setError(error, response);

    }

}



export const followTopic = async(request, response) =>{

    try {
        console.log('entered controller');
        const userId = request.user.id;
        const { newTopicId } = request.body;  // Assumed that newTopicId is directly sent in the body
        const userTopiclyResponse = await experteaseService.followTopic(userId, newTopicId);
        response.json(userTopiclyResponse); // Assuming a setResponse function formats and sends the response
    } catch (error) {
        console.error("Error in controller while adding topic for user:", error);
        response.status(500).send({ error: 'Failed to add topic for user' });
    }

}





export const unfollowTopic = async(request, response) =>{

    try {
        
        const userId = request.userId;
        const  topicId  = request.body.topicId; // Assumed that topicId is directly sent in the body
        const userTopiclResponse = await experteaseService.unfollowTopic(userId, topicId);
        
        if (!userTopiclResponse) {
            response.status(404).json({ message: "No user topic mapping found or topic ID not present." });
        } else {
            response.status(200).json({ message: "Topic removed successfully from the mapping", data: userTopiclResponse });
        }
    } catch (error) {
        console.error("Error in controller while unfollowing topic for user:", error);
        response.status(500).send({ error: 'Failed to unfollow topic for user' });
    }

}



export const recommendTopicsForUser = async (request, response) => {
    try {
        const userId = request.user.id;
        const recommendedTopics = await experteaseService.recommendTopicsForUser(userId);
        setResponse(recommendedTopics, response);
    } catch (error) {
        setError(error, response);
    }
}



// Discussion Controller Methods


export const getArticlesForTopic = async (request, response) => {
    try {
        const topicId = request.params.topicId;
        const { page, limit, sortBy, order } = request.query;
        const topicArticles = await experteaseService.getArticlesForTopic(topicId, { page, limit, sortBy, order });
        setResponse(topicArticles, response);
    } catch (error) {
        setError(error, response);
    } 
};


export const createNewArticle = async (request, response) => {
    try {
        const topicId = request.params.topicId;
        // Destructure the user ID from the request user object
        const userId = request.user.id;

        // Destructure the rest of the article data from the request body
        const { article_Content, article_Title } = request.body;
        
        // Construct the article object with the user ID from the request
        const article = {
            user_ID: userId,
            article_Content,
            article_Title,
        };

        // Call the service to create a new article
        const createdArticle = await experteaseService.createNewArticle(topicId, article);
        
        // Set the response with the created article
        setResponse(createdArticle, response);
    } catch (error) {
        // Send an error response
        setError(error, response);
    }
}



export const getAllArticlesForUser = async (request, response) =>{
    try{
        console.log("inside wrong controller");
        const  userId  = request.user.id;
        const { page, limit, sortBy, order} = request.query;

        const discussionsForUser = await experteaseService.getAllArticlesForUser(userId, {page, limit, sortBy, order});
        setResponse(discussionsForUser, response);

    }catch (error){
        setError(error, response);
    }
}


// Discussion Like Controller Methods:

export const likeArticle = async(request, response) => {
    try{
        const { article_id, user_id } = request.body;
        // Validate the presence of article_id and user_id.
        if (!article_id || !user_id) {
            return response
                .status(400)
                .send("Missing article_id or user_id in request body");
        }
        const likedDiscussion = await experteaseService.likeArticle({ article_id, user_id });
        setResponse(likedDiscussion, response);
    }catch (error){
        setError(error, response);
    }
}


export const unlikeArticle = async(request, response) => {
    try{
        const { article_id, user_id } = request.body;
        // Validate the presence of article_id and user_id.
        if (!article_id || !user_id) {
            return response
                .status(400)
                .send("Missing article_id or user_id in request body");
        }
        const unlikedArticle = await experteaseService.unlikeArticle({ article_id, user_id });
        setResponse(unlikedArticle, response);
    }catch (error){
        setError(error, response);
    }
}



// Comment Controller Methods:

export const getAllCommentsForArticle = async (request, response) => {
    try {
        console.log("replyke controller");
        const { article_id, sort_by, page = 1, limit = 5 } = request.query;
        const comments = await experteaseService.getAllCommentsForArticle(article_id, {
            sort_by,
            page,
            limit
        });
        setResponse(comments, response);
    } catch (error) {
        setError(error);
    }
};


export const getCommentsCount = async(request, response) =>{
    try{
        const articleId = request.params.articleId;
        const commentCount = await experteaseService.getCommentsCount(articleId);
        setResponse(commentCount, response);
    }catch(error){
        setError(error, response);
    }
}



export const addComment = async (request, response) => {
    try {

        console.log("inside add comment controller")
        const { article_id, comment_body, user_ID  } = request.body;

        if (!article_id || !comment_body || !user_ID) {
            return response.status(400).send("Missing required comment details");
        }
        
    
        // Ensuring that user ID and comment content are provided
        // if (!comment.userId || !comment.comment_content) {
        //     return response.status(400).json({ message: "Missing required fields (userId, comment_content)" });
        // }

        const addedComment = await experteaseService.addComment({ article_id, comment_body, user_ID  });
        // response.status(201).json(addedComment);
        setResponse(addedComment, response);
    } catch (error) {
        setError(error, response);
    }
};

export const getFollowersCount = async(request, response) => {
    try{
        const topicId = request.params.id;
        const followersCount = await experteaseService.getFollowerCount(topicId);
        setResponse(followersCount, response);

    }catch (error){
        setError(error, response);
    }
}

export const getTopTopics = async(request, response) =>{
    try{

        const topics = await experteaseService.getTopTopics();
        setResponse(topics, response);

    }catch(error){
        setError(error, response);
    }
}


// Mentorship Slots controller methods

export const fetchallMentorshipSlots = async(request, response) =>{
    try{
        const slots = await experteaseService.fetchAllMentorshipSlots();
        setResponse(slots, response);
    
    }catch(error){
        setError(error);
    }
}


export const createMentorshipSlot = async(request, response) =>{

        const userId = request.user.id;
        const slotBody  = request.body;
        try{
            const updatedUser = await experteaseService.createMentorshipSlot(userId, slotBody);
            setResponse(updatedUser, response);
        }catch (error){
            setResponse(error, response);
        }

}


export const getMentorshipSlotsForUser = async(request, response) =>{
    try{
        console.log("inside getMentoshipSLot controller");
        const userId = request.user.id;
        console.log(userId);
        const slots = await experteaseService.getMentorshipSlotsForUser(userId);
        setResponse(slots, response)
    }catch(error) {
        setError(error, response);
    }
}

export const deleteMentorshipSlot = async(request, response) =>{
    try{
        const userId = request.user.id;
        const meetingId = request.params.meetingId;
        const slot = await experteaseService.deleteMentorshipSlot(userId, meetingId);
        setResponse(slot, response);


    }catch(error){
        setError(error, response);
    }
}


export const createMeeting = async(request, response) =>{
    try{
        const meetingBody = request.body;

        const createdMeeting  = await experteaseService.createMeeting(meetingBody);
        setResponse(createdMeeting,response);

    }catch (error){
        setError(error, response);
    }
}


export const editMentorshipSlot = async(request, response) =>{
    try{
        const meetingId = request.params.meetingId
        console.log(meetingId)
        const changes = request.body;
        const updatedMeeting = await experteaseService.editMentorshipSlot(changes, meetingId);
        setResponse(updatedMeeting, response);

    }catch(error){
        setError(error, response);
    }
}
