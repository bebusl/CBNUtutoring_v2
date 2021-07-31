import React from "react";
import AllList from "./AllList";

function CourseManage({ years }) {
  return <AllList years={years} isCourseManage={true}></AllList>;
}

export default CourseManage;
