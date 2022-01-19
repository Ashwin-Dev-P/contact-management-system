import React, { Component } from 'react'

export default class OtherSocialMedia extends Component {
    render() {

        if( !this.props.additional_urls || this.props.additional_urls.length === 0){
            return (
                <></>
            )
            
        }

        if(this.props.additional_urls.length === 1){
            return (
                <div>
                    <div>Other Links:</div>
                    <div><a target='_blank' rel="noreferrer" href={this.props.additional_urls[0].url}>{this.props.additional_urls[0].urlTitle}</a></div>

                </div>
            )
            
        }


        return (
            <div>
                <div>Other links:</div>
                <div>

                    <ul>
                        {this.props.additional_urls.map((additional_url,index) => (
                            <li key={index} >
                                <a target='_blank' rel="noreferrer" href={additional_url.url}>{additional_url.urlTitle}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}
