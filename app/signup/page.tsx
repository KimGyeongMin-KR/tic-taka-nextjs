'use client'
// Signup.tsx

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SignupData {
  username: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

const signupSchema = z.object({
  username: z.string().min(6).refine((value) => /^[a-zA-Z0-9]+$/.test(value), {
    message: '아이디는 영어와 숫자 조합 6자 이상이어야 합니다.',
  }),
  password: z
  .string()
  .min(8)
  .max(16)
  .refine(
    (value) =>
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(value),
    {
      message: '비밀번호는 영문, 숫자, 특수 문자를 포함하여 8자에서 16자 사이여야 합니다.',
    }
  ),
  confirmPassword: z.string(),
  phoneNumber: z.string().refine(
    (value) => /^[0-9]{10,11}$/g.test(value),
    {
      message: '올바른 휴대폰 번호를 입력해주세요.',
    }
  ),
  
});

const validateSignup = (data: SignupData): { success: boolean; errors: Record<string, string> } => {
  try {
    signupSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error: any) {
    const errors: Record<string, string> = {};
    error.errors.forEach((validationError: any) => {
      errors[validationError.path[0]] = validationError.message;
    });
    return { success: false, errors };
  }
};

const Signup = () => {
  const [signupData, setSignupData] = useState<SignupData>({
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { push } = useRouter();


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Check if password and confirmPassword match
    if (signupData.password !== signupData.confirmPassword) {
      setErrors({ confirmPassword: '비밀번호가 일치하지 않습니다.' });
    }

    const validationResult = validateSignup(signupData);
    setErrors(validationResult.errors);

    if (validationResult.success) {
      // 회원가입 로직 추가
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
  
      const response = await fetch(
        'http://localhost:8000/user/',
        {method: "POST", headers: headers, body: JSON.stringify({
          username: signupData.username,
          password: signupData.password,
          phone: signupData.phoneNumber
        })}
      );
      if(!response.ok){
        alert("잠시 후 다시 요청해 주세요")
        return false
      }
      push('/signin')
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">회원가입</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
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
                className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
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
                className={`appearance-none rounded relative block w-full px-3 py-2 border ${
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
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none rounded w-full px-3 py-2 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="비밀번호 확인"
                value={signupData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-500" id="confirmPassword-error">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="phoneNumber" className="sr-only">
                휴대폰 번호
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                required
                className={`appearance-none rounded w-full px-3 py-2 border ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="휴대폰 번호"
                value={signupData.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && (
                <p className="mt-2 text-sm text-red-500" id="phoneNumber-error">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
          </div>


          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-400 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              회원가입
            </button>
          </div>
          <div className='flex'>
          <Link href="/signin" className="ml-auto">
            이미 회원이신가요?
          </Link>  
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default Signup;
