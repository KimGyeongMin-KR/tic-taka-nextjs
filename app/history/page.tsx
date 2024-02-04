"use client"

import Image from 'next/image';
import FeedPost from '@/app/ui/FeedPost';
import { useState, useEffect } from 'react';
import { getAccessToken } from '../lib/\bjwt';
import { FeedPostProps } from '../lib/types/post';
import {
  useRecoilValue,
} from 'recoil';
import { userState } from '../lib/atoms';

const ProfilePage = () => {
  const user = useRecoilValue(userState);

  const [posts, setPosts] = useState<FeedPostProps[]>([]);
  const [windowSize, setWindowSize] = useState((typeof window !== 'undefined' ? window.innerWidth : 0));
  
  // const [page, setPage] = useState<number>(1); // 현재 페이지
  const [nextUrl, setNextUrl] = useState<string | null>('http://server.tiikiik.com/post/?type=history');
  
  useEffect(() => {
    fetchData();
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };
    // 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);
    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
      fetchData();
    }
  }

  const fetchData = async () => {
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
    setPosts((prevPosts) => [...prevPosts, ...postData]);
  };

  return (
    <div className="container mx-auto mt-8">
      {posts.map(post => (
        <FeedPost key={post.id} {...post} windowSize={windowSize} />
      ))}
    </div>
  );
};

export default ProfilePage;
