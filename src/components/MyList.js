import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {UserData,IsLogin} from "../App";
import Table from "./Table";
import {toaster} from "evergreen-ui";

const MyList = ({ years ,history}) => {
  const [datas, setDatas] = useState();
  const [myList, setMyList] = useState();
  const {userData, setUserData}=useContext(UserData);
  const {loginStatus, setLoginStatus} =useContext(IsLogin);
  useEffect(() => {
    axios
      .get(`/api/registration/`)
      .then(function (response) {
        if(response.data.success === false && response.data.msg === "인증 실패!"){
          setLoginStatus(false);
          setUserData({});
          toaster.danger("다른 컴퓨터에서 로그인이 되어서 종료됩니다.");
          history.push("/login")
}
       else if (response.data.result !== datas) {
          setDatas(response.data.result);
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, []);

  return (
    <div>
      <Table datas={datas} isMylist={true}></Table>
    </div>
  );
};

export default MyList;
