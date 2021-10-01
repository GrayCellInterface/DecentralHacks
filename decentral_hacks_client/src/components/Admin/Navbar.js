import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import "./css/Navbar.css";
import { IconContext } from "react-icons";
import { Accordion } from "react-bootstrap";

function Navbar(props) {
	const [openSidebar, setOpenSidebar] = useState(false);
	const handleOpenSidebar = () => setOpenSidebar(!openSidebar);
	const handleLogout = () => {
		window.localStorage.removeItem("sellerAuth");
		window.location.href = "/admin";
	};

	return (
		<>
			<IconContext.Provider value={{ color: "#000" }}>
				<div className="navbar" style={{ marginBottom: -20 }}>
					<Link to="#" className="menu-bars" style={{ float: "left" }}>
						<FaIcons.FaBars
							onClick={handleOpenSidebar}
							className="hamburger-menu"
						/>
					</Link>
					{/* <h4 className="nav-title text-center">ADMIN DASHBOARD</h4> */}
				</div>
				<nav className={openSidebar ? "nav-menu active" : "nav-menu"}>
					<ul className="nav-menu-items">
						<li className="navbar-toggle">
							<Link to="#" className="menu-bars">
								<AiIcons.AiOutlineClose
									onClick={handleOpenSidebar}
									className="hamburger-menu"
								/>
							</Link>
						</li>
						{SidebarData.map((item, index) => {
							if (item.hasChildren) {
								return (
									<Accordion key={item.title}>
										<Accordion.Item eventKey="0" className="accordion-style">
											<Accordion.Header className={item.cName} >
												<IoIcons.IoIosPaper />
												<span>{item.title}</span>
											</Accordion.Header>
											<Accordion.Body>
												<ul>
													<li className={item.cName}>
														<Link
															to={`${props.url}/completed`}
															onClick={handleOpenSidebar}
														>
															<span>Completed</span>
														</Link>
													</li>

													<li className={item.cName}>
														<Link
															to={`${props.url}/pending`}
															onClick={handleOpenSidebar}
														>
															<span>Pending</span>
														</Link>
													</li>

													<li className={item.cName}>
														<Link
															to={`${props.url}/cancel`}
															onClick={handleOpenSidebar}
														>
															<span>Cancelled</span>
														</Link>
													</li>
												</ul>
											</Accordion.Body>
										</Accordion.Item>
									</Accordion>
								);
							} else {
								return (
									<li
										className={item.cName}
										onClick={handleOpenSidebar}
										key={item.title}
									>
										<Link to={`${props.url}${item.path}`}>
											{item.icon}
											<span>{item.title}</span>
										</Link>
									</li>
								);
							}
						})}
						<li className="nav-text" onClick={handleLogout}>
							<div className="logout-btn">
								<FaIcons.FaSignOutAlt />
								<span>Logout</span>
							</div>
						</li>
					</ul>
				</nav>
			</IconContext.Provider>
		</>
	);
}

export default Navbar;
