import React, { Component } from 'react'

import Loading from '../Loading'
import Button from '../Button';




export default class EditContactDetails extends Component {
    constructor(props) {
        super(props)

        this.addFormFields = this.addFormFields.bind(this);
        this.removeFormFields = this.removeFormFields.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            loading: false,
            emails: this.props.emails || [""]

        }
    }

    componentDidMount() {
        if (this.props.emails !== undefined) {
            this.setState({
                loading: false
            })

        }
    }



    //To update the emails from the props received
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (this.props.emails !== undefined) {


                this.setState({

                    emails: this.props.emails,
                    loading: false,


                });

            }

        }
    }

    //Dynamic
    handleChange(i, e) {

        var emailArray = this.state.emails;
        emailArray[i] = e.target.value;
        this.setState({
            emails: emailArray
        })
        this.props.setEmail(emailArray);


    }

    addFormFields() {
        var emailArray = this.state.emails;
        emailArray.push("")

        this.setState({
            emails: emailArray
        })

    }

    removeFormFields(i) {

        var emailArray = this.state.emails;
        emailArray.splice(i, 1);
        this.setState({
            emails: emailArray
        })

    }






    render() {

        return (


            <div>
                <h3>Email</h3>
                {this.state.loading === true ? <Loading /> :

                    <>
                        <div>
                            {this.props.emails ?
                                <>
                                    {this.props.emails.map((email, index) => (
                                        <div key={index} className='mt-3'>

                                            <label htmlFor={`email${index}`}>email{index + 1 > 1 ? index + 1 : ''}:</label>
                                            <input className="form-control" type="text" name="email" value={email || ""} id={`email${index}`} onChange={e => this.handleChange(index, e)} autoComplete="on" />
                                            {
                                                index ?
                                                    <button type="button" className="button remove btn btn-danger mt-2" onClick={() => this.removeFormFields(index)}>Remove</button>
                                                    : null
                                            }
                                        </div>
                                    ))
                                    }
                                    <div className='text-center mt-3'><Button className='btn btn-primary' type="button" text="Add additional email" onClick={() => this.addFormFields()}></Button></div>
                                </>
                                :
                                <>

                                    {this.state.emails.map((email, index) => (
                                        <div key={index} className='mt-3'>

                                            <label htmlFor={`email${index}`}>email{index + 1 > 1 ? index + 1 : ''}:</label>
                                            <input className="form-control" type="text" name="email" value={email || ""} id={`email${index}`} onChange={e => this.handleChange(index, e)} autoComplete="on" />
                                            {
                                                index ?
                                                    <button type="button" className="button remove btn btn-danger mt-2" onClick={() => this.removeFormFields(index)}>Remove</button>
                                                    : null
                                            }
                                        </div>
                                    ))
                                    }
                                    <div className='text-center mt-3'><Button className='btn btn-primary' type="button" text="Add additional email" onClick={() => this.addFormFields()}></Button></div></>
                            }

                        </div>
                    </>
                }
            </div>

        )
    }
}
