import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import "./css/MyTransactions.css";

const MyTransactions = () => {
	const [orders, setOrders] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage] = useState(7);

	// ${window.localStorage.getItem(
	//     "email"
	// )

	useEffect(() => {
		axios
			.get(
				`${process.env.REACT_APP_BACKEND_API}/accounts/get-customer-transcations/tarang.padia2@gmail.com`
			)
			.then((res) => {
				console.log(res.data.transactions);
				setOrders(res.data.transactions);
			})
			.catch((error) => {
				console.log(error.response);
			});
	}, [orders]);

	// Get current posts
	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentTranscations = orders.slice(indexOfFirstPost, indexOfLastPost);

	// Change page
	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<>
			<div className="col-lg-6">
				<div className="me-my-transactions-profile">
					<div className="me-my-transactions-head">
						<div className="me-transactions-name">
							<h4>TRANSACTIONS</h4>
						</div>
					</div>
					<div className="me-my-transactions-body">
						<div className="table-responsive">
							<table className="table">
								<thead>
									<tr>
										<th scope="col">To/From</th>
										<th scope="col">Amount</th>
										<th scope="col">Type</th>
										<th scope="col">Timestamp</th>
									</tr>
								</thead>

								<tbody>
									{currentTranscations.map((item) => (
										<tr key={item.id}>
											<td>
												{item.amount.amount}/ {item.amount.amount}
											</td>
											<td>{item.amount.amount}</td>
											<td>1</td>
											<td>{item.createDate}</td>
										</tr>
									))}
								</tbody>
							</table>
							<div>
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
		</>
	);
};

export default MyTransactions;
