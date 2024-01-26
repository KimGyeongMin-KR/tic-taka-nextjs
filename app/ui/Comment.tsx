"use client"
import { useState, useEffect, useRef } from 'react';
import { navHiddenState } from '../lib/atoms';
import "./style.css"
import { CommentProps } from '../lib/types/post';
import { getAccessToken } from '../lib/\bjwt';
import {
  useRecoilState, useRecoilValue,
} from 'recoil';
import { userState } from '../lib/atoms';

const CommentModal = ({ onClose, windowSize, postId, optionIds }: {
  onClose: any,
  windowSize: number,
  postId: number,
  optionIds: number[]
}) => {
  const [navHidden, setNavHidden] = useRecoilState(navHiddenState); // Recoil 상태 사용
  const [showReplies, setShowReplies] = useState([]); // Track which comment's replies are visible
  
  useEffect(() => {
    setNavHidden(true);
    document.body.style.overflow = 'hidden';
    return () => {
      setNavHidden(false);
      document.body.style.overflow = 'visible';
    };
  }, []); // Empty dependency array ensures that the effect runs only once
  
  const closeModal = () => {
    onClose();
  };
  const commentSubmit = () => {
    console.log(postId, 'hi')
  }
  return (
    <div className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 pt-20 z-20`}>
      <div className={`flex flex-col ${windowSize > 800 ? 'w-100' : 'w-full'} h-full mx-auto bg-white p-4 rounded-lg relative`}>
        {/* Close button at the top-right corner */}
        <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500">
          Close
        </button>

        {/* Title "댓글" at the top-left corner */}
        <h2 className="text-lg font-bold mb-4">댓글</h2>

        {/* Comment section in the middle */}
        {/* <div className="overflow-y-auto flex-1"> */}
          <CommentArea postId={postId} optionIds={optionIds}/>
          
        {/* </div> */}

        {/* Comment input at the bottom */}
        <div className="mt-4">
          <input type="text" required placeholder="댓글을 입력하세요" className="w-full border p-2" />
          <button onClick={commentSubmit} className="mt-2 bg-blue-500 text-white p-2 rounded">댓글 작성</button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;

const exampleComments = [
    {
      id: 1,
      comment: 'This is the first comment.',
      post_id: 123,
      author: {
        id: 101,
        username: 'John Doe',
        profilePicture: 'https://example.com/profile.jpg',
      },
      parent_id: null,
      voted_option_id: 2,
      like_count: 10,
      hate_count: 2,
      child_count: 3,
      created_at: '2022-01-25 08:30:00',
      updated_at: null,
      like_hate_none: 1,
      optionIds: [1, 2, 3],
    },
    // ... Add more comment objects similarly
  ];
  
const CommentArea = ({ postId, optionIds }: { postId : number, optionIds: number[] }) => {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<CommentProps[]>([]); // Initial comments
  const containerRef = useRef<HTMLDivElement>(null);
  const [nextUrl, setNextUrl] = useState<string|null>(`http://127.0.0.1:8000/post/${postId}/comment`);
  
  useEffect(() => {
    // 초기 데이터 로딩
    fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행
  const fetchComments = async () => {
    if(nextUrl === null){
      return null
    }
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const accessToken = await getAccessToken()
    if(accessToken === false){
      const isConfirm = confirm("로그인이 만료 됐습니다. 로그인 화면으로 가시겠습니까?")
      if(isConfirm){
        window.location.href = '/signin';
        return
      }else{
        localStorage.removeItem("TIKTAKA")
      }
    }
    if (accessToken){
      headers.append('Authorization', `Bearer ${accessToken}`);
    }
    const response = await fetch(nextUrl, {method: "GET", headers: headers});
    if(!response.ok){
      return
    }
    // JSON으로 변환
    const data = await response.json();
    const postData = data.results;
    const next = data.next;
    setNextUrl(next)
    setComments((prevComments) => [...prevComments, ...postData]);
  };
  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      // 현재 스크롤 위치
      const currentScroll = container.scrollTop;
      // 스크롤 가능한 전체 높이
      const totalHeight = container.scrollHeight;
      // 컨테이너의 높이
      const containerHeight = container.clientHeight;

      // 스크롤이 맨 아래에 있는지 여부 확인
      const isAtBottom = currentScroll + containerHeight >= totalHeight;

      if (isAtBottom && !loading) {
        setLoading(true);
        fetchComments().finally(() => setLoading(false));
      }
    }
  };
  return (
    <div ref={containerRef} className='overflow-y-auto flex-1' onScroll={handleScroll}>
      {/* {comments.map((comment, index) => (
          <Comment key={comment.id} {...comment} optionIds={optionIds}/>
      ))} */}
      {exampleComments.map((comment, index) => (
          <Comment key={comment.id} {...comment}/>
      ))}
    </div>
    
  )
}

// CommentProps      />
const Comment: React.FC<CommentProps> = ({
  id,  // for children url
  author, // img, name
  comment,
  post_id,  // for url
  parent_id, // for reply
  voted_option_id, 
  like_count,
  hate_count,
  child_count,  // for reply
  created_at,
  updated_at,
  like_hate_none,  // for using user
  optionIds,  // for show idx
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const user = useRecoilValue(userState);
  const dateObject = new Date(created_at);
  
  // const option = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  // const formatter = new Intl.DateTimeFormat('ko', option);
  // console.log(formatter.format(dateObject)); // "Monday, March 7, 2023"
  const handleLoadReplies = () => {
    setShowReplies(true)
    console.log(parent_id, 'parent_id')
    // Logic to load child comments when the button is clicked
    // You may want to fetch additional comments from the server
    // and update the UI with the new comments
  };
  const getVotedOptionIndex = (votedOptionId: number | null, optionIds: number[]): number | null => {
    if (votedOptionId !== null) {
      const index = optionIds.indexOf(votedOptionId);
      return index !== -1 ? index + 1 : null;
    }
    return null;
  };
  
  // Example Usage
  
  const votedOptionIndex = getVotedOptionIndex(voted_option_id, optionIds);
  return (
    <div className="mb-4">
      {/* Author Info */}
      <div className="flex items-center mb-2">
        <img src={author.profile_image} alt="Author" className="w-8 h-8 rounded-full mr-2" />
        { votedOptionIndex && 
            <span>{votedOptionIndex} 투표</span>
        }
        <span className="font-bold">{author.username}</span>
        <span className="text-gray-500 ml-2">{created_at} {updated_at ? '(수정됨)' : ''}</span>
      </div>

      {/* Comment Content */}
      <p className="text-gray-700">{comment}</p>

      {/* 카운트 0아닐 때만 보여주기 */}
      <div className="flex mt-2">
        <button className="text-blue-500 mr-4">
          {like_hate_none === 1 ? '좋아요 색있는 버튼' : '좋아요'} ({like_count})
        </button>
        <button className="text-red-500 mr-4">
          {like_hate_none === -1 ? '싫어요 취소' : '싫어요'} ({hate_count})
        </button>
        <button onClick={handleLoadReplies} className="text-gray-500">
          {showReplies ? '답글 감추기' : `답글 보기 (${child_count || 0})`}
        </button>
      </div>

      {/* Replies Section */}
      {showReplies && (
        <div className="ml-4 border-l-2 pl-2">
          {/* Display replies here */}
          {/* You can map through replies and render each reply similarly */}
        </div>
      )}
    </div>
  );
};
