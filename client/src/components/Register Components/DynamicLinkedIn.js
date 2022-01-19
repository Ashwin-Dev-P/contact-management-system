import React, { Component } from 'react'
import Loading from "../Loading";
import Button from '../Button';

export default class DynamicLinkedIn extends Component {
    constructor(props) {
        super(props)

        var linkedIn;
        if (this.props.linkedIn === undefined || this.props.linkedIn.length === 0) {
            linkedIn = [""];

        }
        else {
            linkedIn = this.props.linkedIn;

        }
        this.state = {

            linkedIn: linkedIn
        }
    }

    //To update the linkedin from the props received
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (this.props.linkedIn !== undefined) {

                var linkedIn;
                if (this.props.linkedIn === undefined || this.props.linkedIn.length === 0) {
                    linkedIn = [""];

                }
                else {
                    linkedIn = this.props.linkedIn;

                }

                this.setState({

                    linkedIn: linkedIn,
                    loading: false,


                });

            }

        }
    }


    handleChange(i, e) {

        var linkedIn = this.state.linkedIn;

        linkedIn[i] = e.target.value;
        this.setState({
            linkedIn: linkedIn
        })
        this.props.setLinkedIn(linkedIn);


    }

    addFormFields() {
        var linkedIn = this.state.linkedIn;
        linkedIn.push("")

        this.setState({
            linkedIn: linkedIn
        })

    }

    removeFormFields(i) {

        var linkedIn = this.state.linkedIn;
        linkedIn.splice(i, 1);
        this.setState({
            linkedIn: linkedIn
        })

    }


    render() {
        return (
            <div>
                <h3>LinkedIn</h3>
                <div>
                    {this.state.loading === true ? <><Loading /> </> :
                        <>
                            {this.state.linkedIn ?
                                <>
                                    {this.state.linkedIn.map((linkedIn, index) => (
                                        <div key={index} className='mt-3'>
                                            <label htmlFor={`linkedIn${index}`}>linkedIn{index + 1 > 1 ? index + 1 : ''}:</label>
                                            <input className="form-control" type='url' id={`linkedIn${index}`} value={linkedIn || ""} onChange={e => this.handleChange(index, e)} autoComplete='on' />
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
