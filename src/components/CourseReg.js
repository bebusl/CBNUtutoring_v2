import React, { useState, useContext } from "react";
import { IsLogin, UserData } from "../App";
import { Redirect } from "react-router-dom";
import { toaster } from "evergreen-ui";
import axios from "axios";

function useForm({ initialValues, history }) {
  const [values, setValues] = useState(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const { loginStatus, setLoginStatus } = useContext(IsLogin);
  const { userData, setUserData } = useContext(UserData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleFileChange = (e) => {
    setValues({ ...values, ["file"]: e.target.files[0] });
  };

  const duplicateInspection = () => {}; //강좌 중복된거없나 검사.

  const handleSubmit = async (event) => {
    setSubmitting(true);
    event.preventDefault();
    const sendForm = new FormData();

    if (values.profile.length > 0) {
      setValues({
        ...values,
        ["profile"]: values.profile.replace("\n/g", "<br>"),
      });
    }
    for (const i in values) {
      if (i !== "file" && values[i].length < 1) {
        toaster.warning("필수 입력사항을 모두 작성해주세요");
        return;
      }
      sendForm.append(i, values[i]);
    }

    await axios({
      url: "/api/courses/register",
      method: "POST",
      data: sendForm,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        if (response.data.success === true) {
          toaster.success("강좌 등록을 성공했습니다.");
          history.push("/tutor/admin/coursemanage");
        } else if (
          response.data.success === false &&
          response.data.msg === "인증 실패!"
        ) {
          setLoginStatus(false);
          setUserData({});
          toaster.danger("다른 컴퓨터에서 로그인이 되어서 종료됩니다.");
          history.push("/login");
        } else {
          toaster.danger("강좌 등록을 실패했습니다.");
        }
      })
      .catch((error) => toaster.danger("에러가 발생했습니다." + error));
  };

  return {
    values,
    submitting,
    handleChange,
    handleSubmit,
    handleFileChange,
  };
}

export default function CourseReg({ years, history }) {
  const { handleChange, handleSubmit, handleFileChange, values } = useForm({
    initialValues: {
      year: window.localStorage.getItem("year"),
      semester: window.localStorage.getItem("semester"),
      department: "0",
      grade: "1",
      courseName: "",
      professorName: "",
      tutorName: "",
      tutorNumber: "",
      limit: 0,
      file: "",
      profile: "",
    },
    history,
  });

  return (
    <div>
      <form
        className="courseReg"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <ul>
          <li>
            <p className="red small-size">
              빨간색으로 표시되는 필드를 꼭 입력한 후 제출해주세요.(운영계획서는
              선택사항)
            </p>
          </li>
          <li>
            <label htmlFor="year">년도</label>
            <select name="year" value={values.year} onChange={handleChange}>
              {years.map((year) => (
                <option value={year} key={year}>
                  {year}
                </option>
              ))}
            </select>
          </li>
          <li>
            <label htmlFor="semester">학기</label>

            <select
              name="semester"
              value={values.semester}
              onChange={handleChange}
            >
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </li>
          <li>
            <label htmlFor="department">학과</label>
            <select name="department" onChange={handleChange}>
              <option value="0">컴퓨터공학과</option>
              <option value="1">소프트웨어학과</option>
              <option value="2">정보통신공학부</option>
              <option value="3">지능로봇공학과</option>
            </select>{" "}
          </li>
          <li>
            <label htmlFor="grade">학년</label>

            <select name="grade" onChange={handleChange}>
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
              <option value="4">4학년</option>
            </select>
          </li>
          <li className="align-flex-end">
            <label htmlFor="courseName">교과목명</label>

            <input
              type="text"
              name="courseName"
              onChange={handleChange}
              className={
                values.courseName.length < 1 ? "border-color-red" : null
              }
            ></input>
          </li>

          <li>
            <label htmlFor="professorName">담당교수</label>

            <input
              type="text"
              name="professorName"
              onChange={handleChange}
              className={
                values.professorName.length < 1 ? "border-color-red" : null
              }
            ></input>
          </li>
          <li>
            <label htmlFor="tutorName">튜터이름</label>

            <input
              type="text"
              name="tutorName"
              onChange={handleChange}
              className={
                values.tutorName.length < 1 ? "border-color-red" : null
              }
            ></input>
          </li>
          <li>
            <label htmlFor="tutorNumber">튜터학번</label>

            <input
              type="text"
              name="tutorNumber"
              onChange={handleChange}
              className={
                values.tutorNumber.length < 1 ? "border-color-red" : null
              }
            ></input>
          </li>
          <li>
            <label htmlFor="limit">최대인원</label>
            <input
              type="number"
              name="limit"
              onChange={handleChange}
              className={values.limit < 1 ? "border-color-red" : null}
            ></input>
          </li>
          <li>
            <label htmlFor="profile">튜터프로필</label>
            <textarea
              wrap="hard"
              id="profile"
              name="profile"
              rows="5"
              onChange={handleChange}
              className={values.profile.length < 1 ? "border-color-red" : null}
            ></textarea>
          </li>
          <li>
            <label htmlFor="file">운영계획서</label>

            <input
              type="file"
              name="file"
              accept=".pdf,.hwp"
              onChange={handleFileChange}
            />
          </li>
          <li>
            <button type="submit">등록</button>
          </li>
        </ul>
      </form>
    </div>
  );
}
