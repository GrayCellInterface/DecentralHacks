import React, { Component } from 'react';
import brandLogo from "../../assets/images/logo.jpg";
import { FaGithub } from "react-icons/fa";
import './css/Footer.css';

class Footer extends Component {

    render() {
        return (
            <>
                <div className="me-footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="me-footer-block">
                                    <div className="me-logo">
                                        <a href="/"><img src={brandLogo} alt="logo" style={{ width: "150px", marginTop: "-30px" }} className="img-fluid" /></a>
                                    </div>
                                    <ul>
                                        <li className="me-footer-emial">graycellinterface@gmail.com</li>
                                        <li>Powered By Gray Cell Interface.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="me-footer-block">
                                    <h4>Reach Out To Us</h4>
                                    <ul>
                                        <li><a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/sanchita-s-51393b182/">Sanchita Shirur</a></li>
                                        <li><a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/tarang-padia-b407591a0/">Tarang Padia</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="me-footer-block">
                                    <h4>Shop With Us</h4>
                                    <ul>
                                        <li><a href="/client/shop">Visit Shop</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="me-footer-block">
                                    <h4>View Source Code</h4>
                                    <ul className="me-footer-share">
                                        <li ><a target="_blank" rel="noreferrer" style={{ fontSize: "25px" }} href="https://github.com/GrayCellInterface/DecentralHacks"><FaGithub /></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="me-footer-copyright">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="me-copyright-block">
                                    <p>&copy; 2021 copyright all right reserved by <a href="/">cryptoKart</a></p>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="me-copyright-block">
                                    <ul>
                                        <li><a href="/">privacy policy</a></li>
                                        <li><a href="/">Terms & condition</a></li>
                                        <li><a href="/">faq</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Footer;