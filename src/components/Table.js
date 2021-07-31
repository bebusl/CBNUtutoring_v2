import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { UserData, IsLogin } from "../App";
import {
  Table as TableUI,
  Button,
  Dialog,
  Pane,
  toaster,
  Alert,
} from "evergreen-ui";
import DialogContents from "./DialogContents";
import User from "../services/user.service";
import Axios from "axios";
import { Link } from "react-router-dom";

const fileDownload = require("js-file-download");

const departmentList = ["컴퓨터공학과", "소프트웨어", "정보통신", "로봇"];

function Table({
  datas,
  isAllList = false,
  isCourseManage = false,
  isMylist = false,
  isReportReg = false,
  year,
  semester,
}) {
  const { userData, setUserData } = useContext(UserData);
  const { loginStatus, setLoginStatus } = useContext(IsLogin);
  const [mylistData, setmylistdata] = useState();
  //const [accessSeason, setAccessSeason] = useState(true);
  const [isShown, setIsShown] = useState(false);
  const [dialog, setDialog] = useState({
    title: "",
    confirmLabel: "",
    content: "",
    hasFooter: false,
  });
  const history = useHistory();

  // useEffect(() => {
  //   Axios.get(`/api/systems/find/1/${year}/${semester}`)
  //     .then((res) => {
  //       if (res.data.success === false && res.data.msg === "인증 실패!") {
  //         setLoginStatus(false);
  //         setUserData({});
  //         toaster.danger("다른 컴퓨터에서 로그인이 되어서 종료됩니다.");
  //         history.push("/login");
  //       }
  //       if (
  //         res.data.result.start > Date.now() ||
  //         Date.now() > res.data.result.end
  //       ) {
  //         setAccessSeason(false);
  //       }
  //       console.log(res.data.result.start, res.data.result.end, Date.now());
  //     })
  //     .catch((error) => console.log(error));
  // }, [year, semester]);//enrolment season반영 빼기



  useEffect(() => {
    //push

    Axios.get(`/api/registration/`)
      .then(function (response) {
        if (
          response.data.success === false &&
          response.data.msg === "인증 실패!"
        ) {
          setLoginStatus(false);
          setUserData({});
          toaster.danger("다른 컴퓨터에서 로그인이 되어서 종료됩니다.");
          history.push("/login");
        }
        else{setmylistdata(response.data.result)};
      })
      .catch((error) => console.log(error));
  }, []);

  const handleDialog = (newcontent) => {
    setDialog(Object.assign({}, dialog, newcontent));
  };

  const setIsShownFalse = () => {
    //console.log("상위컴포넌트로 넘기기 되나? ", text);//이게 되네 ㅎ
    setIsShown(false);
  };
  //if (datas.tutorNumber === userData.studentNumber) {
  //  console.log("나 튜터임");
  //}
  //        <CourseReg years={[2020, 2021]}></CourseReg>

  return (
    <Pane>
      {/* {isAllList && !accessSeason && (
        <Alert intent="warning" title="수강신청 기간이 아닙니다."></Alert>
      )} */}
      <Dialog
        isShown={isShown}
        title={dialog.title}
        onCloseComplete={() => {
          setIsShown(false);
          setDialog({ ...dialog, hasFooter: false });
        }}
        confirmLabel={dialog.confirmLabel}
        hasFooter={dialog.hasFooter}
      >
        {dialog.content}
      </Dialog>
      <div className="scroll-page">
        <table>
          <thead>
            <tr>

            
            <th>소속</th>
            <th>
              학년
            </th>
            <th>교과목명</th>
            <th>담당교수</th>
            <th>튜터명</th>
            <th >
              튜터프로필
            </th>
            {isAllList ? (
              <>
                <th
                 
                >
                  신청인원
                </th>
                <th
 
                >
                  운영계획서
                </th>
              </>
            ) : undefined}
            <th>
              {" "}
              </th>
              </tr>
          </thead>
          <tbody height={240}>
            {!datas ? (
              <tr>
              <td>내역이 없습니다.</td></tr>
            ) : (
              datas.map((data, index) => (
                <tr key={data.id}>
                  <td>
                    {departmentList[data.department]}
                  </td>
                  <td >
                    {data.grade}
                  </td>
                  <td>{data.courseName}</td>
                  <td>{data.professorName}</td>
                  <td>{data.tutorName}</td>
                  <td >
                    <Button
                      height={32}
                      onClick={() => {
                        handleDialog({
                          title: "튜터 프로필",
                          confirmLabel: "확인",
                          hasFooter: true,
                          content: (
                            <div>
                              <p>
                                {data.profile.split("\n").map((item, idx) => {
                                  return (
                                    <React.Fragment key={idx}>
                                      {item}
                                      <br />
                                    </React.Fragment>
                                  );
                                })}
                              </p>
                            </div>
                          ),
                        });
                        setIsShown(true);
                      }}
                    >
                      프로필 보기
                    </Button>
                  </td>
                  {isAllList ? (
                    <>
                      <td
                        
                      >
                        {data.appliedCount}
                      </td>
                      <td
           
                      >
                        <Button
                          appearance="minimal"
                          onClick={() => {
                            Axios({
                              url: `/api/courses/download/${data.fileId}`,
                              method: "GET",
                              responseType: "blob",
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
                                fileDownload(
                                  res.data,
                                  `${decodeURIComponent(
                                    res.headers["file-name"]
                                  )}`
                                );
                              })
                              .catch((error) => {
                                toaster.warning(
                                  "운영계획서가 등록되어 있지 않습니다."
                                );
                                console.log(error);
                              });
                          }}
                        >
                          다운로드
                        </Button>
                      </td>
                    </>
                  ) : undefined}
                  {isAllList ? (
                    <td
                   
                    >
                      <Button
                        appearance="minimal"
                        disabled={
                          
                          data.tutorNumber === userData._id ||
                          (mylistData &&
                            mylistData.some((e) => e.id === data.id))
                            ? true
                            : false
                        }
                        onClick={() => {
                          if (data.appliedCount < data.limit) {
                            handleDialog({
                              title: "수강신청",
                              confirmLabel: "신청",
                              content: (
                                <DialogContents.Enrolment
                                  data={data}
                                  onSubmit={setIsShownFalse}
                                  readOnly
                                />
                              ),
                            });
                            setIsShown(true);
                          } else {
                            toaster.warning(
                              "인원이 초과되어 신청할 수 없습니다.",
                              {
                                duration: 3,
                              }
                            );
                          }
                          //User.regCourse(data.id);
                        }}
                      >
                        수강신청
                      </Button>
                    </td>
                  ) : undefined}
                  {isCourseManage ? (
                    <td

                    >
                      <Button
                        appearance="minimal"
                        onClick={() => {
                          handleDialog({
                            title: "강좌 수정",
                            confirmLabel: "수정",
                            content: (
                              <DialogContents.CourseModify
                                data={data}
                                onSubmit={setIsShownFalse}
                              />
                            ),
                          });

                          setIsShown(true);
                        }}
                      >
                        수정
                      </Button>
                      <Button
                        appearance="minimal"
                        onClick={() => {
                          handleDialog({
                            title: "코스 삭제",
                            confirmLabel: "삭제",
                            content: (
                              <div>
                                <p>{data.courseName}과목을 삭제하시겠습니까?</p>
                                <Button onClick={() => setIsShownFalse()}>
                                  아니오
                                </Button>
                                <Button
                                  intent="danger"
                                  onClick={() => {
                                    User.courseDelete(data.id)
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
                                        } else if (res.data.success === true) {
                                          toaster.success(
                                            "코스 삭제 완료되었습니다.",
                                            { duration: 3 }
                                          );
                                        } else {
                                          toaster.warning(
                                            "에러가 발생해 코스 삭제를 실패 했습니다.",
                                            {
                                              duration: 3,
                                            }
                                          );
                                        }
                                        setIsShownFalse();
                                      })
                                      .catch((error) => console.log(error));
                                    window.location.reload(false);
                                  }}
                                >
                                  예, 삭제하겠습니다.
                                </Button>
                              </div>
                            ),
                          });
                          setIsShown(true);
                        }}
                      >
                        삭제
                      </Button>
                       {data.appliedCount > 0 ? (
                        <Link
                          className="css-1ii3p2c ub-fnt-fam_b77syt ub-mt_0px ub-fnt-sze_12px ub-f-wght_500 ub-ln-ht_32px ub-ltr-spc_0 ub-btrr_3px ub-bbrr_3px ub-btlr_3px ub-bblr_3px ub-pt_0px ub-pb_0px ub-pr_16px ub-pl_16px ub-ml_0px ub-mr_0px ub-mb_0px ub-h_32px ub-pst_relative ub-dspl_inline-flex ub-algn-itms_center ub-flx-wrap_nowrap ub-box-szg_border-box"
                          to={{
                            pathname: `/tutor/admin/attendee-admin/${year}/${semester}/${data.id}`,
                            state: {
                              data,
                            },
                          }}
                        >
                          수강생 목록
                        </Link>
                      ) : (
                        <Button disabled={true} appearnace="minimal">
                          수강생 목록
                        </Button>
                      )}

                      {/* <Button
                        appearance="minimal"
                        disabled={data.appliedCount > 0 ? false : true}
                        onClick={() => {
                          handleDialog({
                            title: "수강생 목록 확인",
                            confirmLabel: "나가기",
                            content: (
                              <DialogContents.StudentList
                                data={data}
                                year={year}
                                semester={semester}
                                onSubmit={setIsShownFalse}
                              />
                            ),
                          });
                          setIsShown(true);
                        }}
                      >
                        수강생 목록
                      </Button> */}
                    </td>
                  ) : undefined}
                  {isMylist ? (
                    <td
    
                    >
                      <Button
                        appearance="minimal"
                        onClick={() => {
                          handleDialog({
                            title: "수강 신청 취소",
                            confirmLabel: "취소",
                            content: (
                              <div>
                                <p>
                                  {data.courseName}과목의 수강을
                                  취소하시겠습니까?
                                </p>
                                <Button onClick={() => setIsShownFalse()}>
                                  아니오
                                </Button>
                                <Button
                                  onClick={() => {
                                    User.cancleRegCourse(data.id).then(
                                      (res) => {
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
                                        } else if (res.data.success === true) {
                                          toaster.success(
                                            "수강 취소 완료되었습니다.",
                                            { duration: 3 }
                                          );
                                          window.location.reload(false);
                                        } else {
                                          toaster.warning(
                                            "에러가 발생해 수강 취소를 하지 못했습니다.",
                                            {
                                              duration: 3,
                                            }
                                          );
                                        }
                                        setIsShownFalse();
                                      }
                                    );
                                  }}
                                >
                                  예, 수강 취소하겠습니다.
                                </Button>
                              </div>
                            ),
                          });
                          setIsShown(true);
                        }}
                      >
                        신청취소
                      </Button>
                    </td>
                  ) : undefined}
                  {isReportReg ? (
                    <td
                    >
                      <Button
                        appearance="minimal"
                        onClick={() => {
                          handleDialog({
                            title: "보고서 등록",
                            confirmLabel: "등록",

                            content: (
                              <DialogContents.ReportReg
                                data={data.id}
                                onSubmit={setIsShownFalse}
                              />
                            ),
                          });

                          setIsShown(true);
                        }}
                      >
                        보고서등록
                      </Button>
                    </td>
                  ) : undefined}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Pane>
  );
}

export default Table;
