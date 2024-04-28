import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import createAPIInstance from "../../utils/apiService";
import ArticleComponent from "../HomePage/ArticleComponent";
import { Article } from "../Modules/type";

interface TopicFeedProps {
  onSelectPage: (page: string) => void;
  selectedArticleId: number | null;
}

const TopicFeed: React.FC<TopicFeedProps> = ({
  onSelectPage,
  selectedArticleId,
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

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
      if (!hasMore || selectedArticleId === null) return;
      setLoading(true);
      try {
        const response = await createAPIInstance(token).get(
          `/api/articles/topics/${selectedArticleId}?page=${page}`
        );
        setArticles((prevArticles) => [...prevArticles, ...response.data.docs]);
        setHasMore(response.data.hasNextPage);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
      setLoading(false);
    };

    fetchArticles();
  }, [page, token, selectedArticleId]);

  const handleClick = () => {
    setIsFollowing(!isFollowing);
  };

  // Simulated user data, replace with actual user data retrieval logic
  const user = {
    _id: "123",
    name: "John Doe", // Example name
    img: "", // Example image URL
  };

  const iconImage = "https://example.com/path/to/your/icon-image.jpg"; // Replace with your actual image URL

  return (
    <>
      <div className="relative mb-8">
        <div className="container">
          <div
            className="p-10 rounded-xl shadow-lg bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://wallpaperaccess.com/full/2054934.png')`,
              opacity: 0.8,
            }}
          />
        </div>
        <div className="relative flex -top-8 left-4">
          <div className="flex flex-1 items-end">
            <div className="border-4 left-8 w-30 h-30 rounded-full overflow-hidden bg-gray-700">
              <img
                className="w-full h-full object-cover"
                src={iconImage}
                alt="Your Image"
              />
            </div>
            <div className="mb-2 gap-2">
              <div className="text-3xl bg-transparent text-gray-950">
                Technology
              </div>
              <div className="border-2 rounded-xl border-gray-950 text-l bg-transparent text-gray-950 text-center">
                270 Followers
              </div>
            </div>
            <div className="flex">
              <div>
                <button
                  className={`right-3 top-10 absolute border border-blue-400 bg-slate-950 text-white hover:bg-zinc-950 px-4 py-2 rounded-lg transition-colors ${
                    isFollowing ? "bg-green-500" : ""
                  }`}
                  onClick={handleClick}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
              <div>
                <div className="absolute right-3 dropdown dropdown-left dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn px-6 py-1 m-1 text-white"
                  >
                    Sort
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32 text-white"
                  >
                    <li>
                      <a>Popularity</a>
                    </li>
                    <li>
                      <a>Latest</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {articles.map((article, index) => (
        <div
          key={article._id}
          ref={index === articles.length - 1 ? lastArticleElementRef : null}
          className="rounded-xl shadow-md"
        >
          <ArticleComponent
            article={article}
            user={user}
            apiBaseUrl="http://localhost:3000/api"
            loginClickCallback={() => {}}
            commentAuthorClickCallback={() => {}}
            currentUserClickCallback={() => {}}
            onSelectPage={onSelectPage}
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

export default TopicFeed;
