import React, { Component } from 'react'

export default class Twitter extends Component {
    render(props) {
        if( !this.props.twitter_usernames || this.props.twitter_usernames.length === 0){
            return (
                <div>
                    <div>Twitter:</div>
                    <div>Not available</div>
                </div>
            )
            
        }

        if(this.props.twitter_usernames.length === 1){
            return (
                <div>
                    <div>Twitter:</div>
                    <div><a target='_blank' rel="noreferrer" href={`https://twitter.com/${this.props.twitter_usernames[0]}`}>{this.props.twitter_usernames[0]}</a></div>

                </div>
            )
            
        }

        return (
            <div>
                <div>Twitter:</div>
                <div>

                    <ul>
                        {this.props.twitter_usernames.map((twitter_username,index) => (
                            <li key={index} >
                                <a target='_blank' rel="noreferrer" href={`https://twitter.com/${twitter_username}`}>{twitter_username}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}
