import React, { Component } from 'react'

export default class SnapChat extends Component {
    render(props) {

        if( !this.props.snapchat_usernames || this.props.snapchat_usernames.length === 0){
            return (
                <div>
                    <div>SnapChat:</div>
                    <div>Not available</div>
                </div>
            )
            
        }

        if(this.props.snapchat_usernames.length === 1){
            return (
                <div>
                    <div>Snapchat:</div>
                    <div><a target='_blank' rel="noreferrer" href={`https://www.snapchat.com/add/${this.props.snapchat_usernames[0]}`}>{this.props.snapchat_usernames[0]}</a></div>

                </div>
            )
            
        }

        return (
            <div>
                <div>Snapchat:</div>
                <div>

                    <ul>
                        {this.props.snapchat_usernames.map((snapchat_username,index) => (
                            <li key={index} >
                                <a target='_blank' rel="noreferrer" href={`https://www.snapchat.com/add/${snapchat_username}`}>{snapchat_username}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}
