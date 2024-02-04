'use client'

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LoginData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    username: '',
    password: '',
  });
  const [rememberUsername, setRememberUsername] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      setLoginData((prevData) => ({ ...prevData, username: rememberedUsername }));
      setRememberUsername(true);
    }
  }, []);


  const handleRememberUsernameChange = () => {
    setRememberUsername((prevValue) => !prevValue);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 로그인 로직 추가
    console.log('로그인 성공!', loginData);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const response = await fetch(
      'http://server.tiikiik.com/user/api/token/',
      {method: "POST", headers: headers, body: JSON.stringify({
        username: loginData.username,
        password: loginData.password
      })}
    );
    if(!response.ok){
      alert("아이디, 비밀번호를 확인하세요")
      return false
    }
    const data = await response.json();
    const userInfo = localStorage.getItem('TIKTAKA');
    if (userInfo){
      localStorage.removeItem('TIKTAKA')
    }
    localStorage.setItem('TIKTAKA', JSON.stringify(data));

    if (rememberUsername) {
      localStorage.setItem('rememberedUsername', loginData.username);
    } else {
      // 기억하지 않을 경우 로컬 스토리지에서 제거
      localStorage.removeItem('rememberedUsername');
    }
    push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">로그인</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              아이디
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="mt-1 p-2 w-full border rounded-md"
              value={loginData.username}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 p-2 w-full border rounded-md"
              value={loginData.password}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={rememberUsername}
              onChange={handleRememberUsernameChange}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              아이디 기억하기
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              로그인
            </button>
          </div>
          <div className='flex'>
            <Link href='/signup' className='ml-auto'>
              아이디가 없으신가요
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
