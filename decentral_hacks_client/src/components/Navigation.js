// import axios from 'axios';
import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import Login from "./Login/Login";

// var CryptoJS = require("crypto-js");

const Navigation = () => {

    const errorObj = {
        'nameError': 'Name should be atleast 5 characters long',//Below Name in Register
        'emailError': 'Invalid Email - Please use format abc@example.com', //Below Email in Register
        'passwordError': 'Password should be atleast 8 characters long', //Below Password in Register
        'matchError': 'Passwords do not match', //Below Confirm Password in Register
        'authEmailError': 'This email does not exist', //Below Email Input in Login
        'authPasswordError': 'Wrong Password', //Below Password Input in Login
        'existingError': 'Email already exists', //Near Button in Register
        'serverError': 'Server Error' //Near Button in both
    }

    const [openRegister, setOpenRegister] = useState(false)
    const [errors, setErrors] = useState({})
    const [hasLoggedIn, setHasLoggedIn] = useState(false)
    const [authenticated, setAuthenticated] = useState(false)
    const [loginModalOpen, setLoginModalOpen] = useState(false)
    const [loginValues, setLoginValues] = useState({
        'email': "",
        'password': ""
    })
    const [registerValues, setRegisterValues] = useState({
        'name': "",
        'email': "",
        'password': "",
        'confirm_password': ""
    })

    let handlerObj;
    let errorHandlerObj = {
        'nameError': "",
        'emailError': "",
        'passwordError': "",
        'matchError': "",
        'authEmailError': "",
        'authPasswordError': "",
        'existingError': "",
        'serverError': ""
    };

    useEffect(() => {

        //Write logic to Authenticate - External file auth.js
        setAuthenticated(false)

        if (authenticated) {
            setHasLoggedIn(true)
        } else {
            setHasLoggedIn(false)
        }

    }, [])

    //Handling Modal. Always open on Login Form
    const handleLoginModalOpen = () => {
        setLoginModalOpen(true)
    }

    const handleLoginModalClose = () => {
        setLoginModalOpen(false)
        setOpenRegister(false)
    }

    const handleOpenRegister = () => {
        setOpenRegister(true);
    }

    const handleBackToLogin = (e) => {
        e.preventDefault()
        setOpenRegister(false);
    }

    //Handling Form Submission 
    const handleRegistration = (e) => {
        e.preventDefault()
        setErrors({})
        const validEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/
        errorHandlerObj = {
            'nameError': "",
            'emailError': "",
            'passwordError': "",
            'matchError': "",
            'authEmailError': "",
            'authPasswordError': "",
            'existingError': "",
            'serverError': ""
        }

        if (registerValues['name'].length < 5) {
            errorHandlerObj['nameError'] = errorObj['nameError']
        }
        if (!validEmail.test(registerValues['email'])) {
            errorHandlerObj['emailError'] = errorObj['emailError']
        }
        if (registerValues['password'].length < 8) {
            errorHandlerObj['passwordError'] = errorObj['passwordError']
        }
        if (registerValues['password'] !== registerValues['confirm_password']) {
            errorHandlerObj['matchError'] = errorObj['matchError']
        }
        if (
            errorHandlerObj['nameError'] === "" &&
            errorHandlerObj['emailError'] === "" &&
            errorHandlerObj['passwordError'] === "" &&
            errorHandlerObj['matchError'] === ""
        ) {
            //Hits '/register' endpoint of Backend API
            //Check for existing email and server error --> Registration Failed

            // const encryptedPassword = CryptoJS.AES.encrypt(registerValues['password'], 'raupCFlyLHPN7lHEwvcG3YWd4w4WNzg8').toString();
            // axios.post(`${process.env.REACT_APP_BACKEND_API}/register`, {
            //     name: `${registerValues['name']}`,
            //     email: `${registerValues['email']}`,
            //     password: `${encryptedPassword}`
            // }).then((res) => {
            //     console.log("Registration Successful") // in then
            //     //Go back to login
            //     setErrors({})
            //     handleBackToLogin(e)

            // }).catch((err) => {
            //     if(err === "existing user"){
            //         errorHandlerObj['existingError'] = errorObj['existingError']
            //     }else{
            //         errorHandlerObj['serverError'] = errorObj['serverError']
            //     }
            //     setErrors({ ...errorHandlerObj })
            //     console.log(errorHandlerObj)
            //     console.log("Registration Failed")
            // })

            //Dummy code for always successful registration on server end
            console.log("Registration Successful")
            setErrors({})
            handleBackToLogin(e)

        } else {
            setErrors({ ...errorHandlerObj })
            console.log("Registration Failed")
            console.log(errorHandlerObj)
        }
    }

    const handleLogin = (e) => {
        e.preventDefault()
        setErrors()
        const validEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/
        errorHandlerObj = {
            'nameError': "",
            'emailError': "",
            'passwordError': "",
            'matchError': "",
            'authEmailError': "",
            'authPasswordError': "",
            'existingError': "",
            'serverError': ""
        }

        if (!validEmail.test(loginValues['email'])) {
            errorHandlerObj['emailError'] = errorObj['emailError']
        }
        if (loginValues['password'].length < 8) {
            errorHandlerObj['passwordError'] = errorObj['passwordError']
        }

        if (
            errorHandlerObj['emailError'] === "" &&
            errorHandlerObj['passwordError'] === ""
        ) {
            //Hits '/login' endpoint of Backend API
            //Check for non-existing email, wrong password and server error --> Registration Failed

            // const encryptedPassword = CryptoJS.AES.encrypt(loginValues['password'], 'raupCFlyLHPN7lHEwvcG3YWd4w4WNzg8').toString();
            // axios.post(`${process.env.REACT_APP_BACKEND_API}/login`, {
            //     email: `${registerValues['email']}`,
            //     password: `${encryptedPassword}`
            // }).then((res) => {
            //     console.log("Login Successful") // in then
            //     setHasLoggedIn(true)     
            //     setErrors({})
            //     handleLoginModalClose()
            // }).catch((err) => {
            //     if(err === "Nonexisting email"){
            //         errorHandlerObj['authEmailError'] = errorObj['authEmailError']
            //     }
            //     else if(err === "Invalid Password"){
            //         errorHandlerObj['authPasswordError'] = errorObj['authPasswordError']
            //     }else{
            //         errorHandlerObj['serverError'] = errorObj['serverError']
            //     }
            //     setErrors({ ...errorHandlerObj })
            //     console.log(errorHandlerObj)
            //     console.log("Login Failed")
            // })

            //Dummy code for always successful login on server end
            console.log("Login Successful") // in then
            //CloseModal
            setHasLoggedIn(true)
            handleLoginModalClose()
            setErrors({})


        } else {
            setErrors({ ...errorHandlerObj })
            console.log("Login Failed")
            console.log(errorHandlerObj)
        }

    }

    const handleLogout = () => {
        //Hits '/logout' endpoint of Backend API

        // axios.get(`${process.env.REACT_APP_BACKEND_API}/logout`).then((res) => {
        //     setHasLoggedIn(false)

        // }).catch((error) => {
        //     console.error(error.response)
        // })

        //Dummy code for always successful logout on server end
        setHasLoggedIn(false)

    }

    //Change Handlers
    const handleLoginChange = (selectedInput) => (e) => {
        handlerObj = { ...loginValues }
        handlerObj[selectedInput] = e.target.value
        setLoginValues({ ...handlerObj })
    }

    const handleRegisterChange = (selectedInput) => (e) => {
        handlerObj = { ...registerValues }
        handlerObj[selectedInput] = e.target.value
        setRegisterValues({ ...handlerObj })
    }

    //Change Login/Register to My Account
    const renderNavContent = () => {
        if (hasLoggedIn) {
            return (
                <Nav.Item as="li">
                    <NavDropdown title="My Account" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                        <NavDropdown.Item onClick={handleLogout} >Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav.Item>
            )
        } else {
            return (
                <Nav.Item as="li">
                    <Nav.Link onClick={handleLoginModalOpen} >Login/Register</Nav.Link>
                </Nav.Item>
            )
        }
    }

    return (
        <>
            <Navbar bg="light" variant="light">
                <Container>
                    <Navbar.Brand href="/">Grey Cell Interface</Navbar.Brand>
                    <Nav className="justify-content-end" as="ul">
                        <Nav.Item as="li">
                            <Nav.Link href="/">Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                            <Nav.Link href="/shop">Shop</Nav.Link>
                        </Nav.Item>
                        {renderNavContent()}
                    </Nav>
                </Container>
            </Navbar>
            <Login
                handleLoginModalOpen={handleLoginModalOpen}
                handleLoginModalClose={handleLoginModalClose}
                handleOpenRegister={handleOpenRegister}
                handleBackToLogin={handleBackToLogin}
                handleLoginChange={handleLoginChange}
                openRegister={openRegister}
                errors={errors}
                loginValues={loginValues}
                handleRegisterChange={handleRegisterChange}
                registerValues={registerValues}
                handleRegistration={handleRegistration}
                handleLogin={handleLogin}
                loginModalOpen={loginModalOpen}
            />
        </>
    )
}

export default Navigation;