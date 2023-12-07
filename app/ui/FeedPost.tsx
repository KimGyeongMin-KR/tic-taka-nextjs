'use client'
import React, { useState, useEffect } from 'react';

interface Author {
  username: string;
  profile_image: string;
  is_active: boolean;
}

interface Option {
  id: number;
  option: string;
}

interface FeedPostProps {
  id: number;
  author: Author;
  subject: string;
  content: string;
  options: Option[];
  like_count: number;
  voted_count: number;
  comment_count: number;
}

const FeedPost: React.FC<FeedPostProps> = ({
  id,
  author,
  subject,
  content,
  options,
  like_count,
  voted_count,
  comment_count,
}) => {
  const [results, setResults] = useState<{ id: number; count: number }[]>([]);
  const [votedOptionId, setVotedOptionId] = useState<number | null>(null);

  function handleOptionSelect(optionId: number) {
    const apiUrl = `http://127.0.0.1:8000/post/${id}/vote`;
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxNzc5ODc1LCJpYXQiOjE3MDE3Nzg2NzUsImp0aSI6IjQ0NzlkYWM3MmRlODQyM2M4ZDg3NDM0MmQ1YzFmOWY1IiwidXNlcl9pZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBob25lIjoiMDEwMTU1NTUifQ.p-TylZePeZQ3Bz_1TEy4kSCWkaaviDfqACpx7-wR4lc'; // 여기에 실제 토큰을 넣어주세요
  
    // 요청 헤더 설정
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${token}`);
  
    // 요청 바디 데이터 설정
    const body = JSON.stringify({ option_id: optionId });
  
    // POST 요청 보내기
    fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: body,
    })
      .then(response => response.json())
      .then(data => {
        // 요청이 성공하면 여기에서 data를 처리
        console.log('Vote result:', data);
      })
      .catch(error => {
        // 요청이 실패하면 여기에서 error를 처리
        console.error('Vote error:', error);
      });
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-md shadow-md p-4 mb-4">
      <div className="flex items-center mb-4">
        <img src={author.profile_image} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
        <p className="text-sm font-bold">{author.username}</p>
      </div>
      <p className="text-lg font-bold mb-2">{subject}</p>
      <p className="mb-4">{content}</p>
      <div className="flex flex-col space-y-2 mb-4">
        {options.map((option, index) => (
          <div key={option.id} className="flex items-center">
            <button 
            onClick={() => handleOptionSelect(option.id)}
            className="
            bg-yellow-300
            bg-gradient-to-r
            w-full rounded-md px-2 py-2 text-md font-semibold text-black shadow-sm
            hover:from-pink-500 hover:from-10% hover:to-yellow-500
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500
            ">
              {option.option}
            </button>
            <div>20.0%</div>
          </div>
        ))}
        {options.map((option, index) => {
          
          const optionResult = results.find((result) => result.id === option.id);
          const percentage = optionResult ? (optionResult.count / results.reduce((sum, r) => sum + r.count, 0)) * 100 : 0;
          
          return (
            <div key={option.id} className="flex items-center">
              <button
                className={`
                  ${gradient_bg} w-full rounded-md px-2 py-2 text-md font-semibold text-white shadow-sm
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500
                  hover:from-pink-500 hover:to-yellow-500 transition-all duration-300
                  ${votedOptionId === option.id ? 'bg-pink-500' : ''}
                `}
              >
                {option.option}
                {votedOptionId === option.id && (
                  <span className="ml-2">(Voted!)</span>
                )}
              </button>
              {results.length > 0 && (
                <div className="ml-4">
                  <div className="h-2 bg-gray-300 rounded-md overflow-hidden">
                    <div
                      style={{ width: `${percentage}%` }}
                      className={`h-full bg-indigo-500 transition-all duration-300`}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(2)}%</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div>
        <button className="
        flex-none rounded-md bg-gray-400 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500
        ">
          결과만 보기
        </button>
      </div>
      <div className="mt-4 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Likes: {like_count}</span>
          <span className="text-gray-500">Votes: {voted_count}</span>
          <span className="text-gray-500">Comments: {comment_count}</span>
        </div>
      </div>
    </div>
  );
};

export default FeedPost;

const gradient_bg = 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
