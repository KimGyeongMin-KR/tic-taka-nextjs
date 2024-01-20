"use client"
import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { navHiddenState } from '../lib/atoms';
import "./style.css"

const CommentModal = ({ onClose }: { onClose: any}) => {
  const [loading, setLoading] = useState(false);
  const [navHidden, setNavHidden] = useRecoilState(navHiddenState); // Recoil 상태 사용
  const [comments, setComments] = useState([]); // Initial comments
  const [showReplies, setShowReplies] = useState([]); // Track which comment's replies are visible

  const fetchMoreComments = async () => {
    // 여기서 더 많은 댓글을 가져오고 댓글 상태를 업데이트합니다.
    // 가져오는 동안 loading을 true로 설정하고 가져오기가 완료되면 false로 설정합니다.
  };

  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      if (isAtBottom && !loading) {
        setLoading(true);
        fetchMoreComments().finally(() => setLoading(false));
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, fetchMoreComments]);

  useEffect(() => {
    // Assuming this effect is intended to run only once when the component mounts
    // Set initial state here
    setNavHidden(true);
  
    // Add overflow: hidden to the body
    document.body.style.overflow = 'hidden';
  
    // Cleanup function when the component unmounts
    return () => {
      // Reset the state when the component unmounts
      setNavHidden(false);
  
      // Remove overflow: hidden from the body
      document.body.style.overflow = 'visible';
    };
  }, []); // Empty dependency array ensures that the effect runs only once
  
  const windowSize = 800;

  const closeModal = () => {
    onClose();
  };

  return (
    <div className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 pt-10`}>
      <div className={`flex flex-col ${windowSize > 800 ? 'w-100' : 'w-full'} h-full mx-auto bg-white p-4 rounded-lg relative`}>
        {/* Close button at the top-right corner */}
        <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500">
          Close
        </button>

        {/* Title "댓글" at the top-left corner */}
        <h2 className="text-lg font-bold mb-4">댓글</h2>

        {/* Comment section in the middle */}
        <div className="overflow-y-auto flex-1">
          {comments.map((comment, index) => (
            <div key={index} className="mb-4">
              <p className="text-gray-700">{comment.text}</p>

              {/* Reply button if there are replies */}
              <button
                className="text-blue-500"
                onClick={() => setShowReplies(prevState => ({ ...prevState, [index]: !prevState[index] }))}
              >
                {showReplies[index] ? '대댓글 감추기' : `대댓글 보기 (${comment.replies.length})`}
              </button>

              {/* Replies go here (if visible) */}
              {showReplies[index] && (
                <div className="ml-4">
                  {comment.replies.map((reply, replyIndex) => (
                    <p key={replyIndex} className="text-gray-500">{reply.text}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Comment input at the bottom */}
        <div className="mt-4">
          <input type="text" placeholder="댓글을 입력하세요" className="w-full border p-2" />
          <button className="mt-2 bg-blue-500 text-white p-2 rounded">댓글 작성</button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
