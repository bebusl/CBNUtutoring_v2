import axios from "axios";

const courseInfo = (year, semester) => {
  return axios
    .get("/api/" + `courses/${year}/${semester}`)
};

const courseRegister = (sendForm) => {
  axios({
    url: "/api/" + "courses/register",
    method: "POST",
    data: sendForm,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .catch((error) => console.log("error : ", error.response));
};
const courseDelete = (id) => {
  return axios.get("/api/" + `courses/delete/${id}`);
};

const registrationInfo = () => {
  return axios
    .get("/api/" + "registration")
    .catch((error) => console.log("등록한 코스 정보 확인 에러 ", error));
};

const cancleRegCourse = (id) => {
  return axios.get("/api/" + `registration/delete/${id}`);
};

const regCourse = (id) => {
  return axios.post("/api/" + `registration/register`, { courseId: id });
};

const courseModify = (data) => {
  return axios({
    url: "/api/courses/modify",
    method: "POST",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const reportUpload = (sendForm) => {
  return axios({
    url: "/api/reports/upload",
    method: "POST",
    data: sendForm,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const reportModify = (sendForm) => {
  return axios({
    url: "/api/reports/modify",
    method: "POST",
    data: sendForm,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getReports = () => {
  axios
    .get("/api/" + "/reports/")
    .catch((error) => console.log("레포트확인 에러 ", error));
};

export default {
  courseInfo,
  courseRegister,
  courseDelete,
  registrationInfo,
  cancleRegCourse,
  regCourse,
  reportUpload,
  reportModify,
  getReports,
  courseModify,
};
