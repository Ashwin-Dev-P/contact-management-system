import React, { Component } from 'react'

export default class School extends Component {
    render() {
        return (
            <div className='mt-3'>
                <label htmlFor='school_name'>school name</label>
                <input className='form-control' type='text' name='school_name' id='school_name' />
            </div>
        )
    }
}
