import React, { Component } from 'react'
//import { flushSync } from 'react-dom';
import CollegeDetails from './CollegeDetails';
import Company from './Company';
import School from './School';

//Config
//import { config } from "../../config.js";
//const configData = config();
//const domain_url = configData.EXPRESS_JS_SERVER_URL

export default class AccountType extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            colleges: null,
            college: false,
            private_organisation: false,
            school: false,
        }

        this.handleChange = this.handleChange.bind()

    }

    async componentDidMount() {
        if (this.props.ids !== undefined && this.props.ids_list !== undefined) {
            this.setState({
                loading: false,
            })
        }
        else {
            this.setState({
                loading: true,
            })
        }
    }






    //To update the options in the account type from the props received
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (this.props.ids !== undefined) {


                this.setState({

                    ids: this.props.ids,
                    college_id_type: this.props.ids.college_id_type,
                    private_organisation_type_id: this.props.ids.private_organisation_type_id,
                    school_type_id: this.props.ids.school_type_id,
                    loading: false,


                });
            }

        }
    }


    //Show additional options depending upon the account type selected
    handleChange = (e) => {

        var account_type = document.getElementById('account_type').value;



        if (account_type === this.state.college_id_type) {
            this.setState({

                college_account: true,
                private_organisation: false,
                school: false,
            })
        }
        else if (account_type === this.state.private_organisation_type_id) {
            this.setState({

                college_account: false,
                private_organisation: true,
                school: false,
            })
        }
        else if (account_type === this.state.school_type_id) {
            this.setState({

                college_account: false,
                private_organisation: false,
                school: true,
            })
        }
        else {

            this.setState({

                college_account: false,
                private_organisation: false,
                school: false,
            })
        }
    }




    render() {
        //If props not loaded yet
        if (this.state.loading) {
            return <>

                <label htmlFor="account_type">account type:</label>
                <select className='form-control' name="account_type" id="account_type" defaultValue="none" onChange={e => this.handleChange(e)} >

                    <option value="none" disabled hidden>
                        Select an Option
                    </option>
                    <option disabled >Loading options...</option>



                </select>

            </>
        }







        return (

            <div>


                <label htmlFor="account_type">account type:</label>
                <select name="account_type" id="account_type" defaultValue="none" onChange={e => this.handleChange(e)} >
                    <option value="none" disabled hidden>
                        Select an Option
                    </option>

                    {this.props.ids_list && this.props.ids_list.map((datum) => (
                        <option value={datum._id} key={datum._id} >{datum.name}</option>
                    ))}
                </select>

                {
                    this.state.college_account ?

                        <> <CollegeDetails /> </>
                        : <></>
                }
                {
                    this.state.private_organisation ?

                        <Company />
                        : <></>
                }
                {
                    this.state.school ?

                        <> <School /></>
                        : <></>
                }


            </div>

        )


    }
}
