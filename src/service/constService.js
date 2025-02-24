const rootUrl = process.env.REACT_APP_API;
const baseUrl = process.env.REACT_APP_API + "/api";


// Login
export const LOGIN_URL = baseUrl + "/auth/login";
export const LOGOUT_URL = baseUrl + "/auth/logout";
export const FORGET_PASSWORD_URL = baseUrl + "/auth/forget-password";
export const RESET_PASSWORD_URL = baseUrl + "/auth/confirm-reset";
export const  REGISTRATION_URL = baseUrl + "/users/register"

// Message
export const MESSAGE_URL = baseUrl + "/messages/send";
export const CHAT_LIST_URL = baseUrl + "/chats/list";
export const GROUP_CHAT_URL = baseUrl + "/chats";
export const CHAT_HISTORY_URL = baseUrl + "/messages/chat";
export const WEBSOCKET_URL = rootUrl+"/ws";

//User
export const USER_URL = baseUrl + "/users";
export const CURRENT_USER_URL = baseUrl + "/users/current-user"