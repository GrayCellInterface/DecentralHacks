import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import "./css/MyTransactions.css";

const MyTransactions = () => {
	const [orders, setOrders] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage] = useState(8);



	useEffect(() => {
		axios
			.get(
				`${process.env.REACT_APP_BACKEND_API}/accounts/get-customer-transcations/${window.localStorage.getItem("email")}`
			)
			.then((res) => {
				console.log(res.data.transactions);
				const filteredTransactions = res.data.transactions.filter((element) => {
					if (element.destination.id === "1000177235") { //process.env.REACT_APP_MASTER_WALLETID
						return false
					} else {
						return true
					}
				})
				console.log(filteredTransactions)
				setOrders(filteredTransactions);
			})
			.catch((error) => {
				console.log(error.response);
			});
	}, []);

	// Get current posts
	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentTranscations = orders.slice(indexOfFirstPost, indexOfLastPost);

	// Change page
	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<>
			<div className="col-lg-6">
				<div className="me-transaction me-padder-top-less me-padder-bottom">
					<div className="container">
						<div className="row">
							<div className="col-lg-12">
								<div className="me-transaction-box">
									<div className="table table-responsive">
										<table>
											<thead>
												<tr>
													<th>To/From</th>
													<th>Amount</th>
													<th>Type</th>
													<th>Timestamp</th>
												</tr>
											</thead>
											<tbody>
												{currentTranscations.map((item) => {
													let recepient
													let type
													var now = new Date(item.createDate);
													now.setSeconds(0, 0);
													var stamp = now.toISOString().replace(/T/, " ").replace(/:00.000Z/, "");
													// let date = new Date();
													// let stringDate = date.toLocaleString()
													if (item.destination.address === "TVyXtKiMoG2PZpSsAnMaLZW747PSvRAQmT") { //process.env.REACT_APP_SELLER_ADDRESS
														recepient = "SELLER"
														type = "SHOP"
													}
													else if (item.destination.address === "TEGmWL8QsLqe7ivG3Rir9wPoPVJGLCvtMC") { ////process.env.REACT_APP_BENEFICIARY_ADDRESS
														recepient = "MARKETPLACE"
														type = "DEBIT"
													}
													else {
														recepient = "MARKETPLACE"
														type = "CREDIT/REFUND"
													}
													return (
														<tr key={item.id}>
															<td>
																{recepient}
															</td>
															<td>{item.amount.amount}</td>
															<td>{type}</td>
															<td>{stamp}</td>
														</tr>
													)
												}
												)}

											</tbody>
										</table>
									</div>
									<div style={{ marginLeft: "45%" }}>
										<Pagination
											postsPerPage={postsPerPage}
											totalPosts={orders.length}
											paginate={paginate}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>

	);
};

export default MyTransactions;
