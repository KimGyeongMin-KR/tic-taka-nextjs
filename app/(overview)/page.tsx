import FeedPost from '@/app/ui/FeedPost';

export default function Page() {
  const posts = [
    {
        "id": 1,
        "author": {
            "username": "admin",
            "profile_image": "/files/default.jpeg",
            "is_active": true
        },
        "subject": "안녕?",
        "content": "케케케 #태그 #라능? 반가워 나는 김경민 #김경민 사건 ㄱ사고 미쳤다",
        "options": [
            {
                "id": 1,
                "option": "asdfdf\n\nsdfasdf"
            },
            {
                "id": 2,
                "option": "salfkjas"
            }
        ],
        "images": [],
        "like_count": 0,
        "voted_count": 1,
        "comment_count": 4
    },
    {
        "id": 2,
        "author": {
            "username": "admin",
            "profile_image": "/files/default.jpeg",
            "is_active": true
        },
        "subject": "안녕?",
        "content": "케케케 #태그 #라능? 반가워 나는 김경민 #김경민 사건 ㄱ사고 미쳤다",
        "options": [
            {
                "id": 3,
                "option": "asdfdf\n\nsdfasdf"
            },
            {
                "id": 4,
                "option": "salfkjas"
            }
        ],
        "images": [],
        "like_count": 0,
        "voted_count": 0,
        "comment_count": 0
    }
]

  return (
      <div className=" grid-cols-1 gap-4">
        {posts.map(post => (
          <FeedPost key={post.id} {...post} />
        ))}
      </div>
  );
};