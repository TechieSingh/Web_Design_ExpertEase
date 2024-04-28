// ArticleComponent.tsx
import React from "react";
import { Article } from "../Modules/type";
import { CommentSection, User } from "replyke";

interface ArticleComponentProps {
  article: Article;
  user: {
    _id: string;
    name?: string;
    img?: string;
  } | null;
  loginClickCallback: () => void;
  commentAuthorClickCallback: (author: User) => void;
  currentUserClickCallback: (user: User) => void;
  apiBaseUrl: string;
  onSelectPage: (page: string) => void;
  onArticleSelect?: (articleId: number) => void;
}

const ArticleComponent: React.FC<ArticleComponentProps> = ({
  article,
  user,
  loginClickCallback,
  commentAuthorClickCallback,
  currentUserClickCallback,
  apiBaseUrl,
  onSelectPage,
  onArticleSelect,
}) => {
  const handleArticleClick = () => {
    if (onArticleSelect) {
      // Check if the callback is provided
      onArticleSelect(article.topic_ID);
    }
    onSelectPage("topic"); // Navigate to the topic page regardless of onArticleSelect being provided
  };
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg mb-4 text-white">
      <button
        className="underline hover:text-zinc-950"
        onClick={handleArticleClick}
      >
        {article.article_Title}
      </button>
      <p className="mb-4">{article.article_Content}</p>
      <CommentSection
        apiBaseUrl={apiBaseUrl}
        articleId={article.article_id}
        callbacks={{
          loginClickCallback,
          commentAuthorClickCallback,
          currentUserClickCallback,
        }}
        currentUser={
          user
            ? {
                _id: user._id,
                name: user.name,
                img: user.img,
              }
            : undefined
        }
        styleId="6621ab58bed37d9c9aa94bb3"
      />
    </div>
  );
};

export default ArticleComponent;
