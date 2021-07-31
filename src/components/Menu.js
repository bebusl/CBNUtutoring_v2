import React, { Component, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { Menu as MenuUI } from "evergreen-ui";
import { UserData, IsLogin } from "../App";

function Menu(props) {
  const { userData } = useContext(UserData);
  const { loginStatus } = useContext(IsLogin);

  const studentNav = [
    {
      title: "수강신청(강좌조회)",
      to: "/alllist",
      component: <div>수강신청(강좌조회)</div>,
    },
    {
      title: "내 수강 목록",
      to: "/mylist",
      component: <div>내 수강 목록</div>,
    },
    {
      title: "보고서 등록",
      to: "/reportreg",
      component: <div>보고서 등록</div>,
    },
  ];
  const adminNav = [
    { title: "강좌 등록", to: "/coursereg", component: <div>강좌 등록</div> },
    {
      title: "강좌 관리",
      to: "/coursemanage",
      component: <div>강좌 관리</div>,
    },
    // {
    //   title: "수강신청 기간 설정",
    //   to: "/enrolmentseason",
    //   component: <div>수강신청 기간 설정</div>,
    // },
    { title: "보고서 관리", to: "/report", component: <div>보고서 관리</div> },
  ];

  const Navtitle = { tutor: "학부생 튜터링", ta: "TA프로그램" };

  useEffect(() => {
    if (!loginStatus) {
      window.alert("로그인이 필요한 페이지 입니다.");
      props.history.push("/login");
    }
  });

  return (
    <div className="navigation">
      <MenuUI>
        {props.program === "tutor" && <p>학부생 튜터링</p>}
        {userData.role !== 3 ? (
          <MenuUI.Group title="학생">
            {studentNav.map((nav, index) => {
              return (
                <MenuUI.Item key={index}>
                  <NavLink exact to={`/tutor/student${nav.to}`}>
                    {nav.title}
                  </NavLink>
                </MenuUI.Item>
              );
            })}
          </MenuUI.Group>
        ) : undefined}
        {userData.role === 3 ? (
          <MenuUI.Group title="관리자">
            {adminNav.map((nav, index) => {
              return (
                <MenuUI.Item key={index}>
                  <NavLink exact to={`/tutor/admin${nav.to}`}>
                    {nav.title}
                  </NavLink>
                </MenuUI.Item>
              );
            })}
          </MenuUI.Group>
        ) : undefined}
      </MenuUI>
    </div>
  );
}

export default Menu;
