import React, { useEffect, useState } from "react";
import { Post } from "./types/type"; // Import the Post interface if it's defined in a separate file
import postsData from "../../pages/posts.json"; // Import JSON data directly

const MyComponent: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(postsData); // Set posts directly from the imported JSON data
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>Likes: {post.likes}</p>
          <p>Comments: {post.comments.length}</p>
          <ul>
            {post.comments.map((comment) => (
              <li key={comment.id}>
                <p>UserID: {comment.userId}</p>
                <p>Content: {comment.content}</p>
                <p>Likes: {comment.likes}</p>
                <p>Dislikes: {comment.dislikes}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MyComponent;
