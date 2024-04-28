export interface Post {
    id: number;
    topic: string;
    title: string;
    content: string;
    likes: number;
    comments: {
        id: number;
        userId: string;
        content: string;
        likes: number;
        dislikes: number;
    }[];
}
export interface Interest {
    _id: string;
    interest_Name: string;
    interest_ID: number;
}

export interface Topic {
    _id: string;
    topic_Name: string;
    topic_Description: string;
    topic_Photo: string;
    interest_ID: number;
    created_at: string;
    topic_ID: number;
    __v?: number;
    followers: number;
}

