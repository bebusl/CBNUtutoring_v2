// EXAMPLE ***
// import { LOGIN, LOGOFF, UPDATE_USERDATA } from "./action";
// import { UPDATE_LIKEKEYWORD, UPDATE_HATEKEYWORD } from "./action";
//
// const reducer = (
//     state = { isLogin: false, userData: {}, likeKwd: [], hateKwd: [] },
//     action
// ) => {
//     switch (action.type) {
//         case LOGOFF:
//             return { ...state, isLogin: false, userData: {} };
//         case LOGIN:
//             return { ...state, isLogin: true, userData: action.userData };
//         case UPDATE_USERDATA:
//             return { ...state, userData: action.userData };
//         case UPDATE_LIKEKEYWORD:
//             return { ...state, likeKwd: action.keywords };
//         case UPDATE_HATEKEYWORD:
//             return { ...state, hateKwd: action.keywords };
//
//         default:
//             return state;
//     }
// };
//
// export default reducer;
