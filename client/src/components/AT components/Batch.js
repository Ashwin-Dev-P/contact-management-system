import React, { Component } from 'react'
import Loading from '../Loading'

export default class Batch extends Component {

    state = {
        loading: true
    };

    async componentDidMount() {
        const current_year = new Date().getFullYear()

        this.setState({
            loading: false,
            current_year: current_year

        });

    }

    handleChange = (e) => {

        const starting_year_tag = document.getElementById('starting_year');

        const starting_year = starting_year_tag.value;
        const min_ending_year = starting_year;


        const ending_year_tag = document.getElementById('ending_year');

        ending_year_tag.setAttribute("min", min_ending_year)


    }

    render() {
        if (this.state.loading) {
            return <Loading />
        }

        return (
            <div>
                <div>Batch</div>
                <div>
                    <label htmlFor="starting_year">starting year:</label>
                    <input className='form-control' type='number' id='starting_year' min='1900' max={this.state.current_year} onChange={e => this.handleChange(e)} />

                    <br />

                    <label htmlFor="ending_year">ending year:</label>
                    <input className='form-control' type='number' id='ending_year' min='1900' onChange={e => this.handleChange(e)} />
                </div>
            </div>
        )
    }
}

//Api request on batch change to be added