export function getAccessToken() {
    const tokensString = localStorage.getItem('TIKTAKA');
    if (!tokensString){
      fetchAccessToken(); // 나중에 사라질 라인
      const tokensString = localStorage.getItem('TIKTAKA');
      return tokensString
    }
    return JSON.parse(tokensString)
}

export async function setAccessToken(tokens: Object){
    localStorage.removeItem('TIKTAKA');
    localStorage.setItem('TIKTAKA', JSON.stringify(tokens));
}

// 토큰을 가져오는 함수
export async function fetchAccessToken() {
    const apiUrl = "http://localhost:8000/user/api/token/";
    const credentials = {
      username: "admin",
      password: "rlarudals1!"
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const tokens = await response.json();
      await setAccessToken(tokens);
      console.log('Access token fetched and set:', tokens);
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  }
  
function getAccessTokenByRefresh(){
    
}