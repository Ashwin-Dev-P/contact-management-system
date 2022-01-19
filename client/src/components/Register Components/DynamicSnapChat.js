import React, { Component } from 'react'
import Button from '../Button';
import Loading from '../Loading'

export default class DynamicSnapChat extends Component {
    constructor(props) {
        super(props)

        var snapchat;
        if (this.props.snapchat === undefined || this.props.snapchat.length === 0) {
            snapchat = [""];
        }
        else {
            snapchat = this.props.snapchat;
        }
        this.state = {
            //loading: true,
            snapchat: snapchat
        }
    }

    //To update the snapchat from the props received
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (this.props.snapchat !== undefined) {

                var snapchat;
                if (this.props.snapchat === undefined || this.props.snapchat.length === 0) {
                    snapchat = [""];
                }
                else {
                    snapchat = this.props.snapchat;
                }
                this.setState({

                    snapchat: snapchat,
                    loading: false,


                });

            }

        }
    }


    handleChange(i, e) {

        var snapchat = this.state.snapchat;

        snapchat[i] = e.target.value;
        this.setState({
            snapchat: snapchat
        })
        this.props.setSnapChat(snapchat);


    }

    addFormFields() {
        var snapchat = this.state.snapchat;
        snapchat.push("")

        this.setState({
            snapchat: snapchat
        })

    }

    removeFormFields(i) {

        var snapchat = this.state.snapchat;
        snapchat.splice(i, 1);
        this.setState({
            snapchat: snapchat
        })

    }


    render() {
        if (this.state.snapchat === undefined) {
            this.setState({
                loading: true
            });
        }

        return (
            <div>
                <h3>Snapchat</h3>
                <div>
                    {
                        this.state.loading ? <><Loading /> </>
                            :
                            <>
                                {this.state.snapchat ?
                                    <>

                                        {this.state.snapchat.map((snapchat, index) => (
                                            <div key={index} className='mt-3'>
                                                <label htmlFor={`snapchat${index}`} >username{index + 1 > 1 ? index + 1 : ''}:</label>
                                                <input className="form-control" type='text' name="snapchat" id={`snapchat${index}`} value={snapchat || ""} onChange={e => this.handleChange(index, e)} autoComplete="on" maxLength='30' />
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
