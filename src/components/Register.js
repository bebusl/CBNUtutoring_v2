import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../services/auth.service";
import { toaster } from "evergreen-ui";
import { isEmail } from "validator";

function useForm({ initialValues, onSubmit, validate }) {
  const [values, setValues] = useState(initialValues);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };



  const handleSubmit = async () => {
    setSubmitting(true);

    const result = AuthService.register({
      _id: values._id,
      password: values.password,
      name: values.name,
      email: values.email,
      phoneNumber: values.phoneNumber,
      department: values.department,
      role: values.role,
    });
    return result;
  };

  return {
    values,
    submitting,
    handleChange,
    handleSubmit,
  };
}



const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        필수 입력 항목입니다.
      </div>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        유효한 이메일 형식이 아닙니다.
      </div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        학번(id)는 3~20글자 사이여야 합니다.
      </div>
    );
  }
};

const Register = (props) => {
  const form = useRef();
  const checkBtn = useRef();
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);
  const { values, handleChange, handleSubmit} = useForm({
    initialValues: {
      _id: "",
      password: "",
      checkPassword: "",
      name: "",
      email: "",
      phoneNumber: "",
      department: "0",
      role: "0",
    },
  });

  const validPassword = () => {
    if (values.password !== values.checkPassword) {
      return (
        <div className="alert alert-danger" role="alert">
          비밀번호가 일치하지 않습니다.
        </div>
      );
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const result = handleSubmit(e);
    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      result.then(
        (response) => {
          if(response.data.success===true){
            setSuccessful(true);
            toaster.success("회원가입에 성공했습니다.");
            props.history.push("/login");
          }else{
            toaster.warning("회원가입에 실패했습니다. ",response.data.msg);
          }

        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          toaster.warning("이미 가입되어 있는 회원입니다.");
          setSuccessful(false);
        }
      );
    }
  };

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Form onSubmit={handleRegister} ref={form}>
          <div>
            <div className="form-group">
              <label htmlFor="_id">학번</label>
              <Input
                type="text"
                className="form-control"
                name="_id"
                value={values._id}
                onChange={handleChange}
                validations={[required, vusername]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <Input
                type="password"
                className="form-control"
                name="password"
                value={values.password}
                onChange={handleChange}
                validations={[required]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="checkPassword">비밀번호 확인</label>
              <Input
                type="password"
                className="form-control"
                name="checkPassword"
                value={values.checkPassword}
                onChange={handleChange}
                validations={[required]}
              />
            </div>
            {validPassword()}
            <div className="form-group">
              <label htmlFor="name">이름</label>
              <Input
                type="text"
                className="form-control"
                name="name"
                value={values.name}
                onChange={handleChange}
                validations={[required]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <Input
                type="text"
                className="form-control"
                name="email"
                value={values.email}
                onChange={handleChange}
                validations={[required, validEmail]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">휴대폰번호</label>
              <Input
                type="text"
                className="form-control"
                name="phoneNumber"
                placeholder="-제외. 예시 : 01012345678"
                value={values.phoneNumber}
                onChange={handleChange}
                validations={[required]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">학과</label>
              <select
                name="department"
                value={values.department}
                onChange={handleChange}
              >
                <option value="0">컴퓨터공학과</option>
                <option value="1">소프트웨어학과</option>
                <option value="2">정보통신공학부</option>
                <option value="3">지능로봇공학과</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="role">직위</label>
              <select name="role" value={values.role} onChange={handleChange}>
                <option value="0">학부생</option>
                <option value="1">대학원생</option>
                <option value="2">교직원</option>
              </select>
            </div>

            <div className="form-group">
              <button className="btn btn-primary btn-block">회원가입</button>
            </div>
          </div>

          {message && (
            <div className="form-group">
              <div
                className={
                  successful ? "alert alert-success" : "alert alert-danger"
                }
                role="alert"
              >
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default Register;
