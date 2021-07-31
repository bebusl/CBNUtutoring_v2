/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useState } from "react";
import { UserData, IsLogin } from "../App";

import { toaster, Dialog } from "evergreen-ui";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Axios from "axios";

const department = ["컴퓨터공학과", "소프트웨어학과", "정보통신학과", "로봇"];

function AttendeeAdmin({ location, history, match }) {
  const courseId = match.params.courseId;
  const data = location.state.data;
  const [infos, setInfo] = useState([]);
  const [isShown, setIsShown] = useState(false);
  const { loginStatus, setLoginStatus } = useContext(IsLogin);
  const { userData, setUserData } = useContext(UserData);
  const [studentInfo, setStudentInfo] = useState({
    _id: "",
    department: 0,
    name: "",
    id: "",
  });

  useEffect(() => {
    Axios.post("/api/registration/get", { courseId: courseId })
      .then((res) => {
        if (res.data.success === false && res.data.msg === "인증 실패!") {
          setLoginStatus(false);
          setUserData({});
          toaster.danger("다른 컴퓨터에서 로그인이 되어서 종료됩니다.");
          history.push("/login");
        } else if (infos !== res.data.result) {
          setInfo(res.data.result);
        }
      })
      .catch((err) => console.log("에러" + err));
  }, []);
  return (
    <>
      <Dialog
        isShown={isShown}
        title="수강생 삭제"
        onCloseComplete={() => {
          Axios.post("/api/registration/attendeedel", {
            courseId: courseId,
            accountId: studentInfo.id,
          })
            .then((res) => {
              if (res.data.success === false && res.data.msg === "인증 실패!") {
                setLoginStatus(false);
                setUserData({});
                toaster.danger("다른 컴퓨터에서 로그인이 되어서 종료됩니다.");
                history.push("/login");
              } else if (res.data.success === true) {
                toaster.success("삭제를 완료했습니다.");
                Axios.post("/api/registration/get", { courseId: courseId })
                  .then((res) => {
                    if (
                      res.data.success === false &&
                      res.data.msg === "인증 실패!"
                    ) {
                      setLoginStatus(false);
                      setUserData({});
                      toaster.danger(
                        "다른 컴퓨터에서 로그인이 되어서 종료됩니다."
                      );
                      history.push("/login");
                    } else if (infos !== res.data.result) {
                      setInfo(res.data.result);
                    }
                  })
                  .catch((err) => {
                    console.log("에러" + err);
                    history.goBack();
                  });
              }
            })
            .catch((err) => console.log("에러" + err));

          //예, 하면 그그 머시냐 삭제 요청 보내고 다시 useEffect에서 했던거 호출하면 됨!
          setIsShown(false);
        }}
        confirmLabel="예, 삭제하겠습니다."
        hasFooter={true}
      >
        {`${department[studentInfo.department]} ${studentInfo._id}(학번) ${
          studentInfo.name
        }학생을 삭제하시겠습니까?`}
      </Dialog>
      <div className="scroll-page">
        <h6>{data.courseName}</h6>
        <p>{data.professorName}교수님 과목</p>
        <table id="student-list-to-xls" className="hidden">
          <thead>
            <tr>
              <th>소속</th>
              <th>학년</th>
              <th>교과목명</th>
              <th>담당교수</th>
              <th>튜터명</th>
              <th className="hidden">학번</th>
              <th className="hidden">학과</th>
              <th className="hidden">이름</th>
              <th className="hidden">이메일</th>
            </tr>
          </thead>
          <tbody>
            {infos &&
              infos.map((info) => (
                <tr key={info.id}>
                  <td className="hidden">{department[data.department]}</td>
                  <td className="hidden">{data.grade}</td>
                  <td className="hidden">{data.courseName}</td>
                  <td className="hidden">{data.professorName}</td>
                  <td className="hidden">{data.tutorName}</td>
                  <td>{info._id}</td>
                  <td>{department[info.department]}</td>
                  <td>{info.name}</td>
                  <td>{info.email}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th className="hidden">소속</th>
              <th className="hidden">학년</th>
              <th className="hidden">교과목명</th>
              <th className="hidden">담당교수</th>
              <th className="hidden">튜터명</th>
              <th>학번</th>
              <th>학과</th>
              <th>이름</th>
              <th>이메일</th>
              <th>수강생 삭제</th>
            </tr>
          </thead>
          <tbody>
            {infos &&
              infos.map((info) => (
                <tr key={info.id}>
                  <td className="hidden">{department[data.department]}</td>
                  <td className="hidden">{data.grade}</td>
                  <td className="hidden">{data.courseName}</td>
                  <td className="hidden">{data.professorName}</td>
                  <td className="hidden">{data.tutorName}</td>
                  <td>{info._id}</td>
                  <td>{department[info.department]}</td>
                  <td>{info.name}</td>
                  <td>{info.email}</td>
                  <td>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.preventDefault();
                        setStudentInfo({
                          _id: info._id,
                          department: info.department,
                          name: info.name,
                          id: info.id,
                        });
                        setIsShown(true);
                      }}
                      className="cursor"
                    >
                      ❌
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <ReactHTMLTableToExcel
        id="student-list-xls-button"
        className="download-table-xls-button"
        table="student-list-to-xls"
        filename={`${match.params.year}_${match.params.semester}학기_${data.courseName}수강생`}
        sheet="sheet1"
        buttonText="수강생 목록 다운로드"
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          history.goBack();
        }}
      >
        뒤로가기
      </button>
    </>
  );
}

export default AttendeeAdmin;
