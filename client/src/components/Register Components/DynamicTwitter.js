import React, { Component } from 'react'
import Button from '../Button';
import Loading from '../Loading'

export default class DynamicTwitter extends Component {

    constructor(props) {
        super(props)

        var twitter;
        if (this.props.twitter === undefined || this.props.twitter.length === 0) {
            twitter = [""];
        }
        else {
            twitter = this.props.twitter;
        }
        this.state = {
            //loading: true,
            twitter: twitter
        }
    }

    //To update the instagrams from the props received
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (this.props.twitter !== undefined) {

                var twitter;
                if (this.props.twitter === undefined || this.props.twitter.length === 0) {
                    twitter = [""];
                }
                else {
                    twitter = this.props.twitter;
                }
                this.setState({

                    twitter: twitter,
                    loading: false,


                });

            }

        }
    }


    handleChange(i, e) {

        var twitter = this.state.twitter;

        twitter[i] = e.target.value;
        this.setState({
            twitter: twitter
        })
        this.props.setTwitter(twitter);


    }

    addFormFields() {
        var twitter = this.state.twitter;
        twitter.push("")

        this.setState({
            twitter: twitter
        })

    }

    removeFormFields(i) {

        var twitter = this.state.twitter;
        twitter.splice(i, 1);
        this.setState({
            twitter: twitter
        })

    }

    render() {
        return (
            <div>
                <h3>Twitter</h3>
                <div>
                    {
                        this.state.loading ? <><Loading /> </>
                            :
                            <>
                                {this.state.twitter ?
                                    <>

                                        {this.state.twitter.map((twitter, index) => (
                                            <div key={index} className='mt-3'>
                                                <label htmlFor={`twitter${index}`} >username{index + 1 > 1 ? index + 1 : ''}:</label>
                                                <input className="form-control" type='text' id={`twitter${index}`} value={twitter || ""} onChange={e => this.handleChange(index, e)} autoComplete="on" maxLength='30' />
                                                {
                                                    index ?
                                                        <>
                                                            <button className="button remove btn btn-danger mt-2" type='button' onClick={() => this.removeFormFields(index)}>remove</button>
                                                        </>
                                                        : null
                                                }

                                            </div>

                                        ))}
                                    </>
                                    :
                                    null
                                }
                                <div className='text-center mt-3'><Button className='btn-primary' type="button" text="Add additional account" onClick={() => this.addFormFields()} /></div>
                            </>
                    }
                </div>
            </div>
        )
    }
}
