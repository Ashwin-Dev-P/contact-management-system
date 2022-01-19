import React, { Component } from 'react'
import Instagram from './Instagram'
import Facebook from './Facebook'
import SnapChat from './SnapChat'
import YouTubeChannel from './YouTubeChannel'
import LinkedIn from './LinkedIn'
import WhatsApp from './WhatsApp'
import Telegram from './Telegram'
import Twitter from './Twitter'
import OtherSocialMedia from './OtherSocialMedia'

export default class SocialMedia extends Component {


    render() {
        return (
            <div>
                {this.props.social_media.whatsapp !== undefined ? 
                   <> <WhatsApp whatsapp={this.props.social_media.whatsapp} /><br /></>
                :<></>}
                
                {
                this.props.social_media.linkedin_url !== undefined ? 
                <><LinkedIn linkedin_urls={this.props.social_media.linkedin_url}  /><br /></>
                :
                <></>
                }

                {
                this.props.social_media.instagram_username !== undefined ? 
                <><Instagram instagram_usernames={this.props.social_media.instagram_username} /><br /></>
                :
                <></>
                }

                {
                    this.props.social_media.facebook_url !== undefined ?
                    <><Facebook  facebook_urls={this.props.social_media.facebook_url} /><br /></>
                    :
                    <></>
                }
                
                {
                    this.props.social_media.twitter_username !== undefined ?
                    <><Twitter twitter_usernames={this.props.social_media.twitter_username}   /> <br /></>
                    :
                    <></>
                }

                {
                    this.props.social_media.snapchat_username !== undefined ?
                    <><SnapChat snapchat_usernames={this.props.social_media.snapchat_username}  /><br /></>
                    :
                    <></>
                }

                {
                    this.props.social_media.youtube_channel_url !== undefined ?
                    <><YouTubeChannel youtube_channel_urls={this.props.social_media.youtube_channel_url}  /><br /></>
                    :
                    <></>
                }

                {
                    this.props.social_media.telegram !== undefined ?
                    <><Telegram telegram={this.props.social_media.telegram} /> <br/>  </>
                    :
                    <></>
                }

                {
                    this.props.social_media.additional_url !== undefined ?
                    <><OtherSocialMedia additional_urls={this.props.social_media.additional_url}  /></>
                    :
                    <></>
                }
                
                
                
                
                
                
            </div>
        )
    }
}
