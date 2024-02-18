'use client'
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { FaRegSquarePlus } from "react-icons/fa6";
import { GrHomeRounded } from "react-icons/gr";
import { LuHistory } from "react-icons/lu";
import { CgProfile } from "react-icons/cg"
import { IoSearch } from "react-icons/io5";
import { BsPatchCheck } from "react-icons/bs";

import clsx from 'clsx';

import { useRecoilState } from 'recoil';
import { navHiddenState } from '../lib/atoms';


const links = [
  { name: "Home", href: '/', icon: GrHomeRounded, style: {fontSize: "1.4rem"}},
  // { name: "Search", href: '/trending', icon: IoSearch, style: {fontSize: "1.5rem"}},
  { name: "Official", href: '/official', icon: BsPatchCheck, style: {fontSize: "1.5rem", fontWeight: 700}},
  { name: "Add", href: '/post', icon: FaRegSquarePlus, style: {fontSize: "1.4rem"}},
  { name: "History", href: '/history', icon: LuHistory, style: {fontSize: "1.5rem"}},
  { name: "Profile", href: '/profile', icon: CgProfile, style: {fontSize: "1.4rem"}},
]
const Navbar = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [navHidden, setNavHidden] = useRecoilState(navHiddenState); // Recoil 상태 사용
  const pathname = usePathname();
  let prevScrollY = useRef(0);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsLargeScreen(window.innerWidth >= 800);
    };

    window.addEventListener('resize', checkScreenWidth);

    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  useEffect(() => {
    setIsLargeScreen(window.innerWidth >= 800);
  }, []);

  
useEffect(() => {

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    // Compare current scroll position with previous scroll position
    if (currentScrollY > prevScrollY.current) {
      // Scrolling down
      if(!isLargeScreen){
        setNavHidden(true);
      }
    } else {
      // Scrolling up
      setNavHidden(false);
    }

    // Update previous scroll position
    prevScrollY.current = currentScrollY;
  };

  window.addEventListener('scroll', handleScroll);

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, [setNavHidden, isLargeScreen]);

  return (
    <nav
      className={clsx(
        isLargeScreen ? "fixed left-0 bottom-0 h-full w-20 bg-gray-100 shadow-sm z-30" : "fixed bottom-0 w-full bg-gray-100 shadow-sm z-10",
        {
          'hidden': navHidden, // Recoil 상태에 따라 숨김 처리
          'animate-fadeOut': navHidden, // 애니메이션 적용
        }
      )}
    >
      <ul className={isLargeScreen ? "flex flex-col justify-center items-center space-y-20" : "h-10 flex justify-center items-center space-x-10"}>
        {links.map((link, idx) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                {
                  'mt-10': (idx === 0 && isLargeScreen),
                  'text-amber-500': pathname === link.href,
                },
              )}
              style={link.style}
            >
              <LinkIcon />
            </Link>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
