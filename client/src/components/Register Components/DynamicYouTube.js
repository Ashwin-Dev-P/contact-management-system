import React, { Component } from 'react'
import Loading from "../Loading";
import Button from '../Button';

export default class DynamicYouTube extends Component {
    constructor(props) {
        super(props)

        var youtube;
        if (this.props.youtube === undefined || this.props.youtube.length === 0) {
            youtube = [""];

        }
        else {
            youtube = this.props.youtube;

        }
        this.state = {

            youtube: youtube
        }
    }

    //To update the linkedin from the props received
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (this.props.youtube !== undefined) {

                var youtube;
                if (this.props.youtube === undefined || this.props.youtube.length === 0) {
                    youtube = [""];

                }
                else {
                    youtube = this.props.youtube;

                }

                this.setState({

                    youtube: youtube,
                    loading: false,


                });

            }

        }
    }

    handleChange(i, e) {

        var youtube = this.state.youtube;

        youtube[i] = e.target.value;
        this.setState({
            youtube: youtube
        })
        this.props.setYouTube(youtube);


    }

    addFormFields() {
        var youtube = this.state.youtube;
        youtube.push("")

        this.setState({
            youtube: youtube
        })

    }

    removeFormFields(i) {

        var youtube = this.state.youtube;
        youtube.splice(i, 1);
        this.setState({
            youtube: youtube
        })

    }

    render() {
        return (
            <div>
                <h3>YouTube</h3>
                <div>
                    {this.state.loading === true ? <><Loading /> </> :
                        <>
                            {this.state.youtube ?
                                <>
                                    {this.state.youtube.map((youtube, index) => (
                                        <div key={index} className='mt-3'>
                                            <label htmlFor={`youtube${index}`}>youtube{index + 1 > 1 ? index + 1 : ''}:</label>
                                            <input className="form-control" type='url' id={`youtube${index}`} value={youtube || ""} onChange={e => this.handleChange(index, e)} autoComplete='on' />
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
                            <div className='text-center mt-3'><Button className='btn-primary' type="button" text="Add additional channel" onClick={() => this.addFormFields()} /></div>
                        </>
                    }
                </div>
            </div>
        )
    }
}
