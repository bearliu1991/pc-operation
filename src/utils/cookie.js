import Cookies from 'js-cookie' // expiers 单位：天

export function getCookie(token) {
  return Cookies.get(token)
}

export function setCookie(tokenName, token, date) {
  return Cookies.set(tokenName, token, { expires: date }) // , path: "/operationManage/" }
}

export function removeCookie(token) {
  return Cookies.remove(token) // , { path: "/operationManage/" }
}

export function getAuthCookie() {
  return Cookies.get('x-auth-token')
}