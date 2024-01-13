import { FaRegHeart, FaRegComment } from "react-icons/fa";


const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function PostSkeleton(){

    return (

    <div className={`${shimmer} relative w-full overflow-hidden md:col-span-4`}>
    <div className="rounded-xl bg-gray-100 p-4">
    
    <div className="flex items-center mb-4">
      <img src='files/default.jpeg' alt="Profile" className="w-8 h-8 rounded-full mr-2" />
    </div>
      <div className="mt-0 mb-4 grid h-[410px] grid-cols-12 items-end gap-2 rounded-md bg-white p-4 sm:grid-cols-13 md:gap-4" />
      <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center">
            <span className="text-gray-500">
            </span>
            <button
              className={`
                ml-2
                bg-gray-300
                w-full rounded-md px-2 py-2 shadow-sm relative overflow-hidden
              `}
            >
              <span className="relative z-10">
              </span>
            </button>
              <div className="ml-4 w-10">
                <p className="text-xs text-gray-500 mt-1">???%</p>
              </div>
          </div>
    </div>
    <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center">
            <span className="text-gray-500">
            </span>
            <button
              className={`
                ml-2
                bg-gray-300
                w-full rounded-md px-2 py-2 shadow-sm relative overflow-hidden
              `}
            >
              <span className="relative z-10">
              </span>
            </button>
              <div className="ml-4 w-10">
                <p className="text-xs text-gray-500 mt-1">???%</p>
              </div>
          </div>
    </div>
    
    <div className="mt-4 flex items-center space-x-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1 text-gray-500">
          <FaRegHeart className={`text-2xl`}/>
        </div>
        <div className="flex items-center space-x-1 text-gray-500">
          <FaRegComment className='text-2xl'/>
        </div>
      </div>
    </div>
    </div>
    </div>
    
    )
}
