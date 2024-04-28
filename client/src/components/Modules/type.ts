export interface Article {
    _id: string;
    user_ID: number;
    article_Content: string;
    article_Title: string;
    likes: string[];
    likes_count: number;
    comments_count: number;
    created_at: Date | string;  // Use Date or string depending on how to handle date values in your application.
    topic_ID: number;
    topic_Name: string;
    article_id: string;
    __v: number;
}
