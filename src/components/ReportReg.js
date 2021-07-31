// const ReportReg = ({ onSubmit, data }) => {

//   return (
//     <div>
//       <form onSubmit={onreportSubmit}>
//         <label htmlFor="reportWeek">기간</label>
//         <select name="reportWeek" onChange={handleChange}>
//           {week.map((data, idx) => {
//             return (
//               <option value={data} key={idx}>
//                 {data}주차
//               </option>
//             );
//           })}
//         </select>
//         <label htmlFor="file">보고서</label>
//         <input
//           type="file"
//           name="file"
//           accept=".pdf,.hwp"
//           onChange={handleFileChange}
//         />
//         <div>
//           <Button
//             intent="danger"
//             onClick={(e) => {
//               e.preventDefault();
//               onSubmit();
//             }}
//           >
//             취소
//           </Button>
//           <Button type="submit">제출</Button>
//         </div>
//       </form>
//     </div>
//   );
// };

import React, { useState, useEffect, useContext } from "react";
import ReportRegister from "./DialogContents";
import axios from "axios";
import User from "../services/user.service";
import { IsLogin, UserData } from "../App";
import { Table, Button, Select, toaster, Dialog } from "evergreen-ui";

function ReportReg({ years, history }) {
  const [year, setYear] = useState(window.localStorage.getItem("year"));
  const [semester, setSemester] = useState(
    window.localStorage.getItem("semester")
  );
  const [tutoringList, setTutoringList] = useState([]);

  const [isShown, setIsShown] = useState(false);
  const { loginStatus, setLoginStatus } = useContext(IsLogin);
  const { userData, setUserData } = useContext(UserData);
  const week = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  const [dialog, setDialog] = useState({
    title: "",
    confirmLabel: "",
    content: <div></div>,
    hasFooter: false,
  });

  const yearChange = (e) => {
    if (e.target.name === "year") {
      setYear(e.target.value);
      window.localStorage.setItem("year", e.target.value);
    } else {
      setSemester(e.target.value);
      window.localStorage.setItem("semester", e.target.value);
    }
  };

  const reportRegister = (data, date, modify = false) => {
    setDialog(
      {
        ...dialog,
        title: `${data.courseName} ${date}주차 보고서 제출`,
        hasFooter: false,
        confirmLabel: "완료",
        content: (
          <ReportRegister.ReportRegister
            onSubmit={() => setIsShown(false)}
            courseId={data.id}
            week={date}
            modify={modify}
          />
        ),
      },
      setIsShown(true)
    );
  };

  const reportModify = (data, date) => {
    const fileName = data.reports.filter((report) => report.week === date);
    setDialog({
      ...dialog,
      title: `${data.courseName} ${date}주차 보고서 수정`,
      hasFooter: false,
      confirmLabel: "예",
      content: (
        <div>
          <p>보고서가 이미 등록되어있습니다.</p>
          <p>등록되어 있는 파일의 이름 :</p>
          <div>{fileName[fileName.length - 1].fileName}</div>
          <p>수정하시겠습니까?</p>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setIsShown(false);
            }}
          >
            아니오
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              reportRegister(data, date, true);
            }}
          >
            예
          </Button>
        </div>
      ),
    });
    setIsShown(true);
  };

  const search = () => {
    axios
      .post("/api/reports/me", { year: year, semester: semester })
      .then((res) => {
        setTutoringList([...res.data.courseData]);
      });
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
      >
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
      <Dialog
        isShown={isShown}
        title={dialog.title}
        onCloseComplete={() => {
          search();
          setIsShown(false);
        }}
        confirmLabel={dialog.confirmLabel}
        hasFooter={dialog.hasFooter}
      >
        {dialog.content}
      </Dialog>
      <table>
        <thead>
          <tr>
            <th>강좌이름</th>
            <th>튜터이름</th>
            {week.map((data) => (
              <th key={data}>{data}주차</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tutoringList &&
            tutoringList.map((data, idx) => {
              return (
                <tr key={idx}>
                  <td>{data.courseName}</td>
                  <td>{data.tutorName}</td>
                  {week.map((date) => (
                    <td key={(data.id, "-", date)}>
                      {data.reports.some((report) => report.week === date) ? (
                        <Button
                          appearance="minimal"
                          onClick={(e) => {
                            e.preventDefault();
                            reportModify(data, date); //data.fileName=> 파일 이름.
                          }}
                        >
                          O
                        </Button>
                      ) : (
                        <Button
                          appearance="minimal"
                          onClick={(e) => {
                            e.preventDefault();
                            reportRegister(data, date);

                            // setDialog({
                            //   ...dialog,
                            //   title: `${data.courseName} ${date}주차 보고서 제출`,
                            //   week: date,
                            //   id: data.id,
                            //   hasFooter: true,
                            //   confirmLabel: "완료",
                            // });
                            // setIsShown(true);
                          }}
                        >
                          X
                        </Button>
                      )}
                    </td>
                  ))}
                  {/* {week.map((eachWeek, idx) => (
                    <Table.TextCell key={idx}>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setDialog({
                            ...dialog,
                            title: `${data.courseName} ${eachWeek}주차 보고서 제출`,
                            week: eachWeek,
                            id: data.id,
                            hasFooter: true,
                            confirmLabel: "완료",
                          });
                          setIsShown(true);
                        }}
                      >
                        X
                      </Button>
                    </Table.TextCell>
                  ))} */}
                </tr>
              );
            })}
        </tbody>
      </table>
      {/* <Table.Head>
          <Table.TextHeaderCell>강좌이름</Table.TextHeaderCell>
          <Table.TextHeaderCell>튜터이름</Table.TextHeaderCell>
          {week.map((data) => (
            <Table.TextHeaderCell key={data}>{data}주차</Table.TextHeaderCell>
          ))}
        </Table.Head> */}
      {/* <Table.Body>
          {datas &&
            datas.map((data) => (
              <Table.Row key={data.id}>
                <Table.TextCell>{data.courseName}</Table.TextCell>
                <Table.TextCell>{data.tutorName}</Table.TextCell>
                {week.map((date) => (
                  <Table.TextCell key={(data.id, "-", date)}>
                    {data.reports.some((e) => e.week === date) ? (
                      <Button
                        onClick={() =>
                          reportDown(
                            date,
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
                  </Table.TextCell>
                ))}
              </Table.Row>
   
            ))}
        </Table.Body> */}
    </div>
  );
}

export default ReportReg;
