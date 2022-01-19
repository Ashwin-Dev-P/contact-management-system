import React, { Component } from 'react'
import Button from '../Button'

//CSS
import { Row, Col } from 'react-bootstrap'


import { getCookie } from '../../functions/getCookie';
import { Redirect } from 'react-router-dom';
import Modal from '../Modals/Modal'






export default class Settings extends Component {
    constructor(props) {

        super(props);

        this.handleClose = this.handleClose.bind(this);
        this.showModal = this.showModal.bind(this);
        this.logout = this.logout.bind(this);

        var loggedIn;
        if (getCookie("loggedIn")) {
            loggedIn = true;
        } else {
            loggedIn = false;
        }
        this.state = {
            loggedIn
        }
    }



    showModal() {
        this.setState({
            show: true,
        })
    }

    handleClose() {
        this.setState({
            show: false,
        })
    }

    logout() {
        this.setState({
            loggedIn: false,
        })
    }

    render() {


        if (!getCookie("loggedIn") || this.state.loggedIn !== true) {
            return <Redirect to="login" />
        }

        return (
            <div>
                <Row>
                    <Col md={2} lg={3}>
                    </Col>

                    <Col xs={12} md={8} lg={6} id='settingsForm' className='myBorder'>
                        <h2 className='myHeading'>Settings</h2>
                        <Button className="btn-danger" text='delete account permanently' onClick={this.showModal} id="delete_button" /><br />




                        <Modal show={this.state.show} handleClose={this.handleClose} logout={this.logout} >
                            <p>Modal</p>
                        </Modal>

                        <div id="info_div"></div>
                    </Col>

                </Row>

            </div>
        )
    }
}
