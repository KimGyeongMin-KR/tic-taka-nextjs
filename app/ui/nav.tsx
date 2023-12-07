'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
    const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsLargeScreen(window.innerWidth >= 800);
      console.log('hihi', window.innerWidth, 'px')
    };

    // 초기화
    checkScreenWidth();

    // 리사이즈 이벤트에 대한 이벤트 리스너 등록
    window.addEventListener('resize', checkScreenWidth);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);
//   로그인 됐을 때{`/feed/${username}`}
//   로그인 안 됐을 때{'/signin'}
  return (
    <nav className={isLargeScreen ? "fixed left-0 bottom-0 h-full w-20 bg-black shadow-sm z-10" : "fixed bottom-0 w-full bg-black shadow-sm z-10"}>
      <ul className={isLargeScreen ? "flex flex-col justify-center items-center space-y-10" : "h-10 flex justify-center items-center space-x-5"}>
      <Link href={'/'}>
        <li className={isLargeScreen ? "text-white mt-10" : "text-white"}>Home</li>
      </Link>
      <Link href={'/?tranding=true'}>
        <li className="text-white">인기</li>
      </Link>
      <Link href={'/post'}>
        <li className="text-white">+</li>
      </Link>
      <Link href={'/feed/history'}>
        <li className="text-white">히스토리</li>
      </Link>
      <Link href={'/feed/you'}>
        <li className="text-white">프로필</li>
      </Link>
    </ul>
  </nav>
  );
};

export default Navbar;
