'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { FaRegSquarePlus } from "react-icons/fa6";
import { GrHomeRounded } from "react-icons/gr";
import { LuHistory } from "react-icons/lu";
import { CgProfile } from "react-icons/cg"
import { IoSearch } from "react-icons/io5";

import clsx from 'clsx';


const links = [
  { name: "Home", href: '/', icon: GrHomeRounded, style: {fontSize: "1.4rem"}},
  { name: "Search", href: '/trending', icon: IoSearch, style: {fontSize: "1.5rem"}},
  { name: "Add", href: '/post', icon: FaRegSquarePlus, style: {fontSize: "1.4rem"}},
  { name: "History", href: '/feed/history', icon: LuHistory, style: {fontSize: "1.5rem"}},
  { name: "Profile", href: '/feed/you', icon: CgProfile, style: {fontSize: "1.4rem"}},
]


const Navbar = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const pathname = usePathname();

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

  return (
    <nav className={isLargeScreen ? "fixed left-0 bottom-0 h-full w-20 bg-gray-100 shadow-sm z-10" : `fixed bottom-0 w-full bg-gray-100 shadow-sm z-10`}>
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
                // 'text-fuchsia-700': pathname === link.href,
                'text-amber-500': pathname === link.href,
                // 'text-rose-500': pathname === link.href,
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

export default Navbar;;
