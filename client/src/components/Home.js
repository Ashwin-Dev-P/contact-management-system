import React, { Component } from 'react'
import { BrowserRouter as  Route, Link } from "react-router-dom";

export default class Home extends Component {
    render() {
        return (
            <div className='text-center homeDiv'>
                <Link to="/category" className='btn btn-primary mb-3 homeLink'>View categories</Link><br />
                <Link to="/data"  className='btn btn-primary homeLink'>View all members</Link>
            </div>
        )
    }
}
