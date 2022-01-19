import React, { Component } from 'react'

export default class Facebook extends Component {
    render() {
        if(! this.props.facebook_urls || this.props.facebook_urls.length === 0){
            return (
                <div>
                    <div>Facebook:</div>
                    <div>Not available</div>
                </div>
            )
            
        }

      
        if(this.props.facebook_urls.length === 1){
            return (
                <div>
                    <div>Facebook:</div>
                    <div><a target='_blank' rel="noreferrer" href={this.props.facebook_urls[0]}>{this.props.facebook_urls[0]}</a></div>

                </div>
            )
            
        }

        return (
            <div>
                <div>Facebook</div>
                <div>
                    <ul>
                        {this.props.facebook_urls.map((facebook_url,index) => (
                            <li key={index} >
                                <a target='_blank' rel="noreferrer" href={facebook_url}>{facebook_url}</a>
                            </li>
                        ))}
                    </ul>

                </div>
                
            </div>
        )
    }
}
