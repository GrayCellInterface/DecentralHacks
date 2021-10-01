import React from "react";
import * as FaIcons from "react-icons/fa";
import { Container, Row, Col, Card } from "react-bootstrap";
import banner from "../../../../assets/images/banner.png";

import "./css/Home.css";
const Home = () => {
	return (
		<>
			{/* Section 1 */}
			<div className="banner">
				<Container style={{ marginTop: "80px", height: "700px" }}>
					<Row>
						<Col>
							<div className="text-center">
								<h3>CryptoKart</h3>
							</div>
						</Col>
						<Col>
							<img
								src={banner}
								style={{ width: "600px", marginTop: "20px" }}
								alt="banner"
							/>
						</Col>
					</Row>
				</Container>
			</div>

			{/* Section 2 */}
			<Container style={{ marginTop: "80px", marginBottom: "60px" }}>
				<h1 className="text-center" style={{ marginBottom: "40px" }}>
					• Our Features •
				</h1>
				<Row>
					<Col>
						<Card style={{ width: "18rem", height: "400px" }} className="card">
							<Card.Body>
								<div className="text-center">
									<FaIcons.FaDollarSign className="icon" />
								</div>
								<Card.Title>Card Title</Card.Title>
								<Card.Text>
									Some quick example text to build on the card title and make up
									the bulk of the card's content.
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card style={{ width: "18rem", height: "400px" }} className="card">
							<Card.Body>
								<div className="text-center">
									<FaIcons.FaDollarSign className="icon" />
								</div>
								<Card.Title>Card Title</Card.Title>
								<Card.Text>
									Some quick example text to build on the card title and make up
									the bulk of the card's content.
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card style={{ width: "18rem", height: "400px" }} className="card">
							<Card.Body>
								<div className="text-center">
									<FaIcons.FaDollarSign className="icon" />
								</div>
								<Card.Title>Card Title</Card.Title>
								<Card.Text>
									Some quick example text to build on the card title and make up
									the bulk of the card's content.
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>

					<Col>
						<Card style={{ width: "18rem", height: "400px" }} className="card">
							<Card.Body>
								<div className="text-center">
									<FaIcons.FaDollarSign className="icon" />
								</div>
								<Card.Title>Card Title</Card.Title>
								<Card.Text>
									Some quick example text to build on the card title and make up
									the bulk of the card's content.
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>

			{/* Section 3 */}
		</>
	);
};

export default Home;
