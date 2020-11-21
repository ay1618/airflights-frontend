
export function isTokenExpired() {
    let exp = localStorage.exp;
    let expDate = new Date(exp * 1000 - 30 * 1000);
    
    return expDate < new Date();
}

export function logOut() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('exp');
}

export function getAccessToken() {
    return localStorage.getItem('accessToken');
}