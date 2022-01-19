import React, { Component } from 'react'
import { Switch } from "react-router";
import HeaderAndMain from "./HeaderAndMain";

export default class GlobalComponent extends Component {
    constructor(props){
        super(props)
        this.state = {
            
            
        }
    }
    

    
    render() {
        return (

            <div>
                <HeaderAndMain />
            </div>
        )
    }
}
