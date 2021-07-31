import axios from "axios";

const register = (values) => {
  return axios
    .post("/api/accounts/register", values)
};

const login = (_id, password) => {
  return axios.post("/api/accounts/" + "login", {
    _id,
    password,
  });
};

const logout = () => {
  return axios.get("/api/accounts/logout").then((res) => {
    window.localStorage.setItem("year", 2021);
    window.localStorage.setItem("semester", 1);
    return res;
  });
};

export default {
  register,
  login,
  logout,
};
