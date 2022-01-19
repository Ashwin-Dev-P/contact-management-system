import React, { Component } from 'react'

export default class Company extends Component {
    render() {
        return (
            <div className='mt-3'>
                <label htmlFor='company_name'>company name</label>
                <input className='form-control' type='text' name='company_name' id='company_name' />
            </div>
        )
    }
}
