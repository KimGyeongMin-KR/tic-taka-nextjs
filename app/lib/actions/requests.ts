
const fetchUserResponse = async (apiUrl: string, method: string, headers: Headers) => {
    const response = await fetch(apiUrl, {method: method, headers: headers});
    return response
};

const uploadPost = async (apiUrl: string, method: string, headers: Headers) => {
    const response = await fetch(apiUrl, {method: method, headers: headers});
    const data = await response.json()
    const presigned_urls: string[] | [] = data.presigned_urls
    presigned_urls.map((url, idx) => {
        // imageToS3(url, file[idx])
    })
    return response
};

const imageToS3 = async (url: string, file: File) => {
    fetch(url, {
        method: 'PUT',
        body: file,
      })
    .then((response) => {
        if (!response.ok) {
        // HTTP 상태 코드가 200~299 사이가 아닌 경우 에러 처리
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // 응답 데이터를 JSON으로 파싱
    })
    .then((data) => {
        console.log(data)
    }) // 성공한 경우의 처리
    // .catch((error) => console.error(error)); // 실패한 경우의 처리
}

const deletePost = async (postId: number) => {

}


// {
//     "id": 10,
//     "author": {
//         "username": "admin1",
//         "profile_image": "/files/default.jpeg",
//         "is_active": true
//     },
//     "subject": "나나나나나나",
//     "content": "\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼\b키키킼",
//     "options": [
//         {
//             "id": 19,
//             "option": "asdfdf\n\nsdfasdf"
//         },
//         {
//             "id": 20,
//             "option": "salfkjas"
//         }
//     ],
//     "images": [
//         {
//             "id": 13,
//             "url": "images/2023-12-17/2-10-0"
//         },
//         {
//             "id": 14,
//             "url": "images/2023-12-17/2-10-1"
//         },
//         {
//             "id": 15,
//             "url": "images/2023-12-17/2-10-2"
//         }
//     ],
//     "presigned_urls": [
//         "https://tiktakamedia.s3.amazonaws.com/images/2023-12-17/2-10-0",
//         "https://tiktakamedia.s3.amazonaws.com/images/2023-12-17/2-10-1",
//         "https://tiktakamedia.s3.amazonaws.com/images/2023-12-17/2-10-2"
//     ]
// }