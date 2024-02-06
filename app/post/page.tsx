"use client"
import { useState, useEffect } from 'react';
import { createPost } from '@/app/lib/actions/post';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '../lib/\bjwt';

export default function Page(){
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [options, setOptions] = useState(['', '']); // 초기 옵션 하나 추가
  // const [images, setImages] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  type State = {
    errors?: {
      title?: string[];
      content?: string[];
      options?: string[];
      images?: string[];
      // Add other error types as needed
    };
    message?: string | null;
  };
  const initialState: State = { message: null, errors: {} };
  const [state, setFormState] = useState(initialState); // 초기 옵션 하나 추가
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    if(!token){
      router.push('/signin')
    }
  }, []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      // Perform other synchronous tasks if needed
    const formData = new FormData(e.currentTarget);
    // Dispatch the asynchronous action and wait for its completion
    const result: any = await createPost(initialState, formData);
    setFormState(result);
    // Now you can proceed based on the result or perform other tasks
    if(Object.keys(result.errors).length == 0){
      // api하고 이미지 없로드
      const tokensString = localStorage.getItem('TIKTAKA');
      const tokens = tokensString ? JSON.parse(tokensString) : null
      const accessToken = tokens ? tokens.access : null
      const apiUrl = "https://server.tiikiik.com/post/";
      const credentials = {
        subject: subject,
        content: content,
        options: options,
        image_len: images.length,
      };
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      if (accessToken){
        headers.append('Authorization', `Bearer ${accessToken}`);
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(credentials),
        });
        if (response.ok) {
          const responseBody = await response.json();
          const { presigned_urls } = responseBody;
      
          // PUT 요청을 보낼 함수 정의
          const sendPutRequest = async (url: string, file: File) => {
            await fetch(url, {
              method: 'PUT',
              body: file,
            });
          };
      
          // PUT 요청을 병렬로 보내기
          await Promise.all(
            presigned_urls.map((url: string, index: number) => sendPutRequest(url, images[index]))
          );
          router.push('/');
        } else {
          console.error('POST request failed');
        }
      }
    }
  };

  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    const nowOptions = [...options];
    if(nowOptions.length > 5){
        return
    }
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = [...options];
    if(newOptions.length < 3){
        return
    }
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const newImages: File[] = Array.from(fileList);
      // setImages([...images, ...newImages]);
      setImages(newImages);
    }
  };
  const handleImageOrderChange = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setImages(newImages);
  };
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
  useEffect(() => {
    // 이미지 미리보기 생성
    const newImagePreviews = images.map((image) => URL.createObjectURL(image));
    setImagePreviews(newImagePreviews);

    // 컴포넌트 언마운트 시 미리보기에 사용된 URL 해제
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);
  return (
    <div className='p-5'>
        {/* <form action={dispatch} className="mb-20 max-w-xl mx-auto mt-4"> */}
        <form onSubmit={handleSubmit} className="mb-20 max-w-xl mx-auto mt-4">
        <label className="block mb-4">
            Title:
            <input
            type="text"
            name='title'
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="block w-full mt-2 p-2 border rounded"
            />
        </label>
        <div aria-live="polite" aria-atomic="true">
          {state.errors?.title &&
            state.errors.title.map((error: string) => (
              <p className="mb-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
        <label className="block mb-4">
            내용:
            <textarea
            placeholder='tag with "#"'
            value={content}
            name='content'
            onChange={(e) => setContent(e.target.value)}
            className="block w-full mt-2 p-2 border rounded"
            />
            {state.errors?.content &&
            state.errors.content.map((error: string) => (
              <p className="mb-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </label>

        <label className="block mb-4">
            투표 항목:
            <div className="mt-2 space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="text"
                  value={option}
                  name="options"
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="mr-2 p-2 border rounded"
                  placeholder="옵션"
                />
                {
                  ![0, 1].includes(index) &&
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="bg-red-500 text-white p-2 rounded mr-2"
                  >
                    -
                  </button>
                }
                {state.errors?.options && (
                  <p className="mb-2 text-sm text-red-500">
                    {state.errors.options[index]}
                  </p>
                )}
              </div>
            ))}
            {
              options.length < 6 &&
              <button
                  type="button"
                  onClick={handleAddOption}
                  className="bg-green-500 text-white p-2 rounded"
              >
                  + 옵션
              </button>
            }
            
            </div>
        </label>
        <div className='flex flex-wrap'>
          {imagePreviews.map((preview, index) => (
            <div key={index} className='w-full sm:w-1/3 md:w-1/3 lg:w-1/4 p-2'>
              <div className='relative' style={{ height: '0', paddingBottom: '100%', overflow: 'hidden' }}>
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className='absolute inset-0 w-full h-full object-cover rounded'
                />
                {/* Delete button */}
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded"
                  onClick={() => handleRemoveImage(index)}
                >
                  X
                </button>
                {/* Move Up button */}
                {index !== 0 && (
                  <button
                    type="button"
                    className="absolute bottom-2 left-2 bg-indigo-400 text-white p-2 rounded"
                    onClick={() => handleImageOrderChange(index, index - 1)}
                    disabled={index === 0}
                  >
                    Up
                  </button>
                )}
                {/* Move Down button */}
                {index !== imagePreviews.length - 1 && (
                  <button
                    type="button"
                    className="absolute bottom-2 right-2 bg-yellow-400 text-white p-2 rounded"
                    onClick={() => handleImageOrderChange(index, index + 1)}
                    disabled={index === imagePreviews.length - 1}
                  >
                    Down
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* <div className='flex flex-wrap'>
        {imagePreviews.map((preview, index) => (
          <div key={index} className='w-full sm:w-1/3 md:w-1/3 lg:w-1/4 p-2'>
            <div className='relative'>
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className='w-full h-fit object-cover rounded'
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded"
                onClick={() => handleRemoveImage(index)}
              >
                X
              </button>
              {index != 0 &&
                <button
                  type="button"
                  className="absolute bottom-2 left-2 bg-indigo-400 text-white p-2 rounded"
                  onClick={() => handleImageOrderChange(index, index - 1)}
                  disabled={index === 0}
                >
                  Up
                </button>
              }
              
              { index != imagePreviews.length - 1 &&
                <button
                  type="button"
                  className="absolute bottom-2 right-2 bg-yellow-400 text-white p-2 rounded"
                  onClick={() => handleImageOrderChange(index, index + 1)}
                  disabled={index === imagePreviews.length - 1}
                >
                  Down
                </button>
              }
            </div>
          </div>
        ))}
      </div> */}
      <div>
        {state.errors?.images &&
              state.errors.images.map((error: string) => (
                <p className="mb-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
        ))}  
      </div>
      <div className=''>
        <label className="block mb-4">
          <div className="relative mt-2">
            <input
              type="file"
              name='images'
              multiple
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex items-center justify-center bg-gray-400 text-white p-2 rounded">
              <svg
                xmlns="https://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Upload Images
            </div>
          </div>
        </label>
      </div>
        {/* <button type="submit" className="bg-blue-500 text-white p-2 rounded" onClick={handleSubmit}> */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Submit
        </button>
      </form>
    </div>
  );
};

// export default YourFormComponent;
