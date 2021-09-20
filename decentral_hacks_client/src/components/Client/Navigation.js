import axios from "axios";
import React, { useState, useEffect } from "react";
import { sha256 } from "js-sha256";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import Login from "./components/Login/Login";

const Navigation = (props) => {
    const errorObj = {
        nameError: "Name should be atleast 5 characters long", //Below Name in Register
        emailError: "Invalid Email - Please use format abc@example.com", //Below Email in Register
        passwordError: "Password should be atleast 8 characters long", //Below Password in Register
        matchError: "Passwords do not match", //Below Confirm Password in Register
        otpError: "Your OTP should be a 6-digit number", //Below OTP
    };

    const [openRegister, setOpenRegister] = useState(false);
    const [openVerify, setOpenVerify] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [hasLoggedIn, setHasLoggedIn] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
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
        setVerifyValues({
            otp: "",
        });
        setErrors({})
    };

    //Handling Modal. Always open on Login Form
    const handleLoginModalOpen = () => {
        setLoginModalOpen(true);
    };

    const handleLoginModalClose = () => {
        setLoginModalOpen(false);
        setOpenRegister(false);
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
        setOpenRegister(false);
        setOpenVerify(false);
        setOpenSuccess(false);
    };

    const handleOpenSuccess = () => {
        setOpenSuccess(true);
    };

    //Handling Form Submission

    //Handle Registration
    const handleRegistration = (e) => {
        e.preventDefault();
        setErrors({});
        const validEmail =
            /^(([^<>()[\].,;:\s@"]+(.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/;
        errorHandlerObj = {
            nameError: "",
            emailError: "",
            passwordError: "",
            matchError: "",
            existingError: "",
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
                        window.localStorage.setItem("email", res.data.email);
                        window.localStorage.setItem("address", res.data.address);
                        window.localStorage.setItem("walletId", res.data.walletId);
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
            return <Nav.Link onClick={handleLoginModalOpen}>Login/Register</Nav.Link>;
        }
    };

    return (
        <>
            <Navbar bg="light" variant="light" expand="lg">
                <Container>
                    <Navbar.Brand href={`${props.url}`}>Grey Cell Interface</Navbar.Brand>
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
                handleLoginModalOpen={handleLoginModalOpen}
                handleLoginModalClose={handleLoginModalClose}
                handleOpenRegister={handleOpenRegister}
                handleBackToLogin={handleBackToLogin}
                handleLoginChange={handleLoginChange}
                handleVerifyChange={handleVerifyChange}
                handleRegisterChange={handleRegisterChange}
                handleRegistration={handleRegistration}
                handleVerify={handleVerify}
                handleLogin={handleLogin}
                openSuccess={openSuccess}
                loginValues={loginValues}
                registerValues={registerValues}
                verifyValues={verifyValues}
                openRegister={openRegister}
                openVerify={openVerify}
                errors={errors}
                loginModalOpen={loginModalOpen}
            />
        </>
    );
};

export default Navigation;
