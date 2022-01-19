
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getCookie } from '../../functions/getCookie.js';

const PublicRoute = ({component: Component, restricted, ...rest}) => {

    function isLogin(){
        
        if( !(getCookie("loggedIn") === 'true') ){
            return false;
        }
        return true;
    }
    return (
        // restricted = false meaning public route
        // restricted = true meaning restricted route
        <Route {...rest} render={props => (
            isLogin() && restricted ?
                <Redirect to="/" />
            : <Component {...props} />
        )} />
    );
};

export default PublicRoute;