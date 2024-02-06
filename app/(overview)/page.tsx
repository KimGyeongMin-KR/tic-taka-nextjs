"use client"

import React, { useState, useEffect, useRef } from 'react';
import FeedPost from '../ui/FeedPost';
import {FeedPostProps, FeedTag} from '@/app/lib/types/post';
import { IoSearch } from "react-icons/io5";
import { HiCursorClick } from "react-icons/hi";
import { getAccessToken } from '../lib/\bjwt';

const tagUrl = "https://server.tiikiik.com/post/tag";

export default function Page() {
  const [posts, setPosts] = useState<FeedPostProps[]>([]);
  const [tags, setTags] = useState<FeedTag[]>([]);
  const [windowSize, setWindowSize] = useState((typeof window !== 'undefined' ? window.innerWidth : 0));
  const [searchQuery, setSearchQuery] = useState<string|null>('');
  
  // const [page, setPage] = useState<number>(1); // 현재 페이지
  const [nextUrl, setNextUrl] = useState<string | null>('https://server.tiikiik.com/post/'); // 현재 페이지
  
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

  const handleSearch = (searchQuery: string) => {
    const newNextUrl = `http://server.tiikiik.com/post/?search=${searchQuery}`;
    setNextUrl(newNextUrl);
    setPosts([]);
    setSearchQuery(searchQuery);
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

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
      <SearchForm onSearch={handleSearch}/>
      {/* 태그들 */}
      {tags && (
        <div className="mt-10 w-full p-4 border-b border-gray-300 overflow-y-scroll">
          <div className="flex flex-wrap justify-center items-center space-x-2">
      {tags.map((tag) => (
        <button
          key={tag.name}
          onClick={() => handleSearch(tag.name)}
          className="my-1 px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring focus:border-blue-300"
        >
          #{tag.name}
        </button>
      ))}
    </div>
        </div>
      )}



      {posts.map(post => (
        <FeedPost key={post.id} {...post} windowSize={windowSize} />
      ))}
      {nextUrl === null && <div className='text-gray-300 mb-4'>No More Posts..</div>}
    </div>
  );
}

const SearchForm: React.FC<{onSearch: (searchQuery: string) => void}> = ({ onSearch }) => {
  const searchRef = useRef<HTMLInputElement>(null);
  const handleSubmit = () => {
    // onSearch(search);
    onSearch(searchRef.current?.value || '');
  };

  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full bg-gray-100 shadow-sm z-20 bg-gray-100">
      <form className="flex items-center justify-center w-full">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative" style={{ width: "400px" }}>
          <IoSearch className="absolute left-2.5 top-1/3 text-gray-500" />
          <input
            ref={searchRef}
            type="text"
            id="search"
            className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            placeholder="Search"
            required
          />
          <button
            onClick={handleSubmit}
            type="button"
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 bg-amber-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-blue-300 text-white font-medium rounded-lg text-sm px-4 py-2"
          >
            <HiCursorClick />
          </button>
        </div>
      </form>
    </div>
  );
};
