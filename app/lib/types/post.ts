export interface Author {
    username: string;
    profile_image: string;
    is_active: boolean;
  }
  
export interface Option {
    id: number;
    option: string;
  }
export interface ImageInfo {
    id: number;
    url: string;
  }
export interface OptionResult {
    id: number;
    count: number;
  }
  
export  interface VotedResult {
    totalCount: number;
    results: OptionResult[];
    voted_option_id: number | null;
    timestamp: Date;
    reRequest: number;
  }

export interface FeedPostProps {
    id: number;
    author: Author;
    subject: string;
    content: string;
    options: Option[];
    images: ImageInfo[];
    like_count: number;
    voted_count: number;
    comment_count: number;
    watched_count: number;
    is_voted: boolean;
    is_liked: boolean;
    windowSize: number;
  }

export interface FeedTag {
    name: string;
}


export interface CommentProps {
  id: number;
  comment: string;
  post_id: number;
  author: Author;
  parent_id: number|null;
  voted_option_id: number|null;
  like_count: number;
  hate_count: number;
  child_count: number|null;
  created_at: string;
  updated_at: string|null;
  like_hate_none: number;
  optionIds: number[];
}