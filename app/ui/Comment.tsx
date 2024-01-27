"use client"
import { useState, useEffect, useRef } from 'react';
import { navHiddenState } from '../lib/atoms';
import "./style.css"
import { CommentProps } from '../lib/types/post';
import { getAccessToken } from '../lib/\bjwt';
import {
  useRecoilState, useRecoilValue,
} from 'recoil';
import { userState, replyState, defaultReplyInfo } from '../lib/atoms';
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa6";
import { BiMessageCheck } from "react-icons/bi";
import { MdOutlineComment } from "react-icons/md";
import clsx from 'clsx';

const CommentModal = ({ onClose, windowSize, postId, optionIds }: {
  onClose: any,
  windowSize: number,
  postId: number,
  optionIds: number[]
}) => {
  const [navHidden, setNavHidden] = useRecoilState(navHiddenState); // Recoil 상태 사용
  const [showReplies, setShowReplies] = useState([]); // Track which comment's replies are visible
  const [reply, setReply] = useRecoilState(replyState);
  const inputRef = useRef(null);

  useEffect(() => {
    setNavHidden(true);
    document.body.style.overflow = 'hidden';
    return () => {
      setNavHidden(false);
      setReply(defaultReplyInfo);
      document.body.style.overflow = 'visible';
    };
  }, []); // Empty dependency array ensures that the effect runs only once
  
  useEffect(() => {
    if (reply.id) {
      inputRef.current && inputRef.current.focus();
    }
  }, [reply.id]);

  const cancleReply = () => {
    setReply(defaultReplyInfo);
  };

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
        <div>
            <div className="bg-gray-100 rounded flex items-center">
                {reply.id &&
                 <>
                 {reply.authorName}님에게의 답글..
                 <button className='text-rose-500' onClick={cancleReply}>(X)</button>
                 </>
                }
                
            </div>
            <div className='flex items-center'>
                <input
                ref={inputRef}
                type="text"
                required
                placeholder="댓글을 입력하세요"
                className="w-full border"
                />
                <button onClick={commentSubmit} className="bg-amber-500 text-white p-2 rounded">
                <BiMessageCheck/>
                </button>
            </div>
          
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
        username: 'John Doe1',
        profilePicture: 'https://example.com/profile.jpg',
      },
      parent_id: null,
      voted_option_id: 2,
      like_count: 10,
      hate_count: 0,
      child_count: 3,
      created_at: '2022-01-25 08:30:00',
      updated_at: null,
      like_hate_none: 1,
      optionIds: [1, 2, 3],
    },
    {
        id: 2,
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
      {
        id: 3,
        comment: 'This is the first comment.',
        post_id: 123,
        author: {
          id: 101,
          username: 'John Doe3',
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
      {
        id: 4,
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
      {
        id: 5,
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
      {
        id: 6,
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
      {
        id: 7,
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
      {
        id: 8,
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
      {
        id: 9,
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
  ];

const exampleReplys = [
    {
        id: 10,
        comment: 'This is the first comment.',
        post_id: 123,
        author: {
          id: 101,
          username: 'John Doe3',
          profilePicture: 'https://example.com/profile.jpg',
        },
        parent_id: 3,
        voted_option_id: 2,
        like_count: 10,
        hate_count: 2,
        child_count: 3,
        created_at: '2022-01-25 08:30:00',
        updated_at: null,
        like_hate_none: 1,
        optionIds: [1, 2, 3],
      },
      {
        id: 10,
        comment: 'This is the first comment.',
        post_id: 123,
        author: {
          id: 101,
          username: 'John Doe3',
          profilePicture: 'https://example.com/profile.jpg',
        },
        parent_id: 3,
        voted_option_id: 2,
        like_count: 10,
        hate_count: 2,
        child_count: 3,
        created_at: '2022-01-25 08:30:00',
        updated_at: null,
        like_hate_none: 1,
        optionIds: [1, 2, 3],
      },
      {
        id: 10,
        comment: 'This is the first comment.',
        post_id: 123,
        author: {
          id: 101,
          username: 'John Doe3',
          profilePicture: 'https://example.com/profile.jpg',
        },
        parent_id: 3,
        voted_option_id: 2,
        like_count: 10,
        hate_count: 2,
        child_count: 3,
        created_at: '2022-01-25 08:30:00',
        updated_at: null,
        like_hate_none: 1,
        optionIds: [1, 2, 3],
      },
]
  
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

const CommentReplies: React.FC<{ replies: CommentProps[] }> = ({ replies }) => {
    return (
      <div className="ml-6">
        {replies.map((reply, index) => (
          <Comment key={reply.id} {...reply} />
        ))}
      </div>
    );
  };

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
  const [commentReacted, setCommentReact] = useState(like_hate_none);
  const [reply, setReply] = useRecoilState(replyState);
  const user = useRecoilValue(userState);
  
  const [replys, setReplys] = useState<CommentProps[]>(exampleReplys);
  const [nextUrl, setNextUrl] = useState<string|null>(`http://localhost:8000/post/${post_id}/comment/${id}/replies`);
    // 숨겨져있으면 child카운트, 아니라면 childcount에서 현재 길이 빼기
  const handleLoadReplies = async () => {
    if(nextUrl === null){
        return
    }
    const response = await fetch(nextUrl);
    if (response.ok) {
      const data = await response.json();
      // 가져온 답글로 상태를 업데이트합니다
      setShowReplies(true);
    }
  };
  const hideReplys = () => {
    setShowReplies(false)
  }
  const getVotedOptionIndex = (votedOptionId: number | null, optionIds: number[]): number | null => {
    if (votedOptionId !== null) {
      const index = optionIds.indexOf(votedOptionId);
      return index !== -1 ? index + 1 : null;
    }
    return null;
  };
  
  const commentLike = async () => {
    const accessToken = await getAccessToken()
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if(!accessToken){
        window.location.href = '/signin';
    }else{
        headers.append('Authorization', `Bearer ${accessToken}`);
    }
    const body = {like_hate_none: 0}
    if(commentReacted !== 1){
        body.like_hate_none = 1
    }
    const response = await fetch(`http://localhost:8000/post/${post_id}/comment/${id}/like`, {method: "POST", headers: headers});
    if(!response.ok){
      return
    }
    const data = await response.json();
    setCommentReact(data.like_hate_none)
  };

  const commentHate = async () => {
    const accessToken = await getAccessToken()
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if(!accessToken){
        window.location.href = '/signin';
    }else{
        headers.append('Authorization', `Bearer ${accessToken}`);
    }
    const body = {like_hate_none: 0}
    if(commentReacted !== -1){
        body.like_hate_none = -1
    }
    const response = await fetch(`http://localhost:8000/post/${post_id}/comment/${id}/like`, {method: "POST", headers: headers});
    if(!response.ok){
      return
    }
    const data = await response.json();
    setCommentReact(data.like_hate_none)
  };
  const turnOnReply = () =>{
    const targetId = parent_id !== null ? parent_id : id;
    const targetComment = {
        id: targetId,
        comment: comment,
        authorName: author.username
    }
    setReply(targetComment);
  }
  
  const votedOptionIndex = getVotedOptionIndex(voted_option_id, optionIds);
  return (
    <div className="mb-2">
      {/* Author Info */}
      <div className="flex items-center mb-2">
        <img src={author.profile_image} alt="Author" className="w-8 h-8 rounded-full mr-2" />
        <span className="font-bold">{author.username}</span>
        { votedOptionIndex && 
            <span className='ml-1'>({votedOptionIndex}번 투표자)</span>
        }
        <span className="text-gray-500 ml-2">{created_at} {updated_at ? '(수정됨)' : ''}</span>
      </div>

      {/* Comment Content */}
      {/* 자세히와 요약 추가 */}
      <p className="text-gray-700">{comment}</p>

      <div className="flex mt-2">
        <div className='mr-4'>
            <button onClick={commentLike}>
                <FaRegThumbsUp 
                className={clsx(
                    {
                    'text-green-400': (commentReacted === 1),
                    'text-gray-400': (commentReacted !== 1),
                    },
                )}
                />
            </button>
            <span> {like_count !== 0 && (like_count)}</span>
        </div>
        <div className='mr-4'>
            <button className="text-red-500" onClick={commentHate}>
            <FaRegThumbsDown
                className={clsx(
                    {
                    'text-red-400': (commentReacted === -1),
                    'text-gray-400': (commentReacted !== -1),
                    },
                )}
                />
            </button>
            <span> {hate_count !== 0 && (hate_count)}</span>
        </div>
        <div>
            <button onClick={turnOnReply}>
                <MdOutlineComment
                    className={clsx(
                        {
                        'text-black-800': (reply.id === id),
                        'text-gray-400': (reply.id !== id),
                        },
                    )}
                />
            </button>
        </div>
      </div>
        {
            child_count && ( child_count - replys.length ) > 0 &&
            <div className='ml-4'>
                <button onClick={handleLoadReplies} className="text-blue-500">
                    답글 보기({child_count - replys.length})
                </button>
            </div>
            
        }
          {showReplies &&
        <button onClick={hideReplys} className="text-gray-500">
          답글 감추기
        </button>
        }

      {/* Replies Section */}
      {replys && parent_id === null && (
          <CommentReplies replies={replys}/>
      )}
    </div>
  );
};
