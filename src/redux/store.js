import { createStore } from "redux";
import reducer from "./reducer";

const store = createStore(reducer);//reducer 설정

export default store;
