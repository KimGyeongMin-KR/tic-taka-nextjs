// ProfilePage.tsx
import Image from 'next/image';
import Link from 'next/link';

const ProfilePage = () => {
  return (
    <div className="container mx-auto mt-8">
      <div className="flex items-center">
        <div className="w-20 h-20 relative overflow-hidden rounded-full">
          <Image
            src="/profile-picture.jpg" // 프로필 이미지 경로로 변경
            alt="Profile Picture"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="ml-4">
          <h1 className="text-2xl font-bold">Your Name</h1>
          <p className="text-gray-500">Username</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-bold mb-4">My Posts</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* 각 포스트 아이템 */}
          <div className="relative overflow-hidden rounded-md">
            <Image
              src="/post-image1.jpg" // 포스트 이미지 경로로 변경
              alt="Post Image 1"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="relative overflow-hidden rounded-md">
            <Image
              src="/post-image2.jpg" // 포스트 이미지 경로로 변경
              alt="Post Image 2"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="relative overflow-hidden rounded-md">
            <Image
              src="/post-image3.jpg" // 포스트 이미지 경로로 변경
              alt="Post Image 3"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/edit-profile">
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
