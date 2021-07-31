import {Link} from "react-router-dom";
import React from "react";

const Header=(props)=>(
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
</nav>)

export default Header;