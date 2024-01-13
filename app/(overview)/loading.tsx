'use client'
// Import the required dependencies
import { useState, useEffect } from 'react';
import { PostSkeleton } from '../ui/skeletons';

export default function Page() {
  // Use a function to get the initial window width
  const getWindowWidth = () => (typeof window !== 'undefined' ? window.innerWidth : 0);
  
  const [windowWidth, setWindowWidth] = useState(getWindowWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(getWindowWidth);
    };

    // Check if window is defined before adding event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);

      // Remove event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return (
    <div className={`${windowWidth > 800 ? 'w-100' : 'w-full'} mx-auto bg-white rounded-md shadow-md p-4 mb-4 mt-3`}>
      <PostSkeleton />
      <PostSkeleton />
    </div>
  );
}
