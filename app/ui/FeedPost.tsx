'use client'
import React, { useState, useEffect } from 'react';
import {OptionResult, VotedResult, FeedPostProps, ImageInfo} from "@/app/lib/types/post"
import { useRouter } from 'next/navigation';
import { FaRegEye, FaCheck, FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import { LuVote } from "react-icons/lu";
import { getAccessToken } from '../lib/actions/storage';

import Image from 'next/image';
import Slider from "@ant-design/react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './style.css'

import { userState } from '../lib/atoms';
import {
  useRecoilState, useRecoilValue,
} from 'recoil';


function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style}}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  console.log(className, style, onClick)
  return (
    <div
      className={`${className}`}
      style={{ ...style, marginLeft: '0.8rem'}}
      onClick={onClick}
    />
  );
}

export function SimpleSlider({ images }: { images: ImageInfo[] }) {
    var settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
    };
    const s3Url = "https://tiktakamedia.s3.ap-northeast-2.amazonaws.com/"
    return (
        <div className='mb-5'>
          <Slider {...settings} className='w-11/12 p-2'>
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


const PostOptionModal = ({ closeModal, postId } : {closeModal: any, postId: number}) => {
  // Add your logic for editing and deleting post here
  const [hidden, setHidden] = useState(false);
  const { push } = useRouter();
  
  async function deletePost(id:number) {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmed){
      return
    }
    const tokensString = localStorage.getItem('TIKTAKA');
      const tokens = tokensString ? JSON.parse(tokensString) : null
      const accessToken = tokens ? tokens.access : null
      // 요청 헤더 설정
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      if (accessToken){
        headers.append('Authorization', `Bearer ${accessToken}`);
        const apiUrl = `http://localhost:8000/post/${postId}/`  
        const response = await fetch(apiUrl, {
          method: 'DELETE',
          headers: headers,
        });
        alert("삭제 성공")
        setHidden(true)
        window.location.reload();
      }else{
        alert("잘못된 접근")
      }
  }

  return (
    <div className={`${hidden && 'hidden'} fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 modal`}>
      <div className="relative top-40  mx-auto shadow-xl rounded-md bg-white max-w-md">

          <div className="flex justify-between items-center bg-gray-400 text-white text-xl rounded-t-md px-4 py-2">
              <h3>Options</h3>
              <button onClick={closeModal}>X</button>
          </div>

          <div className="h-24 p-4 flex justify-between items-center">
            {/* <button className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition" onClick={closeModal}>수정</button> */}
            <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"  onClick={() => deletePost(postId)}>삭제</button>
          </div>
      </div>
  </div>
  );
};

  
  
  


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
  const user = useRecoilValue(userState);
  const [isModalOpen, setModalOpen] = useState(false);
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
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

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
      {/* <div>여기에 우측 끝에 '...' 표시와 함께 누를 시에 글 수정, 삭제 버튼이 있는 모달을 아래에서 위로 띄워줘</div> */}
      {/* Modal Trigger */}
      {author.username === user.username &&
        <div className="flex items-end justify-end">
        <button onClick={openModal} className="text-gray-500 cursor-pointer">
          ...
        </button>
      </div>
      }
      

      {/* Modal Content */}
      {isModalOpen && (
        <PostOptionModal
          closeModal={closeModal}
          postId={id}
          // Pass other necessary props to the modal component
        />
      )}
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
//  메인 로딩 스켈레톤
//  글 등록 ㅇ/수정/삭제  우측에 ... 표시하고 드롭다운 수정/삭제
//  최상단 해시태그 & 링크

//  로그인/회원가입/(카카오톡)

// 프로필
//  내 글 제목만(인스타 썸넬처럼)
//  회원탈퇴

//  히스토리 
  // 상단에 좋아요|투표 나눠보기

//  검색
  // 오늘 핫한 이슈들을 기본으로 깔아주고 제목 그림처럼 만들어서 보여주기 & 상단에 검색 바
  //  디테일로 들어가기 혹은 연관있는 게시글 연달아 보여주기?

//  댓글 창
  // 대댓
    // 하나의 모달을 위 더 띄운다?
    // 혹은 위로 덮어 씌우고 뒤로 가기?


// 백엔드
//  메인에는 내가 좋아하는 태그들 위주로 반환
    // 1주일내로 -> 1달 -> 1년 (offset)
    // 최근 -> 투표
    // 봤던 것 제외
    // 비로그인 트렌딩 쿼리
//  내 댓글 우선 반환
//  퍼미션 적용
//  검색



const CommentModal = ({ closeModal, windowWidth }) => {
  // Add your logic for editing and deleting post here

  return (
    <div className="fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 modal">
      <div className="absolute bottom-0 h-full mx-auto shadow-xl rounded-md bg-white max-w-md">

          <div className="flex justify-between items-center bg-green-500 text-white text-xl rounded-t-md px-4 py-2">
              <h3>Modal header</h3>
              <button onClick={closeModal}>x</button>
          </div>

          <div className="h-96 overflow-y-scroll p-4">
              <p>Scrollable modal body</p>
              <p>Scrollable modal body</p>
          </div>

      </div>
  </div>
  );
};