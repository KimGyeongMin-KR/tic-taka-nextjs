'use client'
import React, { useState, useEffect } from 'react';
import {OptionResult, VotedResult, FeedPostProps, ImageInfo} from "@/app/lib/types/post"
import { useRouter } from 'next/navigation';
import { FaRegEye, FaCheck, FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import { LuVote } from "react-icons/lu";
import { getAccessToken } from '../lib/actions/storage';
import './style.css'
import Image from 'next/image';
import Slider from "@ant-design/react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SimpleSlider({ images }: { images: ImageInfo[] }) {
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  const s3Url = "https://tiktakamedia.s3.ap-northeast-2.amazonaws.com/"
  console.log(images, 'images', typeof(images))
  return (
      // <Slider {...settings} className='w-11/12'>
      // {images.map((option, index) => {
      //   return (
      //     <div key={index} className='w-full sm:w-1/3 md:w-1/3 lg:w-1/4 p-2'>
      //     <div className='relative' style={{ paddingBottom: '100%', overflow: 'hidden' }}>
      //       <div className="absolute inset-0 flex items-center justify-center">
      //         <Image
      //           className='rounded-md'
      //           key={option.id}
      //           src={`${s3Url}${option.url}`}
      //           alt=''
      //           layout="fill"
      //           objectFit="cover"
      //         />
      //       </div>
      //     </div>
      //   </div>
      //   )
      // })}
      // </Slider>
      <div className='mb-5'>
        <Slider {...settings} className='w-11/12'>
        {images.map((option, index) => (
          <div key={index} className='w-full sm:w-1/3 md:w-1/3 lg:w-1/4 p-2'>
            <div className='relative' style={{ paddingTop: '100%', overflow: 'hidden' }}>
              <Image 
                key={option.id}
                src={`${s3Url}${option.url}`}
                alt=''
                layout="fill"
                objectFit="contain"
                onError={(e) => {
                }}
              />
            </div>
          </div>
        ))}
      </Slider>
      </div>
      

    
  );
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
  images,
  watched_count,
  is_voted,
  is_liked
}) => {
  const [votedResult, setResult] = useState<VotedResult>();
  const [isLiked, setIsLiked] = useState<boolean>(is_liked);
  const [isVoted, setIsVoted] = useState<boolean>(is_voted);
  const [likeCount, setLikeCount] = useState<number>(like_count);
  const [expanded, setExpanded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { push } = useRouter();
  const truncatedContent = content.slice(0, 100);
  const shouldShowMoreButton = content.length > 100;

  function handlePostLike(){
    const token = getAccessToken()
    const accessToken = token.access
    console.log(accessToken, token, 'accessToken')
    const apiUrl = `http://127.0.0.1:8000/post/${id}/like`;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${accessToken}`);

    fetch(apiUrl, {
      method: 'POST',
      headers: headers,
    })
      .then(response =>{
        if (!response.ok) {
          if (response.status == 401){
            push('/signin')
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(data, 'datata')
        if(isLiked){
          setIsLiked(!isLiked)
          setLikeCount(likeCount - 1)
        }else{
          setIsLiked(!isLiked)
          setLikeCount(likeCount + 1)
        }
        
      })
  }
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const handleToggleContent = () => {
    setExpanded(!expanded);
  };

  function handleOptionSelect(optionId: number, justView: boolean = false) {
    const apiUrl = `http://127.0.0.1:8000/post/${id}/vote`;
    const tokens = getAccessToken();
    const token = tokens.access;
    if(votedResult != undefined){
      if(votedResult.reRequest > 2){
        alert('너무 빨리 재요청하고 있어요!')
      }
    }
    // 요청 헤더 설정
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${token}`);
  
    // 요청 바디 데이터 설정
    const body = JSON.stringify({ option_id: optionId });
  
    // POST 요청 보내기
    fetch(apiUrl, justView ? {
      // headers: headers,
      headers: headers,
      method: 'GET',
    } : {
      method: 'POST',
      headers: headers,
      body: body,
    })
      .then(response =>{
        if (!response.ok) {
          if (response.status == 401){
            push('/signin')
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // 요청이 성공하면 여기에서 data를 처리
        console.log('Vote result:', data);
        const options = data.results
        const totalCount = options ? options.reduce((sum: number, r: OptionResult) => sum + r.count, 0) : 0;
        const updatedData: VotedResult = {
          ...data,
          totalCount,
        };
        data.totalCount = totalCount;
        if(votedResult != undefined){
          const now_time = new Date();
          if ((now_time.getTime() - votedResult.timestamp.getTime()) / 1000 < 1) {
            updatedData.reRequest = votedResult.reRequest + 1;
            updatedData.timestamp = votedResult.timestamp;
          } else {
            updatedData.timestamp = new Date();
            updatedData.reRequest = 0;
          }
        }else{
          updatedData.timestamp = new Date();
          updatedData.reRequest = 0;
        }

        if(updatedData.voted_option_id && isVoted == false){
          setIsVoted(true);
        }else if (updatedData.voted_option_id === null){
          setIsVoted(false);
        }
        setResult(updatedData);
      })
      .catch(error => {
        // 요청이 실패하면 여기에서 error를 처리
        console.error('Vote error:', error);
      });
  }

  return (
    <div className={`${windowWidth > 800 ? 'w-100' : 'w-full'} mx-auto bg-white rounded-md shadow-md p-4 mb-4 mt-3`}>
      <div className="flex items-center mb-4">
        <img src={author.profile_image} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
        <p className="text-sm font-bold">{author.username}</p>
      </div>
      <p className="text-lg font-bold mb-2">{subject}</p>
      <SimpleSlider images={images}/>
      <div>
      <p className="mb-4">{expanded ? content : truncatedContent}
      {shouldShowMoreButton && (
        <div>
          <button onClick={handleToggleContent} className="text-blue-400">
          {expanded ? '요약' : '자세히'}
        </button>
        </div>
        
      )}
      </p>
      
    </div>
      <div className="flex flex-col space-y-2 mb-4">
        {options.map((option, index) => {
          let optionResult
          let percentage
          let votedOptionId
          if (votedResult){
            optionResult = votedResult.results[index];
            percentage = optionResult.count / votedResult.totalCount * 100
            percentage = percentage ? percentage : 0
            votedOptionId = votedResult.voted_option_id;
          }else{
            optionResult = {id:null, count:0}
            percentage = 0;
            votedOptionId = null;
          }
          
          return (
            <div key={option.id} className="flex items-center">
              <span className="text-gray-500">
                {index + 1}
              </span>
              <button
                onClick={() => handleOptionSelect(option.id)}
                className={`
                  ml-2
                  bg-gray-300
                  w-full rounded-md px-2 py-2 shadow-sm relative overflow-hidden
                `}
              >
                <div
                  style={{ width: `${percentage}%` }}
                  className={`h-full rounded-md ${gradient_bg} shadow-sm transition-all duration-300 absolute top-0 left-0`}
                ></div>
                <span className="relative z-10">
                  {option.option}
                </span>
              </button>
              {options.length > 0 && (
                <div className="ml-4 w-10">
                  <div className='text-xs text-green-500'>
                    {votedOptionId === option.id && (
                    <div className='text-center'>
                      <FaCheck />
                    </div>
                  )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{votedResult == undefined ? "???" : percentage.toFixed(1)}%</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className='flex items-center'>
        <button 
            onClick={() => handleOptionSelect(id, true)}
            className="
              flex rounded-md bg-gray-400 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
           결과만 보기
        </button>
        <div className='ml-3 flex items-center space-x-4'>
          <div className="flex items-center text-gray-400">
          <LuVote style={{
              fontSize: '1.4rem',
            }}
            className={`${isVoted && 'text-green-500'}`}
          />
            <span className='ml-1'>
              {votedResult ? votedResult.totalCount : voted_count}
            </span>
          </div>
          <div className='text-gray-400 flex items-center'>
            <FaRegEye />
            <span className='ml-1'>
              {watched_count}
            </span>
          </div>
          
        </div>

      </div>
      <div className="mt-4 flex items-center space-x-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-gray-500">
            <button onClick={() => handlePostLike()}>
              {isLiked ? <FaHeart className={`text-2xl text-rose-400 animate`}/> : <FaRegHeart className='text-2xl'/>}
            </button>
            <span>{likeCount}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <FaRegComment className='text-2xl'/>
            <span>{comment_count}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPost;

const gradient_bg = 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'


// 프론트 
//  포스트 틀 유효성 체커
//  프리 사인 url이용 이미지 업로드
//  이미지 슬라이더
//  글 등록/수정/삭제  우측에 ... 표시하고 드롭다운 수정/삭제
//  해시태그 링크

//  로그인/회원가입/(카카오톡)

//  프로필
//    내글

//  히스토리

//  검색, 트렌드
//  태그 순위

//  댓글 창
//    대댓


// 백엔드
//  내 댓글 우선 반환
//  봤던 것 제외 쿼리
//  퍼미션 적용
//  비로그인 트렌딩 쿼리
//  검색