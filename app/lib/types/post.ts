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
  
export interface PostFetchResult {
  results: FeedPostProps[];
  next: string;
}

export interface FeedPostProps {
    id: number;
    author: Author;
    subject: string;
    content: string;
    options: Option[];
    images: Image[];
    like_count: number;
    voted_count: number;
    comment_count: number;
    watched_count: number;
    is_voted: boolean;
    is_liked: boolean;
  }