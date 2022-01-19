import React, { Component } from 'react'

export default class DynamicEmailInput extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            name : '',
            email : '',
            formValues: [{  email : "" }],
            contactNumbers: [{ number : "" , country_code : "" }]
            
        }

        
    }


    handleChange(i, e) {
        let formValues = this.state.formValues;
        formValues[i][e.target.name] = e.target.value;
        //formValues[i] = e.target.value;
        this.setState({ formValues });
    }

    addFormFields() {
        this.setState(({
            formValues: [...this.state.formValues, {  email: "" }]
        }))
    }

    removeFormFields(i) {
        let formValues = this.state.formValues;
        formValues.splice(i, 1);
        this.setState({ formValues });
    }

    /*
    handleSubmit(event) {
    event.preventDefault();
    alert(JSON.stringify(this.state.formValues));
    }
    */

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    render() {
        return (
            <div>
                <div>
                    {this.state.formValues.map((element, index) => (
                        <div  key={index}>
                            
                            <label htmlFor={`email${index}`}>email{index+1 > 1 ? index+1 : '' }:</label>
                            <input type="text" name="email" value={element.email || ""} id={`email${index}`} onChange={e => this.handleChange(index, e)} />
                            {
                                index ? 
                                <button type="button"  className="button remove" onClick={() => this.removeFormFields(index)}>Remove</button> 
                                : null
                            }
                        </div>
                        ))}
                    <button type="button" onClick={() => this.addFormFields()}>Add additional email</button>
                </div><br />
                
            </div>
        )
    }
}
