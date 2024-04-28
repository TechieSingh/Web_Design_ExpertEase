import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import createAPIInstance from "../../utils/apiService";
import ArticleComponent from "../HomePage/ArticleComponent";
import { User } from "replyke";
import { Article } from "../Modules/type";

interface MainFeedProps {
  onSelectPage: (page: string) => void;
  onArticleSelect: (topicId: number) => void;
}

const MainFeed: React.FC<MainFeedProps> = ({
  onSelectPage,
  onArticleSelect,
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observer = useRef<IntersectionObserver>();
  const token = useSelector((state: RootState) => state.auth.token);

  const lastArticleElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const fetchArticles = async () => {
      if (!hasMore) return;
      setLoading(true);
      try {
        const response = await createAPIInstance(token).get(
          `/api/articles/users?page=${page}`
        );
        setArticles((prevArticles) => [...prevArticles, ...response.data.docs]);
        setHasMore(response.data.hasNextPage);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
      setLoading(false);
    };

    fetchArticles();
  }, [page, token]);

  // Assuming these callback functions are provided by your application
  const loginClickCallback = () => {
    // handle login logic
  };
  const commentAuthorClickCallback = (author: User) => {
    // navigate to author profile logic
  };
  const currentUserClickCallback = (user: User) => {
    // navigate to user profile logic
  };

  // Simulated user data, replace with actual user data retrieval logic
  const user = {
    _id: "123",
    name: "John Doe", // Example name
    img: "", // Example image URL
  };

  return (
    <>
      {articles.map((article, index) => (
        <div
          key={article._id}
          ref={index === articles.length - 1 ? lastArticleElementRef : null}
          className=" rounded-xl shadow-md "
        >
          <ArticleComponent
            article={article}
            user={user}
            apiBaseUrl="http://localhost:3000/api"
            loginClickCallback={loginClickCallback}
            commentAuthorClickCallback={commentAuthorClickCallback}
            currentUserClickCallback={currentUserClickCallback}
            onSelectPage={onSelectPage}
            onArticleSelect={onArticleSelect}
          />
        </div>
      ))}
      {loading && <div className="text-center">Loading...</div>}
      {!hasMore && (
        <div className="text-center text-gray-800">
          No more articles to load.
        </div>
      )}
    </>
  );
};

export default MainFeed;
