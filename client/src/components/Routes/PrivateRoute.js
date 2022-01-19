import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { getCookie } from '../../functions/getCookie.js';

const PrivateRoute = ({ component: Component, ...rest }) => {

    var [redirectUrl] = useState(rest.path);

    function isLogin() {
        if (!(getCookie("loggedIn") === 'true')) {
            return false;
        }
        return true;
    }

    function isAdminRoute() {

        const path = window.location.pathname.slice(0, 6);
        if (path === '/admin') {
            return true;
        }
        return false;

    }

    return (

        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route {...rest} render={props => (
            isLogin() ?
                <Component {...props} />
                :

                isAdminRoute() ? <><Redirect to={`/admin/login?redirectUrl=${redirectUrl}`} /></> : <><Redirect to={`/login?redirectUrl=${redirectUrl}`} /></>



        )} />
    );
};

export default PrivateRoute;