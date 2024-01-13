"use client"

import React, { useState, useEffect } from 'react';
import FeedPost from '../ui/FeedPost';
import {FeedPostProps, PostFetchResult} from '@/app/lib/types/post';
import { getAccessToken, fetchAccessToken } from '../lib/actions/storage';



export default function Page() {
  const [posts, setPosts] = useState<FeedPostProps[]>([]);
  // const [page, setPage] = useState<number>(1); // 현재 페이지
  const [nextUrl, setNextUrl] = useState<string | null>('http://localhost:8000/post/'); // 현재 페이지

  useEffect(() => {
    // 초기 데이터 로딩
    fetchData()
    console.log('zizizizi')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행
  
  useEffect(() => {
    // 스크롤 이벤트 핸들러 등록
    window.addEventListener('scroll', handleScroll);
  
    // 이 컴포넌트가 언마운트될 때 이벤트 핸들러 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextUrl]); // nextUrl이 변경될 때마다 실행
  
  const handleScroll = () => {
    // 스크롤이 페이지의 아래에 도달하면 다음 페이지를 로딩
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      console.log('hhhhhhh')
      fetchData();
    }
  }
  

  const fetchData = async () => {
    fetchAccessToken()
    if(nextUrl === null){
      return null
    }
    try {
      const tokensString = localStorage.getItem('TIKTAKA');
      const tokens = tokensString ? JSON.parse(tokensString) : null
      const accessToken = tokens ? tokens.access : null
      // 요청 헤더 설정
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      if (accessToken){
        headers.append('Authorization', `Bearer ${accessToken}`);
      }
      // fetch 함수를 사용하여 데이터 가져오기
      // console.log(nextUrl, nextUrl)
      const response = await fetch(nextUrl, {method: "GET", headers: headers});
      
      // JSON으로 변환
      const data = await response.json();
      const postData = data.results;
      const next = data.next;
      setNextUrl(next)
      console.log(nextUrl, next, data.next, 'datadata')
      setPosts((prevPosts) => [...prevPosts, ...postData]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    // 태그라인
    <div className="grid grid-cols-1 gap-4">
      {posts.map(post => (
        <FeedPost key={post.id} {...post} />
      ))}
    </div>
  );
}
