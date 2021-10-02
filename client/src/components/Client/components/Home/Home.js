import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import * as FaIcons from "react-icons/fa";
import { Container, Row, Col, Card } from "react-bootstrap";
import banner from "../../../../assets/images/landingpage/banner.png";
import creditdebit from "../../../../assets/images/landingpage/credit-debit.jpeg";
import transactions from "../../../../assets/images/landingpage/transactions.jpeg";
import seller from "../../../../assets/images/landingpage/seller.jpeg";
import ReactTypingEffect from "react-typing-effect";

import "./css/Home.css";
const Home = () => {
	useEffect(() => {
		AOS.init({
			duration: 2000,
		});
	}, []);
	return (
		<>
			{/* Section 1 */}
			<div className="banner">
				<Container style={{ marginTop: "80px", height: "700px" }}>
					<Row>
						<Col lg={6}>
							<div
								className="text"
								style={{ marginLeft: "70px", marginTop: "-50px" }}
							>
								<h1>
									<strong>Down in the lockdown?</strong>
								</h1>
								<h3>Meet your new retail therapist!</h3>
								<ReactTypingEffect
									text="Faster. Smoother. Cooler."
									cursorRenderer={(cursor) => (
										<h3
											style={{
												marginLeft: "-20px",
											}}
										>
											{cursor}
										</h3>
									)}
									displayTextRenderer={(text, i) => {
										return <h4>{text}</h4>;
									}}
									style={{ marginLeft: "0px" }}
								/>

								<br />
								<br />
								<button
									className="me-btn"
									style={{ float: "left", clear: "both" }}
									onClick={() => (window.location.href = "/client/shop")}
								>
									Shop Now
								</button>
							</div>
						</Col>
						<Col lg={6}>
							<img
								src={banner}
								style={{ width: "90%", marginTop: "20px" }}
								alt="banner"
								data-aos="fade-left"
							/>
						</Col>
					</Row>
				</Container>
			</div>

			{/* Section 2 */}
			<Container style={{ marginTop: "80px", marginBottom: "80px" }}>
				<h1
					className="text-center aos-item"
					style={{ marginBottom: "40px" }}
					data-aos="fade-up"
				>
					• Our Features •
				</h1>
				<Row>
					<Col>
						<Card
							style={{ width: "18rem", height: "400px", paddingTop: "40px" }}
						>
							<Card.Body>
								<div className="text-center">
									<FaIcons.FaSearchDollar className="icon" />
								</div>
								<br />
								<Card.Title className="text-center">Instant Refund</Card.Title>
								<br />
								<Card.Text className="text-center">
									Tired of calling customer care? No delivery? Heartbreak? We
									comfort you with instant refunds, no questions asked.
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card
							style={{ width: "18rem", height: "400px", paddingTop: "40px" }}
							className="card"
						>
							<Card.Body>
								<div className="text-center">
									<FaIcons.FaDollarSign className="icon" />
								</div>
								<br />
								<Card.Title className="text-center">
									Trace Transactions
								</Card.Title>
								<br />
								<Card.Text className="text-center">
									Want to know where your money goes? We've got you covered.
									Transactions made on the CryptoKart are available to the user
									anytime, anywhere.
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card
							style={{ width: "18rem", height: "400px", paddingTop: "40px" }}
							className="card"
						>
							<Card.Body>
								<div className="text-center">
									<FaIcons.FaLayerGroup className="icon" />
								</div>
								<br />
								<Card.Title className="text-center">Abstraction</Card.Title>
								<br />
								<Card.Text className="text-center">
									Want to jump on the Blockchain bandwagon, but finding it
									difficult? The feel of our unique web-wallet architecture
									makes shopping with crypto as easy as swiping your credit
									card.
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>

					<Col>
						<Card
							style={{ width: "18rem", height: "400px", paddingTop: "40px" }}
							className="card"
						>
							<Card.Body>
								<div className="text-center">
									<FaIcons.FaHandshake className="icon" />
								</div>
								<br />
								<Card.Title className="text-center">
									Instant Settlements
								</Card.Title>
								<br />
								<Card.Text className="text-center">
									Tired of pumping money into your business? We've got you
									covered too. With us your cash never stops flowing.
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>

			{/* Section 3 */}
			<div className="banner">
				<Container
					style={{
						marginTop: "80px",
						padding: "60px 0px 100px",
					}}
				>
					<h1
						className="text-center"
						style={{ marginBottom: "40px" }}
						data-aos="fade-up"
					>
						• Services We Offer •
					</h1>
					<Row>
						<Col lg={6}>
							<div className="text">
								<h3>Credit & Debit</h3>
								<p>
									To purchase any product from the Shop, we provide each
									customer with a crypto wallet. You can withdraw funds from
									your wallet straight into your bank account or add funds using
									your credit card on the go owing to the perfect blend of
									traditional finance and crypto currency provided by the Circle
									APIs
								</p>
							</div>
						</Col>
						<Col lg={6} style={{ overflow: "hidden" }}>
							<img
								src={creditdebit}
								style={{
									width: "500px",
									marginTop: "10px",
									float: "right",
								}}
								alt="banner"
								data-aos="fade-right"
							/>
						</Col>
					</Row>

					<Row>
						<Col lg={6} style={{ overflow: "hidden" }}>
							<img
								src={transactions}
								style={{ width: "500px", marginTop: "20px" }}
								alt="banner"
								data-aos="fade-left"
							/>
						</Col>
						<Col lg={6}>
							<div className="text">
								<h3>Get Transaction Records</h3>
								<p>
									Every transaction that you make on CryptoKart is automatically
									stored on the TRON Blockchain and can be viewed by the users
									on the profile page as well as trace it on the block explorer
									TRONSCAN. This makes each transcation on the website
									end-to-end without the risk of denial of payment of either
									parties.
								</p>
							</div>
						</Col>
					</Row>
					<Row>
						<Col lg={6}>
							<div className="text">
								<h3>Admin Dashboard</h3>
								<p>
									As a seller, we provide you with a dashboard where you can
									easily add, edit and delete products which will reflect in the
									shop instantly. You can also keep track and analyze all the
									orders that your customers place to strategize plans to
									improve sales
								</p>
							</div>
						</Col>
						<Col lg={6} style={{ overflow: "hidden" }}>
							<img
								src={seller}
								style={{ width: "700px", marginTop: "20px" }}
								alt="banner"
								data-aos="fade-right"
							/>
						</Col>
					</Row>
				</Container>
			</div>
			{/* Footer */}
		</>
	);
};

export default Home;
