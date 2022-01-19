import React, { Component } from 'react'
import Loading from "../Loading";
import Button from '../Button';

export default class DynamicFacebook extends Component {

    constructor(props) {
        super(props)

        var facebook;
        if (this.props.facebook === undefined || this.props.facebook.length === 0) {
            facebook = [""];

        }
        else {
            facebook = this.props.facebook;

        }
        this.state = {

            facebook: facebook
        }
    }

    //To update the linkedin from the props received
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (this.props.facebook !== undefined) {

                var facebook;
                if (this.props.facebook === undefined || this.props.facebook.length === 0) {
                    facebook = [""];

                }
                else {
                    facebook = this.props.facebook;

                }

                this.setState({

                    facebook: facebook,
                    loading: false,


                });

            }

        }
    }

    handleChange(i, e) {

        var facebook = this.state.facebook;

        facebook[i] = e.target.value;
        this.setState({
            facebook: facebook
        })
        this.props.setFacebook(facebook);


    }

    addFormFields() {
        var facebook = this.state.facebook;
        facebook.push("")

        this.setState({
            facebook: facebook
        })

    }

    removeFormFields(i) {

        var facebook = this.state.facebook;
        facebook.splice(i, 1);
        this.setState({
            facebook: facebook
        })

    }

    render() {

        return (
            <div>
                <h3>Facebook</h3>
                <div>
                    {this.state.loading === true ? <><Loading /> </> :
                        <>
                            {this.state.facebook ?
                                <>
                                    {this.state.facebook.map((facebook, index) => (
                                        <div key={index} className='mt-3'>
                                            <label htmlFor={`facebook${index}`}>Facebook{index + 1 > 1 ? index + 1 : ''}:</label>
                                            <input className="form-control" type='url' id={`facebook${index}`} value={facebook || ""} onChange={e => this.handleChange(index, e)} autoComplete='on' />
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
