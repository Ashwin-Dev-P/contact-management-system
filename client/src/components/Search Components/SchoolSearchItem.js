import React, { Component } from 'react'
import { Link } from 'react-router-dom';

export default class SchoolSearchItem extends Component {
    render() {
        const { name ,_id} = this.props;
        return (

            <Link to={`school/${_id}`}>
            <div  className='listSearchItem myBorder zoomOnHover'>
               {name}
               
            </div>
            </Link>
        )
    }
}
