'use client'// Signup.js

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import Link from 'next/link';

const signupSchema = z.object({
  username: z.string().min(6).refine((value) => /^[a-zA-Z0-9]+$/.test(value), {
    message: '아이디는 영어와 숫자 조합 6자 이상이어야 합니다.',
  }),
  password: z
    .string()
    .min(10)
    .refine(
      (value) =>
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(value),
      {
        message: '비밀번호는 아이디, 숫자, 특수 문자를 포함하여 10자 이상이어야 합니다.',
      }
    ),
});

const validateSignup = (data) => {
  try {
    signupSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.errors.forEach((validationError) => {
      errors[validationError.path[0]] = validationError.message;
    });
    return { success: false, errors };
  }
};

const Signup = () => {
  const [signupData, setSignupData] = useState({
    username: '',
    password: '',
  });
  const [rememberUsername, setRememberUsername] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      setSignupData((prevData) => ({ ...prevData, username: rememberedUsername }));
      setRememberUsername(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRememberUsernameChange = () => {
    setRememberUsername((prevValue) => !prevValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationResult = validateSignup(signupData);
    setErrors(validationResult.errors);

    if (validationResult.success) {
      // 회원가입 로직 추가
      console.log('회원가입 성공!', signupData);

      // 아이디 기억하기 설정이 되어있다면 localStorage에 저장
      if (rememberUsername) {
        localStorage.setItem('rememberedUsername', signupData.username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">회원가입</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                아이디
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="아이디"
                value={signupData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="mt-2 text-sm text-red-500" id="username-error">
                  {errors.username}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="비밀번호"
                value={signupData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-500" id="password-error">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-username"
                name="remember-username"
                type="checkbox"
                checked={rememberUsername}
                onChange={handleRememberUsernameChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-username" className="ml-2 block text-sm text-gray-900">
                아이디 기억하기
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              회원가입
            </button>
          </div>

        <Link
              key={'link.name'}
              href={'/signin'}
            >
                이미 회원이신가요
            </Link>
        </form>
      </div>
    </div>
  );
};

export default Signup;
