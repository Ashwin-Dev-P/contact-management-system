import React, { Component } from 'react'
import axios from 'axios';

//Config
import { config } from "../../config";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL

export default class ClientDetails extends Component {

    constructor(props) {
        super(props)
    

        this.detect = this.detect.bind(this);
        this.state = {
            
        }
        

        
    }


    detect() {
        'use strict';
        
        var module = {
            options: [],
            header: [ navigator.userAgent, navigator.vendor, window.opera],
            dataos: [
                { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
                { name: 'Windows', value: 'Win', version: 'NT' },
                { name: 'iPhone', value: 'iPhone', version: 'OS' },
                { name: 'iPad', value: 'iPad', version: 'OS' },
                { name: 'Kindle', value: 'Silk', version: 'Silk' },
                { name: 'Android', value: 'Android', version: 'Android' },
                { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
                { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
                { name: 'Macintosh', value: 'Mac', version: 'OS X' },
                { name: 'Linux', value: 'Linux', version: 'rv' },
                { name: 'Palm', value: 'Palm', version: 'PalmOS' }
            ],
            databrowser: [
                { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
                { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
                { name: 'Safari', value: 'Safari', version: 'Version' },
                { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
                { name: 'Opera', value: 'Opera', version: 'Opera' },
                { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
                { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
            ],
            init: function () {
                var agent = this.header.join(' '),
                    os = this.matchItem(agent, this.dataos),
                    browser = this.matchItem(agent, this.databrowser);
                
                return { os: os, browser: browser };
            },
            matchItem: function (string, data) {
                var i = 0,
                    j = 0,
                    html = '',
                    regex,
                    regexv,
                    match,
                    matches,
                    version;
                
                for (i = 0; i < data.length; i += 1) {
                    regex = new RegExp(data[i].value, 'i');
                    match = regex.test(string);
                    if (match) {
                        regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
                        matches = string.match(regexv);
                        version = '';
                        if (matches) { if (matches[1]) { matches = matches[1]; } }
                        if (matches) {
                            matches = matches.split(/[._]+/);
                            for (j = 0; j < matches.length; j += 1) {
                                if (j === 0) {
                                    version += matches[j] + '.';
                                } else {
                                    version += matches[j];
                                }
                            }
                        } else {
                            version = '0';
                        }
                        return {
                            name: data[i].name,
                            version: parseFloat(version)
                        };
                    }
                }
                return { name: 'unknown', version: 0 };
            }
        };
        
        var e = module.init(),
            debug = '';
      


        const osName = e.os.name;
        const osVersion = e.os.version;
        const browserName = e.browser.name;
        const browserVersion = e.browser.version;

        const navigatorVendor = navigator.vendor;
        this.setState({
            osName: osName,
            osVersion: osVersion,
            browserName: browserName,
            browserVersion: browserVersion,
            navigatorVendor: navigatorVendor

        });
        


    }


    async componentDidMount(){
        await this.detect();
       


        //Post the ip data
        const postUrl = domain_url + "/api/clientDetails"

        //basic api authentication
        const username = process.env.REACT_APP_BASIC_AUTH_USERNAME ;
        const password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

        const headers = {
            'Content-Type': 'application/json',
            auth: {
                username: username ,
                password: password
            },
            //credentials: 'include',


            withCredentials: true,
        }

        const form_data = {
            
            osName: this.state.osName,
            osVersion: this.state.osVersion,
            browserName: this.state.browserName,
            browserVersion: this.state.browserVersion,
            navigatorUserAgent: this.state.navigatorUserAgent,
            navigatorVendor: this.state.navigatorVendor
        }
       
        axios.post(postUrl,form_data ,headers)
        .then(response => {
            console.log("");
        })
        .catch(error => {
            console.log("")
        })


        
    }


    render() {
        return (
            <></>
        )
    }
}
