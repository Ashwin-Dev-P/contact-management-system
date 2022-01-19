import React, { Component } from 'react'

export default class Section extends Component {
    render() {
        return (
            <div>
                <label htmlFor="section">Section</label>
                <input className='form-control' type='text' name='section' id='section' />
            </div>
        )
    }
}
