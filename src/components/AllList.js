import React, { useState, useEffect, useContext } from "react";
import {IsLogin, UserData} from "../App";
import {toaster} from "evergreen-ui";

import Table from "./Table";
import axios from "axios";

const AllList = ({ years, isCourseManage = false ,history}) => {
  const [year, setYear] = useState(window.localStorage.getItem("year"));
  const [semester, setSemester] = useState(window.localStorage.getItem("semester"));
  const [datas, setDatas] = useState();
  const { loginStatus, setLoginStatus } = useContext(IsLogin);
  const { userData, setUserData} = useContext(UserData);
  const isAlllist = !isCourseManage;

  useEffect(() => {
    setYear(window.localStorage.getItem("year"));
    setSemester(window.localStorage.getItem("semester"));
    search();
  }, []);

  const yearChange = (e) => {
    if (e.target.name === "year") {
      setYear(e.target.value);
      window.localStorage.setItem("year",e.target.value);
    } else {
      setSemester(e.target.value);
      window.localStorage.setItem("semester",e.target.value);
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    window.localStorage.setItem("year", year);
    window.localStorage.setItem("semester", semester);
    search();

  };

  const search = () => {
    axios
      .get(`/api/courses/find/${year}/${semester}`)
      .then(function (response) {
        if(response.data.success ===false && response.data.msg === "인증 실패!"){
          setLoginStatus(false);
          setUserData({});
          toaster.danger("다른 컴퓨터에서 로그인이 되어서 종료됩니다.");
          history.push("/login")
        }
        else if (response.data.courseData !== datas) {
          setDatas(response.data.courseData);
        }
      })
      .catch((error) => {
        
      });
  };

  return (
    <div>
      <form onSubmit={handleOnSubmit}>
        <div className="dateWrap">
          <div className="yearWrap">
            년도{" "}
            <select name="year" value={year} onChange={yearChange}>
              {years.map((year) => (
                <option value={year} key={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="semesterWrap">
            학기{" "}
            <select name="semester" value={semester} onChange={yearChange}>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
          <button type="submit">검색</button>
        </div>
      </form>

      <Table
        datas={datas}
        isAllList={isAlllist}
        isCourseManage={isCourseManage}
        year={year}
        semester={semester}
      ></Table>
    </div>
  );
};

export default AllList;
