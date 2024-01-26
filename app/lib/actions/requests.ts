
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
