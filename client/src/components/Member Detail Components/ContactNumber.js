import React, { Component } from 'react'

export default class ContactNumber extends Component {
    render(props) {
        if (!this.props.contact_number || this.props.contact_number.length === 0 ) {
            return <div>
                <div>Contact Number:</div>
                <div>N/A</div>
            </div>;
        }

        if(this.props.contact_number.length === 1){
            return (
                <div>
                    <div>
                        Contact number:
                    </div>
                    <div>
                        <a href={`tel: +${this.props.contact_number[0].country_code} ${this.props.contact_number[0].number}`}>+{this.props.contact_number[0].country_code} {this.props.contact_number[0].number}</a>
                    </div>
                </div>
            )
        }
        return (
            <div>
                Contact number:
                <ul>
                    {this.props.contact_number.map((contact_number,index) => (
                        <li  key={index}>
                        <a href={`tel: +${contact_number.country_code} ${contact_number.number}`}>+{contact_number.country_code} {contact_number.number}</a>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}
