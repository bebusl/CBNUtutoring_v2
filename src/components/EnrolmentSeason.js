import Axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { UserData, IsLogin } from "../App";
import { toaster } from "evergreen-ui";

const EnrolmentSeason = (props) => {
  const { userData, setUserData } = useContext(UserData);
  const { loginStatus, setLoginStatus } = useContext(IsLogin);
  const [values, setValues] = useState({
    start: "",
    end: "",
    year: window.localStorage.getItem("year"),
    semester: window.localStorage.getItem("semester"),
  });

  const [setTime_start, settingStartTime] = useState(0);
  const [setTime_end, settingEndTime] = useState(0);

  useEffect(() => {
    Axios.get(`/api/systems/find/1/${values.year}/${values.semester}`)
      .then((res) => {
        if (res.data.result !== null) {
          settingEndTime(res.data.result.end);
          settingStartTime(res.data.result.start);
        } else if (
          res.data.success === false &&
          res.data.msg === "인증 실패!"
        ) {
          setLoginStatus(false);
          setUserData({});
          toaster.danger("다른 컴퓨터에서 로그인이 되어서 종료됩니다.");
          props.history.push("/login");
        }
      })
      .catch((error) => {console.log(error)});
  }, [values.year, values.semester]);

  useEffect(() => {
    Axios.get(`/api/systems/find/1/${values.year}/${values.semester}`)
      .then((res) => {
        if (res.data.result !== null) {
          settingEndTime(res.data.result.end);
          settingStartTime(res.data.result.start);
        } else if (res.data.success === false && res.data.msg === "인증 실패!") {
          setLoginStatus(false);
          setUserData({});
          toaster.danger("다른 컴퓨터에서 로그인이 되어서 종료됩니다.");
          props.history.push("/login");
        }
      })
      .catch((error) => console.log(error));
  }, [values.year, values.semester]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const toDate = (timestamp) => {
    const newDate = new Date(timestamp);
    return `${newDate.getFullYear()}년 ${
      newDate.getMonth() + 1
    }월 ${newDate.getDate()}일`;
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const start = new Date(values.start).getTime();
          const end = new Date(values.end).getTime();
          Axios.post("/api/systems/modify", {
            systemId: 1,
            year: values.year,
            semester: values.semester,
            start: start,
            end: end,
          }).then((res) => {
            if (res.data.success === false && res.data.msg === "인증 실패!") {
              setLoginStatus(false);
              setUserData({});
              toaster.danger("다른 컴퓨터에서 로그인이 되어서 종료됩니다.");
              props.history.push("/login");
            }

            toaster.success("기간 변경 성공");
            settingStartTime(start);
            settingEndTime(end);
          });
        }}
      >
        <div className="dateWrap">
          <div className="yearWrap">
            년도{" "}
            <select name="year" onChange={handleChange}>
              {props.years.map((year) => (
                <option value={year} key={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="semesterWrap">
            학기{" "}
            <select
              name="semester"
              value={values.semester}
              onChange={handleChange}
            >
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
        </div>
        <h5>수강신청 기간 설정</h5>
        <p>
          {values.year}년 {values.semester}학기 수강신청기간 :{" "}
          {toDate(setTime_start)} ~ {toDate(setTime_end)}
        </p>
        <input
          type="date"
          name="start"
          value={values.start}
          onChange={handleChange}
        ></input>
        ~
        <input
          type="date"
          name="end"
          value={values.end}
          onChange={handleChange}
        ></input>
        <button type="submit">기간 변경</button>
      </form>
    </>
  );
};

export default EnrolmentSeason;
