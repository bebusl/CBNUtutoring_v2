import React, { useContext, useState } from "react";
import { TextInput, TextInputField, Pane, Button } from "evergreen-ui";
import { UserData } from "../App";
import Axios from "axios";

const department = [
  "컴퓨터공학과",
  "소프트웨어학과",
  "정보통신학과",
  "로봇학과",
];
const User = (props) => {
  const { userData, setUserData } = useContext(UserData);

  const goBack = () => {
    props.history.goBack();
  };

  const modify = () => {};

  return (
    <Pane
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent=" center"
      width="auto"
      padding="40px"
      backgroundColor="#ffffff"
    >
      <form onSubmit={modify}>
        <h4>회원정보 수정</h4>
        <label htmlFor="_id">학번</label>
        <TextInput name="_id" value={userData._id} disabled />
        <label htmlFor="newPassword">새 비밀번호</label>
        <TextInput name="newPassword"></TextInput>
        <label htmlFor="newPassword">새 비밀번호 확인</label>
        <TextInput name="newPasswordCheck"></TextInput>
        <label htmlFor="name">이름</label>
        <TextInput name="name" value={userData.name}></TextInput>
        <label htmlFor="email">이메일</label>
        <TextInput name="email" value={userData.email}></TextInput>
        <label htmlFor="phoneNumber">휴대폰번호</label>
        <TextInput name="phoneNumber" value={userData.phoneNumber}></TextInput>
        <label htmlFor="department">학과</label>
        <TextInput name="department" value={userData.department}></TextInput>
        <Pane
          display="flex"
          flexDirection="row"
          marginTop="30px"
          justifyContent="center"
          alignItems="center"
        >
          <Button intent="success" type="submit" marginRight="1rem">
            수정
          </Button>
          <Button intent="danger" onClick={goBack}>
            취소
          </Button>
        </Pane>
      </form>
    </Pane>
  );
};

export default User;
