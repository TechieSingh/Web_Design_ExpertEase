import express from "express";
import { Comment } from "../models/expertease-schema.js";
import { Article } from "../models/expertease-schema.js";
import {
  getAllCommentsForArticle,
  addComment,
  likeArticle,
  unlikeArticle,
} from "../controllers/expertease-controller.js";
const replykeRouter = express.Router();

// Route to fetch a single article by its ID.
replykeRouter.get("/replyke-articles/:article_id", async (req, res) => {
  try {
    // Extract article_id from the path parameters.
    const { article_id } = req.params;

    // Search for the article using Mongoose's findOne method.
    const article = await Article.findOne({
      article_id,
    }).lean();

    // If no article is found, return a 404 (Not Found) status.
    if (!article) return res.status(404).send();

    // If an article is found, return it with a 200 (OK) status.
    return res.status(200).send(article);
  } catch (err) {
    // In case of any server errors, return a 500 (Internal Server Error) status.
    return res.status(500).send({ error: "Server error" });
  }
});

// Route to like an article.
replykeRouter.post("/replyke-articles/like", async (req, res) => {
  try {
    const { article_id, user_id } = req.body;

    // Validate the presence of article_id and user_id.
    if (!article_id || !user_id) {
      return res
        .status(400)
        .send("Missing article_id or user_id in request body");
    }

    // First we want to fetch the article
    const article = await Article.findOne({
      article_id,
    }).lean();

    let newArticle;

    if (article) {
      // Prevent duplicate likes.
      if (article.likes.includes(user_id)) {
        return res.status(409).send("User already liked article");
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
    } else {
      // Create a new article if it doesn't exist.
      newArticle = new Article({
        article_id,
        likes: [user_id],
        likes_count: 1,
        comments_count: 0,
        replies_count: 0,
      });
      await newArticle.save();
    }

    // Return the updated or newly created article.
    return res.status(200).send(newArticle);
  } catch (err) {
    // Handle server errors.
    return res.status(500).send({ error: "Server error" });
  }
});

// Route to unlike an article.
replykeRouter.post("/replyke-articles/unlike", async (req, res) => {
  try {
    const { article_id, user_id } = req.body;

    // Validate the presence of article_id and user_id.
    if (!article_id || !user_id) {
      return res
        .status(400)
        .send("Missing article_id or user_id in request body");
    }

    // Fetch the article to check if the user has already liked it.
    const article = await Article.findOne({
      article_id,
    }).lean();

    // If the article does not exist or the user hasn't liked it.
    if (!article || !article.likes.includes(user_id)) {
      return res
        .status(409)
        .send("Can't unlike, as user didn't like article or article not found");
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

    // Return the updated article.
    return res.status(200).send(updatedArticle);
  } catch (err) {
    // Handle server errors.
    return res.status(500).send({ error: "Server error" });
  }
});

// Route to retrieve comments with pagination and sorting options.
replykeRouter.get("/replyke-comments", async (req, res) => {
  try {
    const { article_id, sort_by, parent, page = 1, limit = 5 } = req.query;

    // Convert 'limit' and 'page' to numbers and validate them.
    const limitAsNumber = Number(limit);
    if (isNaN(limitAsNumber)) {
      throw new Error("Invalid request: limit must be a number");
    }

    const pageAsNumber = Number(page);
    if (isNaN(pageAsNumber)) {
      throw new Error("Invalid request: page must be a number");
    }

    // Ensure 'page' is a whole number and greater than 0.
    if (pageAsNumber < 1 || pageAsNumber % 1 !== 0) {
      throw new Error(
        "Invalid request: 'page' must be a whole number greater than 0"
      );
    }

    // Define the sort filter based on 'sort_by' query parameter.
    let sort = {};

    if (sort_by === "popular") {
      sort = { likes_count: -1, created_at: -1 };
    }
    if (sort_by === "newest") {
      sort = { created_at: 1 };
    }
    if (sort_by === "oldest") {
      sort = { created_at: -1 };
    }

    // Calculate the number of results to skip for pagination.
    const skipCount = (pageAsNumber - 1) * limitAsNumber;

    // Fetch comments based on filters, pagination, and sorting.
    const comments = await Comment.find({
      article_id,
      parent,
    })
      .limit(limitAsNumber)
      .skip(skipCount)
      .sort(sort);

    // Respond with the fetched comments.
    return res.status(200).send(comments);
  } catch (err) {
    // Handle any server errors.
    return res.status(500).send({ error: "Server error" });
  }
});

// posting a new comment or reply to an article.
replykeRouter.post("/replyke-comments", async (req, res) => {
  try {
    const { article_id, comment_body, parent, author } = req.body;

    // Validate the presence of required fields.
    if (!article_id || !comment_body || !author) {
      return res.status(400).send("Missing required comment details");
    }

    const comment = new Comment({
      article_id,
      body: comment_body,
      parent,
      likes: [],
      likes_count: 0,
      replies_count: 0,
      created_at: new Date(),
      author,
    });
    await comment.save();

    // Update the parent comment's reply count if this is a reply.
    if (parent) {
      await Comment.findByIdAndUpdate(parent, {
        $inc: { replies_count: 1 },
      });
    }

    // Fetch the article to update its comment or reply count.
    const article = await Article.findOne({
      article_id,
    }).lean();

    if (article) {
      // Increment either the direct comments count or the replies count in the article.
      const updateField = parent
        ? { $inc: { replies_count: 1 } }
        : { $inc: { comments_count: 1 } };
      await Article.findOneAndUpdate({ article_id }, updateField);
    } else {
      // Create a new article record if it doesn't exist.
      const newArticle = new Article({
        article_id,
        likes: [],
        likes_count: 0,
        comments_count: 1,
        replies_count: 0,
      });
      await newArticle.save();
    }

    // Return the newly created comment or reply.
    return res.status(200).send(comment);
  } catch (err) {
    // Handle any server errors.
    return res.status(500).send({ error: "Server error" });
  }
});

// deleting a comment and its replies.
replykeRouter.delete("/replyke-comments", async (req, res) => {
  try {
    const { comment_id } = req.body;

    // Ensure comment_id is provided.
    if (!comment_id) {
      return res.status(400).send("Comment ID is required");
    }

    // Retrieve the target comment to initiate the delete operation.
    const targetComment = await Comment.findById(comment_id).lean();
    if (!targetComment) {
      return res.status(404).send("Comment not found");
    }

    // Initialize counters for the number of deleted comments and replies.
    let firstLevelCommentsDeletedCount = 0;
    let repliesDeletedCount = 0;

    // Recursive function to delete a comment and its child comments (replies).
    async function deleteCommentAndChildren(commentId) {
      // We first delete the comment. If all good, we should get the comment document back.
      const comment = await Comment.findByIdAndDelete(commentId).lean();

      if (!comment) {
        throw new Error("Comment deletion failed");
      }

      // Increment appropriate counters based on whether the comment is a reply.
      comment.parent ? repliesDeletedCount++ : firstLevelCommentsDeletedCount++;

      // Delete all child comments (replies) of the current comment.
      const childComments = await Comment.find({
        parent: comment._id,
      }).lean();
      for (const childComment of childComments) {
        await deleteCommentAndChildren(childComment._id);
      }
    }

    // Start the deletion process for the target comment and its replies.
    await deleteCommentAndChildren(comment_id);

    // Update the parent comment's reply count if the target comment was a reply.
    if (targetComment.parent) {
      await Comment.findByIdAndUpdate(targetComment.parent, {
        $inc: { replies_count: -1 },
      });
    }

    // Update the corresponding article's comment and reply counts.
    const article = await Article.findOneAndUpdate(
      { article_id: targetComment.article_id },
      {
        $inc: {
          comments_count: -firstLevelCommentsDeletedCount,
          replies_count: -repliesDeletedCount,
        },
      },
      { new: true }
    );

    if (!article) {
      throw new Error("Article not found for updating comment counts");
    }

    // Return the updated article data.
    return res.status(200).send(article);
  } catch (err) {
    // Handle any server errors.
    return res.status(500).send({ error: "Server error" });
  }
});

// updating the content of a comment.
replykeRouter.patch("/replyke-comments", async (req, res) => {
  try {
    const { update, comment_id } = req.body;

    // Validate the presence of update content and comment_id.
    if (!update || !comment_id) {
      return res.status(400).send("Update content and comment ID are required");
    }

    // Update the comment with the provided content.
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: comment_id },
      { body: update },
      { new: true }
    );

    // If no comment was found or updated, return a 404 (Not Found) status.
    if (!updatedComment) {
      return res.status(404).send("Comment not found or update failed");
    }

    // Return the updated comment.
    return res.status(200).send(updatedComment);
  } catch (err) {
    // Handle any server errors.
    return res.status(500).send({ error: "Server error" });
  }
});

// liking a comment.
replykeRouter.post("/replyke-comments/like", async (req, res) => {
  try {
    const { comment_id, user_id } = req.body;

    // Validate the presence of comment_id and user_id.
    if (!comment_id || !user_id) {
      return res.status(400).send("Comment ID and user ID are required");
    }

    // Retrieve the comment to be liked.
    const comment = await Comment.findById(comment_id).lean();
    if (!comment) {
      return res.status(404).send("Comment not found");
    }

    // Check if the user has already liked the comment.
    if (comment.likes.includes(user_id)) {
      return res.status(409).send("User has already liked this comment");
    }

    // Update the comment with the new like.
    const updatedComment = await Comment.findByIdAndUpdate(
      comment_id,
      { $inc: { likes_count: 1 }, $push: { likes: user_id } },
      { new: true }
    );

    // Return the updated comment.
    return res.status(200).send(updatedComment);
  } catch (err) {
    // Handle any server errors.
    return res.status(500).send({ error: "Server error" });
  }
});

// unliking a comment.
replykeRouter.post("/replyke-comments/unlike", async (req, res) => {
  try {
    const { comment_id, user_id } = req.body;

    // Validate the presence of comment_id and user_id.
    if (!comment_id || !user_id) {
      return res.status(400).send("Comment ID and user ID are required");
    }

    // Retrieve the comment to be unliked.
    const comment = await Comment.findById(comment_id).lean();
    if (!comment) {
      return res.status(404).send("Comment not found");
    }

    // Check if the user has liked the comment.
    if (!comment.likes.includes(user_id)) {
      return res.status(409).send("User hasn't liked this comment");
    }

    // Update the comment to remove the like.
    const updatedComment = await Comment.findByIdAndUpdate(
      comment_id,
      { $inc: { likes_count: -1 }, $pull: { likes: user_id } },
      { new: true }
    );

    // Return the updated comment.
    return res.status(200).send(updatedComment);
  } catch (err) {
    // Handle any server errors.
    return res.status(500).send({ error: "Server error" });
  }
});

// replykeRoutes
//   .route("/replyke-comments")
//   .get(getAllCommentsForArticle)
//   .post(addComment);

// replykeRoutes.route("/replyke-articles/like").post(likeArticle);

// replykeRoutes.route("/replyke-articles/unlike").post(unlikeArticle);

export default replykeRouter;
