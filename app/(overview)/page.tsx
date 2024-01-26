"use client"

import React, { useState, useEffect } from 'react';
import FeedPost from '../ui/FeedPost';
import {FeedPostProps, FeedTag} from '@/app/lib/types/post';
// import { getAccessToken, fetchAccessToken } from '../lib/actions/storage';
import { IoSearch } from "react-icons/io5";
import { HiCursorClick } from "react-icons/hi";
import Link from 'next/link';
import { getAccessToken } from '../lib/\bjwt';


const tagUrl = "http://localhost:8000/post/tag";

export default function Page() {
  const [posts, setPosts] = useState<FeedPostProps[]>([]);
  const [tags, setTags] = useState<FeedTag[]>([]);
  const [windowSize, setWindowSize] = useState((typeof window !== 'undefined' ? window.innerWidth : 0));
  
  // const [page, setPage] = useState<number>(1); // 현재 페이지
  const [nextUrl, setNextUrl] = useState<string | null>('http://localhost:8000/post/'); // 현재 페이지
  
  useEffect(() => {
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
    // 초기 데이터 로딩
    fetchData()
    const fetchTag = async () => {
      try {
        const response = await fetch(tagUrl, { method: "GET"});
  
        // JSON으로 변환
        const data = await response.json();
        setTags(data);
        console.log('console tags', data); // Assuming 'tags' is a property in the response data
  
        // Do something with the data if needed
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchTag();
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
    // 태그라인
    <div className="grid grid-cols-1 gap-4">
      <SearchForm />
      {/* 태그들 */}
      {tags && (
        <div className="mt-10 w-full p-4">
          <div className='mx-auto max-w-screen-xl flex justify-center items-center space-x-10'>
            {tags.map((tag) => (
              
              <div key={tag.name} className="px-2 py-1 mx-2 bg-gray-200 rounded-md">
                <Link href={`?search=${tag.name}`}>
                #{tag.name}
                </Link>
              </div>
            ))}
          </div>
          
        </div>
      )}


      {posts.map(post => (
        <FeedPost key={post.id} {...post} windowSize={windowSize} />
      ))}
    </div>
  );
}


// components/SearchForm.js
{/* <div className={`${windowSize > 800 ? 'w-100' : 'w-full'} mx-auto bg-white rounded-md shadow-md p-4 mb-4 mt-3`}> */}
const SearchForm = () => {
  const handleSubmit = () => {
    // e.preventDefault();
    // 여기에서 검색 로직을 추가하세요
    console.log('Perform search');
  };

  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full bg-gray-100 shadow-sm z-20 bg-gray-100">
      <form onSubmit={handleSubmit} className="flex items-center justify-center w-full">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative" style={{ width: "400px" }}>
          <IoSearch className="absolute left-2.5 top-1/3 text-gray-500" />
          <input
            type="text"
            id="search"
            className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            placeholder="Search"
            required
          />
          <button
            type="submit"
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 bg-amber-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-blue-300 text-white font-medium rounded-lg text-sm px-4 py-2"
          >
            <HiCursorClick />
          </button>
        </div>
      </form>
    </div>
  );
};
