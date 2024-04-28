import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { hashPassword } from "../helper/auth.js";
// Like Table Schema
const likeSchema = new Schema({
  like_ID: { type: Number },
  user_ID: { type: Number, required: true },
  discussion_ID: { type: Number, required: true },
});
likeSchema.pre("save", async function (next) {
  if (!this.like_ID) {
    try {
      const lastLike = await this.constructor.findOne(
        {},
        {},
        { sort: { like_ID: -1 } }
      );
      this.like_ID = lastLike ? lastLike.like_ID + 1 : 1;
    } catch (error) {
      console.error("Error auto-incrementing like_ID:", error);
      throw error;
    }
  }
  next();
});
const Like = mongoose.model("Like", likeSchema);

// Comments Table Schema
const commentSchema = new Schema({
  article_id: {
    type: String,
    trim: true,
    required: true,
  },
  body: {
    type: String,
    trim: true,
    required: true,
  },
  parent: {
    type: String,
    trim: true,
    required: false,
  },
  likes: {
    type: [String],
    required: true,
  },
  likes_count: {
    type: Number,
    default: 0,
    required: true,
  },
  replies_count: {
    type: Number,
    default: 0,
    required: true,
  },
  created_at: {
    type: String,
    trim: true,
    required: true,
  },
  author: {
    _id: {
      type: String,
      trim: true,
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    img: {
      type: String,
      trim: true,
    },
  },
});
const Comment = mongoose.model("Comment", commentSchema);

// Interest Table Schema
const interestSchema = new Schema({
  interest_ID: { type: Number },
  interest_Name: { type: String, required: true },
});
interestSchema.pre("save", async function (next) {
  if (!this.interest_ID) {
    try {
      const lastInterest = await this.constructor.findOne(
        {},
        {},
        { sort: { interest_ID: -1 } }
      );
      this.interest_ID = lastInterest ? lastInterest.interest_ID + 1 : 1;
    } catch (error) {
      console.error("Error auto-incrementing interest_ID:", error);
      throw error;
    }
  }
  next();
});
const Interest = mongoose.model("Interest", interestSchema);

// User Interest Mapping Table Schema
const userInterestMappingSchema = new Schema({
  mapping_ID: { type: Number },
  user_ID: { type: Number },
  interests: [interestSchema],
});
userInterestMappingSchema.pre("save", async function (next) {
  if (!this.mapping_ID) {
    try {
      const lastMapping = await this.constructor.findOne(
        {},
        {},
        { sort: { mapping_ID: -1 } }
      );
      this.mapping_ID = lastMapping ? lastMapping.mapping_ID + 1 : 1;
    } catch (error) {
      console.error("Error auto-incrementing mapping_ID:", error);
      throw error;
    }
  }
  next();
});
const UserInterestMapping = mongoose.model(
  "UserInterestMapping",
  userInterestMappingSchema
);

// Discussion Table Schema
const articleSchema = new Schema({
  article_id: {
    type: String,
    trim: true,
  },
  user_ID: { type: Number, required: true }, // need to change later, cant be required as we'll be taking the userInfo from session management
  article_Content: { type: String, required: true },
  article_Title: { type: String, required: true },
  topic_ID: { type: Number },
  topic_Name: { type: String },
  created_at: { type: Date, default: Date.now },
  likes: { type: [String], default: [], required: true },
  likes_count: { type: Number, default: 0, required: true },
  comments_count: { type: Number, default: 0, required: true },
  replies_count: {
    type: Number,
    default: 0,
    required: true,
  },
});
articleSchema.pre("save", async function (next) {
  if (!this.article_id) {
    try {
      const lastArticle = await this.constructor
        .findOne()
        .sort({ article_id: -1 });
      const lastId =
        lastArticle && lastArticle.article_id
          ? parseInt(lastArticle.article_id, 10)
          : 0;
      this.article_id = (lastId + 1).toString(); // Increment and convert to string
    } catch (error) {
      console.error("Error auto-incrementing article_id:", error);
      throw error;
    }
  }
  next();
});

// discussionSchema.plugin(mongoosePaginate);
// const Discussion = mongoose.model('Discussion', discussionSchema);
articleSchema.plugin(mongoosePaginate);
const Article = mongoose.model("Article", articleSchema);

// Topic Table Schema
const topicSchema = new Schema({
  topic_ID: { type: Number },
  topic_Name: { type: String, required: true },
  topic_Description: { type: String, required: true },
  topic_Photo: { type: String, required: true },
  interest_ID: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  followers: { type: Number, default: 0 },
});
topicSchema.pre("save", async function (next) {
  if (!this.topic_ID) {
    try {
      const lastTopic = await this.constructor.findOne(
        {},
        {},
        { sort: { topic_ID: -1 } }
      );
      this.topic_ID = lastTopic ? lastTopic.topic_ID + 1 : 1;
    } catch (error) {
      console.error("Error auto-incrementing topic_ID:", error);
      throw error;
    }
  }
  next();
});
const Topic = mongoose.model("Topic", topicSchema);

// Mentorship Slots Table Schema
const mentorshipSlotSchema = new Schema({
  slot_ID: { type: Number },
  user_ID: { type: Number, default: 0  },
  meeting_ID : {type: Number, required: true},
  slot_StartTime: { type: Date, required: true },
  slot_Link :{type: String, required: true},
  slot_Duration:{type: Number, required: true},
  slot_Topic: { type: String, required: true },
});
mentorshipSlotSchema.pre("save", async function (next) {
  if (!this.slot_ID) {
    try {
      const lastSlot = await this.constructor.findOne(
        {},
        {},
        { sort: { slot_ID: -1 } }
      );
      this.slot_ID = lastSlot ? lastSlot.slot_ID + 1 : 1;
    } catch (error) {
      console.error("Error auto-incrementing slot_ID:", error);
      throw error;
    }
  }
  next();
});
const MentorshipSlot = mongoose.model("MentorshipSlot", mentorshipSlotSchema);

const userSchema = new Schema({
  user_ID: { type: Number },
  first_Name: { type: String },
  last_Name: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  photo: { type: String },
  interests: [interestSchema],
  topic: [topicSchema],
  bio: { type: String },
  slots: [mentorshipSlotSchema],
  isFirstLogin: { type: Boolean, default: true },
});
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await hashPassword(this.password);
    } catch (error) {
      console.error("Error hashing password:", error);
    }
  }
  if (!this.user_ID) {
    try {
      const lastUser = await this.constructor.findOne(
        {},
        {},
        { sort: { user_ID: -1 } }
      );
      this.user_ID = lastUser ? lastUser.user_ID + 1 : 1;
    } catch (error) {
      console.error("Error auto-incrementing user_ID:", error);
      throw error;
    }
  }
  next();
});
const User = mongoose.model("User", userSchema);

const userTopicMappingSchema = new Schema({
  mapping_ID: { type: Number },
  user_ID: { type: Number, required: true }, // Ensure uniqueness to store only one record per user
  topics: [topicSchema],
});

userTopicMappingSchema.pre("save", async function (next) {
  if (!this.mapping_ID) {
    try {
      const lastMapping = await this.constructor.findOne(
        {},
        {},
        { sort: { mapping_ID: -1 } }
      );
      this.mapping_ID = lastMapping ? lastMapping.mapping_ID + 1 : 1;
    } catch (error) {
      console.error("Error auto-incrementing mapping_ID:", error);
      throw error;
    }
  }
  next();
});

const UserTopicMapping = mongoose.model(
  "UserTopicMapping",
  userTopicMappingSchema
);

export {
  Like,
  Comment,
  Interest,
  Article,
  UserInterestMapping,
  User,
  Topic,
  MentorshipSlot,
  UserTopicMapping,
};
