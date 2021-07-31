import React, { useState, useEffect, useContext } from "react";
import { IsLogin, UserData } from "../App";
import axios from "axios";
import { Table, Button, Select, toaster } from "evergreen-ui";
import Axios from "axios";
import { DownloadIcon } from "evergreen-ui";
const fileDownload = require("js-file-download");

function Report({ years, history }) {
  const [year, setYear] = useState(window.localStorage.getItem("year"));
  const [semester, setSemester] = useState(
    window.localStorage.getItem("semester")
  );
  const [datas, setDatas] = useState();
  const [selectWeek, setWeek] = useState(1);
  const { loginStatus, setLoginStatus } = useContext(IsLogin);
  const { userData, setUserData } = useContext(UserData);
  const week = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const X = "X";

  const yearChange = (e) => {
    if (e.target.name === "year") {
      setYear(e.target.value);
      window.localStorage.setItem("year", year);
    } else {
      setSemester(e.target.value);
      window.localStorage.setItem("semester", semester);
    }
  };

  const reportDown = (data) => {
    Axios({
      url: `/api/reports/download`,
      method: "POST",
      responseType: "blob",
      data: {
        fileId: data.fileId,
      },
    })
      .then((res) => {
        if (res.data.success === false && res.data.msg === "인증 실패!") {
          setLoginStatus(false);
          setUserData({});
          toaster.danger("다른 컴퓨터에서 로그인이 되어서 종료됩니다.");
          history.push("/login");
        }

        fileDownload(
          res.data,
          `${decodeURIComponent(res.headers["file-name"])}`
        );
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios
      .post("/api/reports/find/", { year: year, semester: semester })
      .then((res) => {
        if (res.data.success === false && res.data.msg === "인증 실패!") {
          setLoginStatus(false);
          setUserData({});
          toaster.danger("다른 컴퓨터에서 로그인이 되어서 종료됩니다.");
          history.push("/login");
        }
        setDatas(res.data.courseData);
      })
      .catch((error) => console.log(error));
  }, []);

  const search = (e) => {
    e.preventDefault();
    axios
      .post("/api/reports/find/", {
        year: year,
        semester: semester,
        week: week,
      })
      .then((res) => {
        if (res.data.success === false && res.data.msg === "인증 실패!") {
          setLoginStatus(false);
          setUserData({});
          toaster.danger("다른 컴퓨터에서 로그인이 되어서 종료됩니다.");
          history.push("/login");
        }
        if (datas !== res.data.courseData) {
          setDatas(res.data.courseData);
        }
      });

    window.localStorage.setItem("year", year);
    window.localStorage.setItem("semester", semester);
  };
  return (
    <div>
      <form onSubmit={search}>
        <div className="dateWrap">
          <div className="yearWrap">
            년도{" "}
            <select name="year" value={year} onChange={yearChange}>
              <option value={2021}>2021</option>
              <option value={2022}>2022</option>
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              ))
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
      <div>
        <table>
          <thead>
            <tr>
              <th>강좌이름</th>
              <th>튜터이름</th>
              {week.map((data) => (
                <th key={data}>{data}주차</th>
              ))}
              <th>다운로드</th>
            </tr>
          </thead>

          <tbody>
            {datas &&
              datas.map((data) => (
                <tr key={data.id}>
                  <td>{data.courseName}</td>
                  <td>{data.tutorName}</td>
                  {week.map((date) => (
                    <td key={(data.id, "-", date)}>
                      {data.reports.some((e) => e.week === date) ? (
                        <Button
                        appearance="minimal"
                          onClick={() =>
                            reportDown(
                      
                              data.reports.find(
                                (element) => element.week === date
                              )
                            )
                          }
                        >
                          O
                        </Button>
                      ) : (
                        "X"
                      )}
                    </td>
                  ))}
                  <td>
                    <Button
                      onClick={() => {
                        Axios({
                          url: `/api/reports/downloads`,
                          method: "POST",
                          data: {
                            year: year,
                            semester: semester,
                            _id: data.tutorNumber,
                            courseId: data.id,
                          },   
                        })
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
                            }
                           //const url = window.URL.createObjectURL(
                           //   new Blob([res.data])
                           // );
                           const link = document.createElement("a");
                           link.href = `http://swtutor.cbnu.ac.kr/file/${res.data.link}`;
                           link.setAttribute("download",decodeURIComponent(res.headers["file-name"]))
                           document.body.appendChild(link);
                           link.click();
                           document.body.removeChild(link);
                           // link.setAttribute(
                           //   "download",
                           //   `${decodeURIComponent(res.headers["file-name"])}`
                           // ); //or any other extension
                           // document.body.appendChild(link);
                            //link.click();
                            //  fileDownload(
                            //    res.data,
                            //    `${decodeURIComponent(res.headers["file-name"])}`
                            //  );
                          })
                          .catch((err) =>
                            toaster.warning("다운로드 실패" + err)
                          );
                      }}
                    >
                      <DownloadIcon></DownloadIcon>
                    </Button>
                  </td>
                </tr>
              ))}
            <tr>
              <td></td>
              <td></td>
              {week.map((sweek) => {
                return (
                  <td>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        Axios({
                          url: `/api/reports/downloads`,
                          method: "POST",
                          data: {
                            week: sweek,
                            year: year,
                            semester: semester,
                          }, 
                        })
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
                            }
                            const link = document.createElement("a");
                            link.href = `http://swtutor.cbnu.ac.kr/file/${res.data.link}`;
                            link.setAttribute("download",decodeURIComponent(res.headers["file-name"]))
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                              //const url = window.URL.createObjectURL(
                            //   new Blob([res.data])
                            // );
                            // const link = document.createElement("a");
                            // link.href = url;
                            // link.setAttribute(
                            //   "download",
                            //   `${decodeURIComponent(res.headers["file-name"])}`
                            // ); //or any other extension
                            // document.body.appendChild(link);
                            // link.click();
                            // fileDownload(
                            //   res.data,
                            //   `${decodeURIComponent(res.headers["file-name"])}`
                            // );
                          })
                          .catch((err) =>
                            toaster.warning("다운로드 실패" + err)
                          );
                      }}
                    >
                      <DownloadIcon></DownloadIcon>
                    </Button>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>

      </div>
      {/* <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("보내는데이터", selectWeek, year, semester);
          Axios({
            url: `/api/reports/downloads`,
            method: "POST",
            responseType: "blob",
            data: {
              week: selectWeek,
              year: year,
              semester: semester,
            },
          })
            .then((res) => {
              if (res.data.success === false && res.data.msg === "인증 실패!") {
                setLoginStatus(false);
                setUserData({});
                toaster.danger("다른 컴퓨터에서 로그인이 되어서 종료됩니다.");
                history.push("/login");
              }
              fileDownload(
                res.data,
                `${decodeURIComponent(res.headers["file-name"])}`
              );
            })
            .catch((err) => toaster.warning("다운로드 실패" + err));
        }}
      >
        <Select
          value={selectWeek}
          onChange={(event) => {
            setWeek(event.target.value);
          }}
        >
          {week.map((data, idx) => (
            <option value={data} key={idx}>
              {data}
            </option>
          ))}
        </Select>
        <span>주차</span>
        <Button type="submit" marginY={8} marginLeft="1rem">
          보고서 다운로드
        </Button>
      </form> */}
    </div>
  );
}

export default Report;
