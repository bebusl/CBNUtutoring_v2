import React, { useState, createContext, useEffect } from "react";
import { Switch, Route, Link, Redirect, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/css/App.css";
import axios from "axios";
import AuthService from "./services/auth.service";
import Menu from "./components/Menu";
import Login from "./components/Login";
import Register from "./components/Register";
import AllList from "./components/AllList";
import MyList from "./components/MyList";
import CourseReg from "./components/CourseReg";
import CourseManage from "./components/CourseManage";
import User from "./components/User";
import Report from "./components/Report";
import ForgotPassword from "./components/ForgotPassword";
import ReportReg from "./components/ReportReg";
import AttendeeAdmin from "./components/AttendeeAdmin";

export const IsLogin = createContext();
export const UserData = createContext();

const program = "tutor";
const start_year = "2021";
const today = new Date();
//const today_year = today.getFullYear() + 1;
let years = [];
for (var y = start_year; y <= 2026; y++) {
  years.push(y);
}
const studentNav = [
  {
    title: "수강신청(강좌조회)",
    to: "/alllist",
    component: (props) => <AllList years={years} {...props} />,
  },
  {
    title: "내 수강 목록",
    to: "/mylist",
    component: (props) => <MyList years={years} {...props} />,
  },
  {
    title: "보고서 등록",
    to: "/reportreg",
    component: (props) => <ReportReg {...props} />,
  },
];
const adminNav = [
  {
    title: "강좌 등록",
    to: "/coursereg",
    component: (props) => <CourseReg years={years} {...props} />,
  },
  {
    title: "강좌 관리",
    to: "/coursemanage",
    component: (props) => <CourseManage years={years} {...props} />,
  },  {
    title: "수강생 관리",
    to: "/attendee-admin/:year/:semester/:courseId",
    component: (props) => <AttendeeAdmin {...props}></AttendeeAdmin>,
  },
  {
    title: "보고서 관리",
    to: "/report",
    component: (props) => <Report {...props} />,
  },
];

const App = (props) => {
  const [loginStatus, setLoginStatus] = useState(false);
  const [userData, setUserData] = useState({
    name: "name",
  });
  const history = useHistory();

  const handleChangeUserData = (newData) => {
    setUserData((state) => {
      return Object.assign({}, state, newData);
    });
  };

  useEffect(() => {
    axios
      .get("/api/accounts/auth")
      .then((res) => {
        if (res.data.success) {
          setLoginStatus(true);
          handleChangeUserData(res.data.account);
        } else {
          setLoginStatus(false);
          handleChangeUserData({});
        }
      })
      .catch((err) => console.log("인증 에러"));
  }, [loginStatus]);

  const logOut = () => {
    AuthService.logout()
      .then((res) => {
        if (res.data.success == true) {
          setLoginStatus(false);
          handleChangeUserData({});
          history.push("/login");
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <IsLogin.Provider value={{ loginStatus, setLoginStatus }}>
      <UserData.Provider value={{ userData, setUserData }}>
        <div>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <Link to={loginStatus ? "#" : "/"} className="navbar-brand">
              충북대학교 SW중심대학사업단 Keep-UpⓇ 관리 시스템
            </Link>
            {/* <div className="navbar-nav mr-auto">
              { {loginStatus && (
                <li className="nav-item">
                  <Link to={"/user"} className="nav-link">
                    회원정보
                  </Link>
                </li>
              )} }
            </div> */}

            {loginStatus ?(
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/profile"} className="nav-link">
                    {userData.name}님
                  </Link>
                </li>
                <li className="nav-item">
                  <a
                    href="/login"
                    className="nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      logOut();
                    }}
                  >
                    로그아웃
                  </a>
                </li>
              </div>
            ) : (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link">
                    로그인
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to={"/register"} className="nav-link">
                    회원가입
                  </Link>
                </li>
              </div>
            )}
          </nav>
   
          <div className="container">
            <Switch>
              <Route exact path={["/", "/home"]} component={Login} />
              <Route exact path="/login" component={Login}>
                {loginStatus ? <Redirect to="/user" /> : undefined}
              </Route>
              <Route exact path="/register" component={Register} />
              {/* <Route exact path="/user" component={User} /> */}
              <Route exact path="/forgotpassword" component={ForgotPassword} />

              {loginStatus &&
                studentNav.map((url, idx) => {
                  return (
                    <Route exact path={`/tutor/student${url.to}`} key={idx}>
                      {!loginStatus ? props.history.push("/login") : undefined}
                      <div className="menu">
                        {loginStatus && <Menu program={program} />}
                      </div>

                      <div className="main-column">
                        <h3>{url.title}</h3>
                        {url.component(props)}
                      </div>
                    </Route>
                  );
                })}
              {loginStatus &&
                adminNav.map((url, idx) => (
                  <Route
                    exact
                    path={`/tutor/admin${url.to}`}
                    key={idx}
                    render={(props) => {
                      return (
                        <>
                          <div className="menu">
                            {loginStatus && <Menu program={program} />}
                          </div>

                          <div className="main-column">
                            <h3>{url.title}</h3>
                            {url.component(props)}
                          </div>
                        </>
                      );
                    }}
                  />
                ))}
            </Switch>
          </div>
        </div>
      </UserData.Provider>
    </IsLogin.Provider>
  );
};

export default App;
