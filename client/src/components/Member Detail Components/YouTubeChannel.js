import React, { Component } from 'react'

export default class YouTubeChannel extends Component {
    render(props) {
        
        if( !this.props.youtube_channel_urls || this.props.youtube_channel_urls.length === 0){
            return (
                <div>
                    <div>Youtube Channel:</div>
                    <div>Not available</div>
                </div>
            )
            
        }

        if(this.props.youtube_channel_urls.length === 1){
            return (
                <div>
                    <div>Youtube Channel:</div>
                    <div><a target='_blank' rel="noreferrer" href={this.props.youtube_channel_urls[0]}>{this.props.youtube_channel_urls[0]}</a></div>

                </div>
            )
            
        }


        return (
            <div>
                <div>Youtube Channels:</div>
                <div>

                    <ul>
                        {this.props.youtube_channel_urls.map((youtube_channel_url,index) => (
                            <li key={index} >
                                <a target='_blank' rel="noreferrer" href={youtube_channel_url}>{youtube_channel_url}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}
