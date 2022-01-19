import React, { Component } from 'react'

export default class LinkedIn extends Component {
    render(props) {

        if( !this.props.linkedin_urls || this.props.linkedin_urls.length === 0){
            return (
                <div>
                    <div>LinkedIn:</div>
                    <div>Not available</div>
                </div>
            )
            
        }

        if(this.props.linkedin_urls.length === 1){
            return (
                <div>
                    <div>LinkedIn:</div>
                    <div><a target='_blank' rel="noreferrer" href={this.props.linkedin_urls[0]}>{this.props.linkedin_urls[0]}</a></div>

                </div>
            )
            
        }


        return (
            <div>
                <div>linkedin accounts:</div>
                <div>

                    <ul>
                        {this.props.linkedin_urls.map((linkedin_url,index) => (
                            <li key={index} >
                                <a target='_blank' rel="noreferrer" href={linkedin_url}>{linkedin_url}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}
