const currentTimestamp = () => {
  return Math.floor(Date.now() / 1000);
}

export async function getAccessToken() {
  const tokenString = localStorage.getItem('TIKTAKA');
  if (!tokenString){
    return undefined
  }
  const tokenObject = JSON.parse(tokenString);
  const isValidToken = validateJWTExp(tokenObject.access);
  if (!isValidToken){
    const refreshHeaders = new Headers();
    refreshHeaders.append('Content-Type', 'application/json');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/api/token/refresh/`,
      {method: "POST", headers: refreshHeaders, body: JSON.stringify({refresh: tokenObject.refresh})}
    );
    if(!response.ok){
      return false
    }
    const responseData = await response.json();
    updateAccessToken(responseData.access);
    return responseData.access;
  }
  return tokenObject.access;
}

function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(atob(base64));
}

export const validateJWTExp = (token: string) => {
  const currentStamp = currentTimestamp();
  const tokenData = parseJwt(token)
  console.log(tokenData.exp > currentStamp, 'tokenData.exp > currentStamp')
  return tokenData.exp > currentStamp
}

const updateAccessToken = (accessToken: string) => {
  const tokensString = localStorage.getItem('TIKTAKA');
  const tokens = tokensString ? JSON.parse(tokensString) : {};
  tokens.access = accessToken;
  localStorage.removeItem('TIKTAKA');
  localStorage.setItem('TIKTAKA', JSON.stringify(tokens));
}

