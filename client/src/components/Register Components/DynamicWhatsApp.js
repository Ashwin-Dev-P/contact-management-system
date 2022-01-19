import React, { Component } from 'react'
import Loading from '../Loading';
import Button from '../Button';

export default class DynamicWhatsApp extends Component {
    constructor(props) {
        super(props)

        this.addFormFields = this.addFormFields.bind(this);
        this.removeFormFields = this.removeFormFields.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);

        var numbers;
        if (this.props.numbers === undefined || this.props.numbers.length === 0) {
            numbers = [{ country_code: "", number: "" }];
        } else {
            numbers = this.props.numbers;

        }

        this.state = {
            //loading: true
            numbers: numbers  //this.props.numbers || [""]

        }
    }

    //To update the emails from the props received
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (this.props.numbers !== undefined) {
                var numbers;
                if (this.props.numbers === undefined || this.props.numbers.length === 0) {
                    numbers = [{ country_code: "", number: "" }];
                } else {
                    numbers = this.props.numbers;

                }
                this.setState({

                    numbers: numbers,//this.props.numbers,
                    loading: false,


                });

            }

        }
    }

    //Dynamic
    handleChange2 = (i, e) => {

        var numberArray = this.state.numbers;

        numberArray[i].country_code = e.target.value;

        this.setState({
            numbers: numberArray
        })

        this.props.setWhatsApp(numberArray);


    }

    handleChange = (i, e) => {

        var numberArray = this.state.numbers;

        numberArray[i].number = e.target.value;

        this.setState({
            numbers: numberArray
        })

        this.props.setWhatsApp(numberArray);


    }

    addFormFields() {
        var numberArray = this.state.numbers;
        numberArray.push({ country_code: "", number: "" })

        this.setState({
            numbers: numberArray
        })

    }

    removeFormFields(i) {

        var numberArray = this.state.numbers;
        numberArray.splice(i, 1);
        this.setState({
            numbers: numberArray
        })

    }

    render() {


        if (this.state.numbers === undefined) {
            this.setState({
                loading: true
            });
        }

        return (

            <div>
                <h3>WhatsApp</h3>
                {this.state.loading === true ? <Loading /> :

                    <>

                        <div>
                            {this.state.numbers
                                ?
                                <>

                                    {
                                        this.state.numbers.map((contact_number, index) => (
                                            <div key={index}>
                                                <div>
                                                    <label htmlFor={`whatsAppCountryCode${index}`}>country code{index + 1 > 1 ? index + 1 : ''}:</label>
                                                    <input className="form-control" type="number" name="number" value={contact_number.country_code || ""} id={`whatsAppCountryCode${index}`} onChange={e => this.handleChange2(index, e)} autoComplete="on" min='0' />
                                                </div>

                                                <div>
                                                    <label htmlFor={`whatsAppNumber${index}`}>number{index + 1 > 1 ? index + 1 : ''}:</label>
                                                    <input className="form-control" type="number" name="number" value={contact_number.number || ""} id={`whatsAppNumber${index}`} onChange={e => this.handleChange(index, e)} autoComplete="on" min='10000' max='9999999999999' />
                                                </div>
                                                {
                                                    index ?
                                                        <><button type="button" className="button remove btn btn-danger mt-2" onClick={() => this.removeFormFields(index)}>Remove</button> </>
                                                        : null
                                                }
                                                <br /><br />

                                            </div>
                                        ))
                                    }


                                    <div className='text-center mt-3'><Button className='btn btn-primary' type="button" text="Add additional whatsApp number" onClick={() => this.addFormFields()}></Button></div>


                                </>
                                :
                                null
                            }
                        </div>
                    </>
                }
            </div>

        )
    }
}
