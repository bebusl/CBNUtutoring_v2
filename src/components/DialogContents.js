import React, { useContext, useEffect, useState } from "react";
import { UserData, IsLogin } from "../App";
import { TextInputField, Button, toaster, Select, Pane } from "evergreen-ui";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import User from "../services/user.service";
import Axios from "axios";
import styled from "styled-components";

const department = ["컴퓨터공학과", "소프트웨어학과", "정보통신학과", "로봇"];
const week = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const year = [2021, 2022, 2023, 2024, 2025, 2026];

const Enrolment = ({ onSubmit, data, history }) => {
  const { userData, setUserData } = useContext(UserData);
  const { loginStatus, setLoginStatus } = useContext(IsLogin);
  const onenrolmentSubmit = () => {
    User.regCourse(data.id)
      .then((res) => {
        if (res.data.success === true) {
          toaster.success("코스 등록에 성공했습니다.", {
            duration: 3,
          });
          window.location.reload(false);
        } else if (
          res.data.success === false &&
          res.data.msg === "인증 실패!"
        ) {
          setLoginStatus(false);
          setUserData({});
          toaster.danger("다른 컴퓨터에서 로그인이 되어서 종료됩니다.");
          history.push("/login");
        } else {
          toaster.danger("코스 등록에 실패했습니다.", {
            duration: 5,
          });
        }
      })
      .catch((error) => {
        toaster.danger("코스 등록에 실패했습니다.", {
          duration: 5,
        });
      });
    onSubmit();
  };

  return (
    <div className="enrolment">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onenrolmentSubmit();
        }}
      >
        <TextInputField
          label="학과"
          defaultValue={department[userData.department]}
        />
        <TextInputField label="학번" defaultValue={userData._id} />
        <TextInputField label="이름" defaultValue={userData.name} />
        <TextInputField label="이메일" defaultValue={userData.email} />
        <TextInputField label="연락처" defaultValue={userData.phoneNumber} />
        <Button onClick={() => onSubmit()} intent="danger">
          취소
        </Button>
        <Button type="submit">제출</Button>
      </form>
    </div>
  );
};

const CourseModify = ({ onSubmit, data, history }) => {
  const { userData, setUserData } = useContext(UserData);
  const { loginStatus, setLoginStatus } = useContext(IsLogin);
  const [values, setValues] = useState({
    year: data.year,
    semester: data.semester,
    department: data.department,
    grade: data.grade,
    courseName: data.courseName,
    professorName: data.professorName,
    tutorName: data.tutorName,
    tutorNumber: data.tutorNumber,
    profile: data.profile,
    limit: data.limit,
    file: data.file,
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setValues({ ...values, file: e.target.files[0] });
  };

  const onmodifySubmit = () => {
    const sendForm = new FormData();
    for (const i in values) {
      sendForm.append(i, values[i]);
    }

    sendForm.append("courseId", data.id);

    User.courseModify(sendForm)
      .then((res) => {
        if (res.data.success === true) {
          toaster.success("코스 수정에 성공했습니다.", {
            duration: 3,
          });
          window.location.reload(false);
        } else if (
          res.data.success === false &&
          res.data.msg === "인증 실패!"
        ) {
          setLoginStatus(false);
          setUserData({});
          toaster.danger("다른 컴퓨터에서 로그인이 되어서 종료됩니다.");
          history.push("/login");
        } else {
          toaster.danger("코스 수정에 실패했습니다." + res.data.msg, {
            duration: 3,
          });
        }
      })
      .catch((error) => {
        toaster.danger("코스 수정에 실패했습니다.", {
          duration: 3,
        });
      });
    onSubmit();
  };
  return (
    <div className="courseModify">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onmodifySubmit();
        }}
        encType="multipart/form-data"
      >
        <ul>
          <li>
            <label htmlFor="year">년도</label>
            <select name="year" value={values.year} onChange={handleChange}>
              {year.map((year) => (
                <option value={year} key={year}>
                  {year}
                </option>
              ))}
              ))
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
            <label htmlFor="department">소속</label>
            <select name="department" onChange={handleChange}>
              <option value="0">컴퓨터공학과</option>
              <option value="1">소프트웨어학과</option>
              <option value="2">정보통신공학부</option>
              <option value="3">지능로봇공학과</option>
            </select>
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
          <li>
            <label htmlFor="courseName">교과목명</label>
            <input
              type="text"
              name="courseName"
              value={values.courseName}
              onChange={handleChange}
            ></input>
          </li>

          <li>
            <label htmlFor="professorName">담당교수</label>
            <input
              type="text"
              name="professorName"
              value={values.professorName}
              onChange={handleChange}
            ></input>
          </li>
          <li>
            <label htmlFor="tutorName">튜터이름</label>
            <input
              type="text"
              name="tutorName"
              value={values.tutorName}
              onChange={handleChange}
            ></input>
          </li>
          <li>
            <label htmlFor="tutorNumber">튜터학번</label>
            <input
              type="text"
              name="tutorNumber"
              value={values.tutorNumber}
              onChange={handleChange}
            ></input>
          </li>
          <li>
            <label htmlFor="profile">튜터프로필</label>
            <textarea
              name="profile"
              value={values.profile}
              onChange={handleChange}
            />
          </li>
          <li>
            <label htmlFor="limit">최대인원</label>
            <input
              type="text"
              name="limit"
              value={values.limit}
              onChange={handleChange}
            ></input>
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
        </ul>
        <Button
          onClick={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          marginRight="0.5rem"
        >
          취소
        </Button>
        <Button intent="success" type="submit">
          수정
        </Button>
      </form>
    </div>
  );
};

const ReportRegister = ({ onSubmit, courseId, week, modify = false }) => {
  const [file, setFile] = useState();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const reportModify = (sendForm) => {
    User.reportModify(sendForm)
      .then((res) => {
        if (res.data.success === true) {
          toaster.success("보고서 수정을 성공했습니다.", { duration: 3 });
          onSubmit();
        } else {
          toaster.danger("보고서 수정에 실패했습니다.", +res.data.msg);
        }
      })
      .catch((err) => toaster.danger("보고서 수정을 실패했습니다." + err));
  };

  const reportUpload = (sendForm) => {
    User.reportUpload(sendForm)
      .then((res) => {
        if (res.data.success === true) {
          toaster.success("보고서 등록에 성공했습니다.", {
            duration: 3,
          });
          onSubmit();
          //search(); 그냥 무조건 다이얼로그 끄면 search함수 실행되도록 해뒀음.
        } else {
          toaster.danger("보고서 등록에 실패했습니다." + res.data.success, {
            duration: 3,
          });
        }
      })
      .catch((error) => {
        toaster.danger("보고서 등록에 실패했습니다." + error, {
          duration: 3,
        });
      });
  };

  const onReportSubmit = () => {
    const sendForm = new FormData();
    sendForm.append("file", file);
    sendForm.append("week", week);
    sendForm.append("courseId", courseId);
    if (modify === false) reportUpload(sendForm);
    else reportModify(sendForm);
  };
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onReportSubmit();
        }}
      >
        <div>
          <input type="file" name="file" onInput={handleFileChange} />
        </div>
        <Pane display="flex" justifyContent="flex-end">
          <Button
            onClick={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            appearance="minimal"
          >
            취소
          </Button>
          <Button appearance="minimal" intent="success" type="submit">
            제출
          </Button>
        </Pane>
      </form>
    </div>
  );
};

const StudentList = ({ onSubmit, data, year, semester, history }) => {
  const [infos, setInfo] = useState([]);
  const { userData, setUserData } = useContext(UserData);
  const { loginStatus, setLoginStatus } = useContext(IsLogin);
  useEffect(() => {
    Axios.post("/api/registration/get", { courseId: data.id })
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
      .catch((err) =>{});
  }, []);

  return (
    <>
      <div className="scroll-page">
        <table id="student-list-to-xls">
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
      </div>
      <ReactHTMLTableToExcel
        id="student-list-xls-button"
        className="download-table-xls-button"
        table="student-list-to-xls"
        filename={`${year}_${semester}학기_${data.courseName}수강생`}
        sheet="sheet1"
        buttonText="수강생 목록 다운로드"
      />
      <Button onClick={onSubmit}>취소</Button>
    </>
  );
};

export default { Enrolment, CourseModify, ReportRegister, StudentList };
