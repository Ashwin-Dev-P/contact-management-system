import React, { Component } from 'react'
import { Link } from 'react-router-dom';

export default class CompanySearchItem extends Component {
    render() {
        const { name ,_id} = this.props;
        return (

            <Link to={`company/${_id}`}>
                <div  className='listSearchItem myBorder zoomOnHover'>
                    {name}
                </div>
            </Link>
        )
    }
}
