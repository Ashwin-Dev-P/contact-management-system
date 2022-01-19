import React, { Component } from 'react'

export default class Email extends Component {

    render() {
        if (this.props.email.length === 0 ) {
            return <div>
                <div>Email:</div>
                <div>N/A</div>
            </div>;
        }

        if(this.props.email.length === 1){
            return (
                <div>
                    <div>
                        Email:
                    </div>
                    <div>
                        <a href={`mailto: ${this.props.email[0]}`}>{this.props.email}</a>
                    </div>
                </div>
            )
        }

        return (
            <div>
                E-mail
                <ul>
                    {this.props.email.map((email,index) => (
                        <li key={index} >
                        <a href={`mailto: ${email}`}>{email}</a>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}
