import React, { useEffect } from "react";
import { Modal, Form, Button } from 'react-bootstrap';
import './css/Login.css'

const Login = (props) => {

    const renderModalContent = () => {
        if (props.openRegister) {
            return (
                <>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Name</Form.Label>
                            <Form.Control value={props.registerValues['name']} onChange={props.handleRegisterChange('name')} placeholder="Enter your name" />
                            {props.errors['nameError'] === "" ? <></> : <div className='error-msg'>{props.errors['nameError']}</div>}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control value={props.registerValues['email']} onChange={props.handleRegisterChange('email')} type="email" placeholder="Enter your email" />
                            {props.errors['emailError'] === "" ? <></> : <div className='error-msg'>{props.errors['emailError']}</div>}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control value={props.registerValues['password']} onChange={props.handleRegisterChange('password')} type="password" placeholder="Enter Password" />
                            {props.errors['passwordError'] === "" ? <></> : <div className='error-msg'>{props.errors['passwordError']}</div>}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control value={props.registerValues['confirm_password']} onChange={props.handleRegisterChange('confirm_password')} type="password" placeholder="Confirm Password" />
                            {props.errors['matchError'] === "" ? <></> : <div className='error-msg'>{props.errors['matchError']}</div>}
                        </Form.Group>
                        <Button variant="primary" type="submit" style={{ float: 'left' }} onClick={props.handleRegistration}>
                            Register
                        </Button>
                        <Button variant="primary" style={{ float: 'right' }} onClick={props.handleBackToLogin}>
                            Back
                        </Button>
                        {
                            props.errors['serverError'] === ""
                                ? (
                                    props.errors['existingError'] === ""
                                        ? <></>
                                        : <div className='error-msg'>{props.errors['existingError']}</div>
                                )
                                : <div className='error-msg'>{props.errors['serverError']}</div>
                        }
                    </Form>
                </>
            )
        } else {
            return (
                <>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" value={props.loginValues['email']} onChange={props.handleLoginChange('email')} placeholder="Enter email" />
                            {props.errors['emailError'] === "" ? <></> : <div className='error-msg'>{props.errors['emailError']}</div>}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={props.loginValues['password']} onChange={props.handleLoginChange('password')} placeholder="Password" />
                            {props.errors['passwordError'] === "" ? <></> : <div className='error-msg'>{props.errors['passwordError']}</div>}
                        </Form.Group>
                        <Button variant="primary" type="submit" onClick={props.handleLogin}>
                            Login
                        </Button>
                        {
                            props.errors['serverError'] === ""
                                ? (
                                    props.errors['authEmailError'] === ""
                                        ? (
                                            props.errors['authPasswordError'] === ""
                                                ? <></>
                                                : <span className='error-msg'>{props.errors['authPasswordError']}</span>
                                        )
                                        : <span className='error-msg'>{props.errors['authEmailError']}</span>
                                )
                                : <span className='error-msg'>{props.errors['serverError']}</span>
                        }
                        <Form.Text className="text-muted" style={{ display: 'block' }}>
                            Not a member? <a onClick={props.handleOpenRegister} href="#register">Register Here</a>
                        </Form.Text>
                    </Form>
                </>
            )

        }
    }

    return (
        <>
            <Modal
                show={props.loginModalOpen}
                onHide={props.handleLoginModalClose}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>{props.openRegister ? "REGISTER" : "LOGIN"}</Modal.Title>
                    <button className="float-right close-btn" onClick={props.handleLoginModalClose}>X</button>
                </Modal.Header>
                <Modal.Body>
                    {renderModalContent()}
                </Modal.Body>
            </Modal>

        </>
    )

}

export default Login;