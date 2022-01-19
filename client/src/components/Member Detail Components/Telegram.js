import React, { Component } from 'react'

export default class Telegram extends Component {
    render(props) {
        
        
        if( !this.props.telegram || this.props.telegram.length === 0){
            return (
                <div>
                    <div>Telegram:</div>
                    <div>Not available</div>
                </div>
            )
            
        }

        if(this.props.telegram.length === 1){
            return (
                <div>
                    <div>Telegram:</div>
                    <div>
                        {this.props.telegram[0].username ? 
                            <>
                                <div>username: <a target="_blank" rel="noreferrer" href={`https://telegram.me/${this.props.telegram[0].username}`}>{this.props.telegram[0].username}</a></div>

                            </>
                            :
                            null
                        }
                        
                        {this.props.telegram[0].number.country_code && this.props.telegram[0].number.number ? 
                            <>
                                <div>number: +{this.props.telegram[0].number.country_code} {this.props.telegram[0].number.number} </div>
                            </>
                            :
                            null
                        }
                        
                    </div>

                </div>
            )
            
        }

        return (
            <div>
                <div>Telegram</div>
                <div>
                    <ul>
                        {this.props.telegram.map((telegram,index) => (
                            <li key={index} >
                                <div>

                                    {telegram.username ? 
                                        <>
                                            <div>username: <a target="_blank" rel="noreferrer"  href={`https://telegram.me/${telegram.username}`}>{telegram.username}</a></div>
                                        </>
                                        :
                                        null
                                    }

                                    
                                    {telegram.number.country_code && telegram.number.number ? 
                                        <>
                                            <div>number: +{telegram.number.country_code} {telegram.number.number} </div>
                                        </>
                                        :
                                        null
                                    }
                                    
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}
