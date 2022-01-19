import React, { Component } from 'react'
import Button from '../Button';
import Loading from '../Loading'

export default class DynamicInstagram extends Component {
    constructor(props) {
        super(props)

        var instagrams;
        if (this.props.instagrams === undefined || this.props.instagrams.length === 0) {
            instagrams = [""];
        }
        else {
            instagrams = this.props.instagrams;
        }
        this.state = {
            //loading: true,
            instagrams: instagrams
        }
    }

    //To update the instagrams from the props received
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (this.props.instagrams !== undefined) {

                var instagrams;
                if (this.props.instagrams === undefined || this.props.instagrams.length === 0) {
                    instagrams = [""];
                }
                else {
                    instagrams = this.props.instagrams;
                }
                this.setState({

                    instagrams: instagrams,
                    loading: false,


                });

            }

        }
    }

    handleChange(i, e) {

        var instagrams = this.state.instagrams;

        instagrams[i] = e.target.value;
        this.setState({
            instagrams: instagrams
        })
        this.props.setInstagram(instagrams);


    }

    addFormFields() {
        var instagrams = this.state.instagrams;
        instagrams.push("")

        this.setState({
            instagrams: instagrams
        })

    }

    removeFormFields(i) {

        var instagrams = this.state.instagrams;
        instagrams.splice(i, 1);
        this.setState({
            instagrams: instagrams
        })

    }


    render() {
        if (this.state.instagrams === undefined) {
            this.setState({
                loading: true
            });
        }

        return (
            <div>
                <h3>Instagram</h3>
                <div>
                    {
                        this.state.loading ? <><Loading /> </>
                            :
                            <>
                                {this.state.instagrams ?
                                    <>

                                        {this.state.instagrams.map((instagram, index) => (
                                            <div key={index} className='mt-3'>
                                                <label htmlFor={`instagram${index}`} >username{index + 1 > 1 ? index + 1 : ''}:</label>
                                                <input className="form-control" type='text' name="instagram" id={`instagram${index}`} value={instagram || ""} onChange={e => this.handleChange(index, e)} autoComplete="on" maxLength='30' />
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
