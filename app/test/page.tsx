"use client"
import { useState } from 'react';
import CommentModal from '@/app/ui/Comment';

const YourComponent = () => {
  const [showCommentModal, setShowCommentModal] = useState(false);

  const openCommentModal = () => {
    setShowCommentModal(true);
  };

  const closeCommentModal = () => {
    setShowCommentModal(false);
  };

  return (
    <div>
      {/* 본문 컨텐츠 */}
      <button onClick={openCommentModal}>댓글 열기</button>
        <div>tt</div>
        <div>tt</div>
        <div>tt</div>
        <div>tt</div>
        <div>tt</div>
        <div>tt</div>
        <div>tt</div>
        <div>tt</div><div>tt</div>
        <div>tt</div>
        <div>tt</div>
        <div>tt</div><div>tt</div>
        <div>tt</div>
        <div>tt</div>
        <div>tt</div><div>tt</div>
        <div>tt</div>
        <div>tt</div>
        <div>tt</div><div>tt</div>
        <div>tt</div>
        <div>tt</div>
        <div>tt</div><div>tt</div>
        <div>tt</div>
        <div>tt</div>
        <div>tt</div><div>tt</div>
        <div>tt</div>
        <div>tt</div>
        <div>tt</div><div>tt</div>
        <div>tt</div>
        <div>tt</div>
        <div>tt</div><div>tt</div>
        <div>tt</div>
        <div>tt</div>
        <div>tt</div>
      {/* showCommentModal이 true일 때 CommentModal 렌더링 */}
      {showCommentModal && <CommentModal onClose={closeCommentModal} />}
    </div>
  );
};

export default YourComponent;
