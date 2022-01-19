import React, { Component } from 'react'
import Loading from './Loading'

export default class Button extends Component {

    render() {
        return (
            <>
                <button className={`btn ${this.props.className}`} style={{ "width": "100%" }} type={this.props.type} id={this.props.id} name={this.props.name} onClick={this.props.onClick} disabled={this.props.disabled}   >

                    {this.props.loading === true ? <> <Loading /> </> : <>{this.props.text}</>}

                </button>
            </>
        )
    }
}
