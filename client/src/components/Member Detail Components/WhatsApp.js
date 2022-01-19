import React, { Component } from 'react'

export default class WhatsApp extends Component {
    render(props) {

        if (!this.props.whatsapp || this.props.whatsapp.length === 0 ) {
            return <div>
                <div>Whatsapp:</div>
                <div>Not available</div>
            </div>;
        }

        if(this.props.whatsapp.length === 1){
            return (
                <div>
                    <div>
                        Whatsapp:
                    </div>
                    <div>
                    <a  href={`https://api.whatsapp.com/send?phone=+${this.props.whatsapp[0].country_code} ${this.props.whatsapp[0].number}&text=Hi`} target='_blank' rel="noopener noreferrer">+{this.props.whatsapp[0].country_code} {this.props.whatsapp[0].number}</a>
                    </div>
                </div>
            )
        }


        return (
            <div>
                <div>WhatsApp</div>
                
                <ul>
                    {this.props.whatsapp.map((whatsapp_data,index) => (
                        <li key={index} >
                            <a  target='_blank' rel="noreferrer"  href={`https://api.whatsapp.com/send?phone=+${whatsapp_data.country_code} ${whatsapp_data.number}&text=Hi. I am here from Contact management system by Ashwin Dev`}>+{whatsapp_data.country_code} {whatsapp_data.number}</a>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}
