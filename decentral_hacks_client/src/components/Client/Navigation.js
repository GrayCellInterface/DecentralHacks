import axios from "axios";
import React, { useState, useEffect } from "react";
import { sha256 } from "js-sha256";
import brandLogo from "../../assets/images/Logo.png"
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import Login from "./components/Login/Login";

const postalCodes = require('postal-codes-js');

const Navigation = (props) => {
    const errorObj = {
        nameError: "Name should be atleast 5 characters long", //Below Name in Register
        emailError: "Invalid Email - Please use format abc@example.com", //Below Email in Register
        passwordError: "Password should be atleast 8 characters long", //Below Password in Register
        matchError: "Passwords do not match", //Below Confirm Password in Register
        otpError: "Your OTP should be a 6-digit number", //Below OTP
        postalError: "Invalid postalcode for selected country.",
        cityError: "This field should not be empty",
        addressError: "Your address is too short. It should be atleast 10 characters long.",
        districtError: "The district should be a 2-character long code"
    };

    const [openRegister, setOpenRegister] = useState(false);
    const [openVerify, setOpenVerify] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openStep2, setOpenStep2] = useState(false)
    const [errors, setErrors] = useState({});
    const [hasLoggedIn, setHasLoggedIn] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [loginValues, setLoginValues] = useState({
        email: "",
        password: "",
    });
    const [registerValues, setRegisterValues] = useState({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
    });
    const [verifyValues, setVerifyValues] = useState({
        otp: "",
    });
    const [collectRes, setCollectRes] = useState({
        name: "",
        email: "",
        password: "",
        hash: "",
    });
    const [billingValues, setBillingValues] = useState({
        country: "",
        city: "",
        district: "",
        address: "",
        postalcode: "",
    })

    let handlerObj;
    let errorHandlerObj = {
        nameError: "",
        emailError: "",
        passwordError: "",
        matchError: "",
        authError: "",
        otpError: "",
    };

    useEffect(() => {
        if (window.localStorage.getItem("email")) {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
        }

        if (authenticated) {
            setHasLoggedIn(true);
        } else {
            setHasLoggedIn(false);
        }
    }, [authenticated]);

    const clearInputs = () => {
        setLoginValues({
            email: "",
            password: "",
        });
        setRegisterValues({
            name: "",
            email: "",
            password: "",
            confirm_password: "",
        });
        setBillingValues({
            country: "",
            city: "",
            address: "",
            postalcode: "",
        })
        setVerifyValues({
            otp: "",
        });
        setErrors({})
    };

    //Handling Modal. Always open on Login Form
    const handleLoginModalClose = () => {
        props.handleCloseLoginModal()
        setOpenRegister(false);
        setOpenStep2(false);
        setOpenVerify(false);
        clearInputs();
    };

    const handleOpenRegister = () => {
        setErrors({});
        setOpenRegister(true);
    };

    const handleBackToLogin = (e) => {
        e.preventDefault();
        setErrors({});
        clearInputs();
        setOpenRegister(false);
        setOpenStep2(false);
        setOpenVerify(false);
        setOpenSuccess(false);
    };

    const handleBackToStep1 = () => {
        setOpenStep2(false);
    }

    const handleOpenSuccess = () => {
        setOpenSuccess(true);
    };

    //Handling Form Submission

    //Handle Registration
    const handleGoToStep2 = (e) => {
        e.preventDefault();
        const validEmail =
            /^(([^<>()[\].,;:\s@"]+(.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/;
        setErrors({});
        errorHandlerObj = {
            nameError: "",
            emailError: "",
            passwordError: "",
            matchError: "",
        };
        if (registerValues["name"].length < 5) {
            errorHandlerObj["nameError"] = errorObj["nameError"];
        }
        if (!validEmail.test(registerValues["email"])) {
            errorHandlerObj["emailError"] = errorObj["emailError"];
        }
        if (registerValues["password"].length < 8) {
            errorHandlerObj["passwordError"] = errorObj["passwordError"];
        }
        if (registerValues["password"] !== registerValues["confirm_password"]) {
            errorHandlerObj["matchError"] = errorObj["matchError"];
        }
        if (
            errorHandlerObj["nameError"] === "" &&
            errorHandlerObj["emailError"] === "" &&
            errorHandlerObj["passwordError"] === "" &&
            errorHandlerObj["matchError"] === ""
        ) {
            setOpenStep2(true);
        } else {
            setErrors({ ...errorHandlerObj });
            console.log("Registration Failed on Step 1");
            console.log(errorHandlerObj);
        }
    }


    const handleRegistration = (e) => {
        e.preventDefault();
        setErrors({});
        const validDistrict = /[A-Z]{2}/
        const validName = /^[a-zA-Z][a-zA-Z ]*$/
        errorHandlerObj = {
            postalError: "",
            cityError: "",
            addressError: "",
            districtError: "",
        };

        if (billingValues["city"].length === 0 || !validName.test(billingValues['city'])) {
            errorHandlerObj["cityError"] = errorObj["cityError"];
        }
        if (billingValues["address"].length < 10) {
            errorHandlerObj["addressError"] = errorObj["addressError"];
        }
        if (postalCodes.validate(billingValues["country"], billingValues["postalcode"]) !== true) {
            errorHandlerObj["postalError"] = errorObj["postalError"];
        }
        if (billingValues["country"] === "US" || billingValues["country"] === "CA") {
            if (!validDistrict.test(billingValues['district'])) {
                errorHandlerObj['districtError'] = errorObj['districtError']
            }
        }
        if (
            errorHandlerObj["cityError"] === "" &&
            errorHandlerObj["addressError"] === "" &&
            errorHandlerObj["postalError"] === "" &&
            errorHandlerObj["districtError"] === ""
        ) {
            console.log(registerValues);
            console.log(billingValues);
            const hashedPassword = sha256(registerValues["password"]);

            axios
                .post(`${process.env.REACT_APP_BACKEND_API}/auth/register`, {
                    email: `${registerValues["email"]}`,
                    name: `${registerValues["name"]}`,
                    password: `${hashedPassword}`,

                })
                .then((res) => {
                    if (res.data.msg === "Registered") {
                        console.log("Registration Successful", res.data.otp);
                        setErrors({});
                        clearInputs();
                        setCollectRes({
                            name: res.data.name,
                            email: res.data.email,
                            password: res.data.password,
                            hash: res.data.hash,
                            city: `${billingValues['city']}`,
                            country: `${billingValues['country']}`,
                            address: `${billingValues['address']}`,
                            district: `${billingValues['district']}`,
                            postalCode: `${billingValues['postalcode']}`
                        });
                        setOpenVerify(true);
                    } else {
                        errorHandlerObj["existingError"] = `${res.data.msg}`;
                        setErrors({ ...errorHandlerObj });
                        console.log("Registration Failed");
                    }
                })
                .catch((error) => {
                    console.log(error.response.data);
                    console.log("Registration Failed");
                });
        } else {
            setErrors({ ...errorHandlerObj });
            console.log("Registration Failed");
            console.log(errorHandlerObj);
        }
    };

    //Handle Email Verification
    const handleVerify = (e) => {
        e.preventDefault();
        errorHandlerObj = {
            otpError: "",
            verifyError: "",
        };
        const validOTP = /^\d{6}$/;
        if (!validOTP.test(verifyValues["otp"])) {
            errorHandlerObj["otpError"] = errorObj["otpError"];
        }
        if (errorHandlerObj["otpError"] === "") {
            console.log(collectRes);
            console.log(verifyValues["otp"]);
            axios
                .post(`${process.env.REACT_APP_BACKEND_API}/auth/register-verified`, {
                    email: `${collectRes["email"]}`,
                    name: `${collectRes["name"]}`,
                    password: `${collectRes["password"]}`,
                    hash: `${collectRes["hash"]}`,
                    otp: `${verifyValues["otp"]}`,
                    city: `${collectRes['city']}`,
                    country: `${collectRes['country']}`,
                    address: `${collectRes['address']}`,
                    district: `${collectRes['district']}`,
                    postalCode: `${collectRes['postalCode']}`
                })
                .then((res) => {
                    if (res.data.msg === "Verified Success") {
                        console.log("Verification Successful");
                        handleOpenSuccess();
                        clearInputs();
                        setErrors({});
                    } else {
                        errorHandlerObj["verifyError"] = `${res.data.msg}`;
                        setErrors({ ...errorHandlerObj });
                        console.log("Verification Failed");
                    }
                })
                .catch((error) => {
                    console.log(error.response.data);
                    console.log("Verification Failed");
                });
        } else {
            setErrors({ ...errorHandlerObj });
            console.log("Verification Failed");
            console.log(errorHandlerObj);
        }
    };

    //Handle Login
    const handleLogin = (e) => {
        e.preventDefault();
        const validEmail =
            /^(([^<>()[\].,;:\s@"]+(.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/;
        errorHandlerObj = {
            nameError: "",
            emailError: "",
            passwordError: "",
            matchError: "",
            authError: "",
            otpError: "",
        };

        if (!validEmail.test(loginValues["email"])) {
            errorHandlerObj["emailError"] = errorObj["emailError"];
        }
        if (loginValues["password"].length < 8) {
            errorHandlerObj["passwordError"] = errorObj["passwordError"];
        }

        if (
            errorHandlerObj["emailError"] === "" &&
            errorHandlerObj["passwordError"] === ""
        ) {
            const hashedPassword = sha256(loginValues["password"]);
            console.log(hashedPassword)
            axios
                .post(`${process.env.REACT_APP_BACKEND_API}/auth/login`, {
                    email: `${loginValues["email"]}`,
                    password: `${hashedPassword}`,
                })
                .then((res) => {
                    if (res.data.msg === "Logged In") {
                        console.log("Login Successful");
                        setHasLoggedIn(true);
                        setErrors({});
                        window.localStorage.setItem('balance', res.data.balance);
                        window.localStorage.setItem("email", res.data.email);
                        window.localStorage.setItem("address", res.data.address);
                        window.localStorage.setItem("username", res.data.name);
                        handleLoginModalClose();
                        window.location.href = `${props.url}/profile`;
                    } else {
                        errorHandlerObj["authError"] = `${res.data.msg}`;
                        setErrors({ ...errorHandlerObj });
                        console.log("Login Failed");
                    }
                })
                .catch((error) => {
                    console.log(error.response.data);
                    console.log("Login Failed");
                });
        } else {
            setErrors({ ...errorHandlerObj });
            console.log("Login Failed");
            // console.log(errorHandlerObj)
        }
    };

    //Handle Logout
    const handleLogout = () => {
        window.localStorage.removeItem("email");
        window.localStorage.removeItem("walletId");
        window.localStorage.removeItem("address");
        window.localStorage.removeItem("publicKey");
        window.localStorage.removeItem("publicKeyExpiry");
        window.localStorage.removeItem("username")
        setHasLoggedIn(false);
        window.location.href = `${props.url}`;
    };

    //Change Handlers
    const handleLoginChange = (selectedInput) => (e) => {
        handlerObj = { ...loginValues };
        handlerObj[selectedInput] = e.target.value;
        setLoginValues({ ...handlerObj });
    };

    const handleRegisterChange = (selectedInput) => (e) => {
        handlerObj = { ...registerValues };
        handlerObj[selectedInput] = e.target.value;
        setRegisterValues({ ...handlerObj });
    };

    const handleVerifyChange = (selectedInput) => (e) => {
        handlerObj = { ...verifyValues };
        handlerObj[selectedInput] = e.target.value;
        setVerifyValues({ ...handlerObj });
    };

    const handleBillingChange = (selectedInput) => (e) => {
        handlerObj = { ...billingValues };

        if (selectedInput === "district") {
            handlerObj[selectedInput] = (e.target.value).toUpperCase();
        } else {
            handlerObj[selectedInput] = e.target.value;
        }
        setBillingValues({ ...handlerObj });
    }

    const handleCountrySelection = (e) => {
        handlerObj = { ...billingValues };
        handlerObj["country"] = e.target.value;
        setBillingValues({ ...handlerObj })
    };

    //Change Login/Register to My Account
    const renderNavContent = () => {
        if (hasLoggedIn) {
            return (
                <NavDropdown title="My Account" id="basic-nav-dropdown">
                    <NavDropdown.Item href={`${props.url}/profile`} >Profile</NavDropdown.Item>
                    <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
            );
        } else {
            return <Nav.Link onClick={props.handleLoginModalOpen}>Login/Register</Nav.Link>;
        }
    };

    return (
        <>
            <Navbar bg="light" variant="light" expand="lg">
                <Container>
                    <Navbar.Brand href={`${props.url}`}>
                        <img src={brandLogo} alt="logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse
                        id="basic-navbar-nav"
                        className="justify-content-end"
                    >
                        <Nav className="justify-content-end">
                            <Nav.Link href={`${props.url}`}>Home</Nav.Link>
                            <Nav.Link href={`${props.url}/shop`}>Shop</Nav.Link>
                            {renderNavContent()}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Login
                handleLoginModalOpen={props.handleLoginModalOpen}
                handleLoginModalClose={handleLoginModalClose}
                handleOpenRegister={handleOpenRegister}
                handleBackToLogin={handleBackToLogin}
                handleLoginChange={handleLoginChange}
                handleVerifyChange={handleVerifyChange}
                handleRegisterChange={handleRegisterChange}
                handleRegistration={handleRegistration}
                handleGoToStep2={handleGoToStep2}
                handleBackToStep1={handleBackToStep1}
                handleBillingChange={handleBillingChange}
                handleCountrySelection={handleCountrySelection}
                handleVerify={handleVerify}
                handleLogin={handleLogin}
                openSuccess={openSuccess}
                openStep2={openStep2}
                loginValues={loginValues}
                registerValues={registerValues}
                billingValues={billingValues}
                verifyValues={verifyValues}
                openRegister={openRegister}
                openVerify={openVerify}
                errors={errors}
                loginModalOpen={props.loginModalOpen}
            />
        </>
    );
};

export default Navigation;
