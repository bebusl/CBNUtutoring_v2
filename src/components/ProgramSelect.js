import React from 'react'
import {Link, withRouter, BrowserRouter, HashRouter,Route, Switch} from 'react-router-dom'


 function Select(props){
    return(

                <div>
                    <Link exact to="/tutor/student/alllist">튜터링 시스템</Link>
                    <Link exact to="/ta/student/alllist">TA시스템</Link>
                </div>

    )
}

export default withRouter(Select)