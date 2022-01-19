import React, { Component } from 'react'
import Loading from '../Loading';
import Button from '../Button';

export default class DynamicTelegram extends Component {
    constructor(props) {
        super(props)

        var telegram;
        if (this.props.telegram === undefined || this.props.telegram.length === 0) {
            telegram = [
                {
                    username: "",
                    number: {
                        country_code: "",
                        number: ""
                    }

                }
            ];
        } else {
            telegram = this.props.telegram;

        }

        this.handleChange = this.handleChange.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.state = {
            telegram
        }
    }

    //To update the numbers from the props received
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (this.props.telegram !== undefined) {
                var telegram;
                if (this.props.telegram === undefined || this.props.telegram.length === 0) {
                    telegram = [
                        {
                            username: "",
                            number: {
                                country_code: "",
                                number: ""
                            }

                        }
                    ];
                } else {
                    telegram = this.props.telegram;

                }
                this.setState({

                    telegram,
                    loading: false


                });

            }

        }
    }

    addFormFields() {
        var telegram = this.state.telegram;
        telegram.push(
            {
                username: "",
                number: {
                    country_code: "",
                    number: ""
                }

            }
        )

        this.setState({
            telegram: telegram
        })

    }

    removeFormFields(i) {

        var telegram = this.state.telegram;
        telegram.splice(i, 1);
        this.setState({
            telegram: telegram
        })

    }

    handleChange(i, e) {

        var telegram = this.state.telegram;

        telegram[i].number.number = e.target.value;
        this.setState({
            telegram: telegram
        })
        this.props.setTelegram(telegram);


    }

    handleChange2(i, e) {

        var telegram = this.state.telegram;

        telegram[i].number.country_code = e.target.value;
        this.setState({
            telegram: telegram
        })
        this.props.setTelegram(telegram);


    }

    handleChange3(i, e) {

        var telegram = this.state.telegram;

        telegram[i].username = e.target.value;
        this.setState({
            telegram: telegram
        })
        this.props.setTelegram(telegram);


    }

    render() {

        if (this.state.telegram === undefined) {
            this.setState({
                loading: true
            });
        }


        return (
            <div>
                <h3>Telegram</h3>
                {this.state.loading === true ?
                    <><Loading /></>
                    :
                    <>
                        {this.state.telegram.map((telegram, index) => (
                            <div key={index} className='mt-3'>
                                <div>
                                    <label htmlFor={`telegramUsername${index}`} >Telegram username{index + 1 > 1 ? index + 1 : ''}</label>
                                    <input className="form-control" type='text' id={`telegramUsername${index}`} value={telegram.username || ""} onChange={e => this.handleChange3(index, e)} autoComplete="on" minLength='5' />
                                </div>
                                <div>
                                    <label htmlFor={`telegramCountryCode${index}`}>Country code{index + 1 > 1 ? index + 1 : ''}:</label>
                                    <input className="form-control" type="number" value={telegram.number.country_code || ""} id={`telegramCountryCode${index}`} onChange={e => this.handleChange2(index, e)} autoComplete="on" min='0' />
                                </div>

                                <div>
                                    <label htmlFor={`telegramNumber${index}`}>Telegram number{index + 1 > 1 ? index + 1 : ''}:</label>
                                    <input className="form-control" type="number" value={telegram.number.number || ""} id={`telegramNumber${index}`} onChange={e => this.handleChange(index, e)} autoComplete="on" min='10000' max='9999999999999' />
                                </div>

                                {
                                    index ?
                                        <>
                                            <button className="button remove btn btn-danger mt-2" type='button' onClick={() => this.removeFormFields(index)}>remove</button>
                                        </>
                                        : null
                                }
                                <br /><br />
                            </div>
                        ))}

                        <div className='text-center mt-3'><Button className='btn-primary' type="button" text="Add additional telegram" onClick={() => this.addFormFields()} /></div>
                    </>
                }
            </div>
        )
    }
}
