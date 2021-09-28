import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Container, Row, Col } from "react-bootstrap";

const CompletedOrders = () => {
	const [orders, setOrders] = useState([]);
	const type = "completed";

	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_BACKEND_API}/status/get-order-type/${type}`)
			.then((res) => {
				setOrders(res.data.data);
			})
			.catch((error) => {
				console.log(error.response.msg);
			});
	}, [orders]);
	return (
		<div className="m-4">
			<h6>COMPLETED ORDERS LIST</h6>
			<Table striped bordered hover responsive>
				<thead>
					<tr>
						<th>Order ID</th>
						<th>Product ID</th>
						<th>Order Name</th>
						<th>Created On</th>
						<th>User Email</th>
					</tr>
				</thead>
				<tbody>
					{orders.map((item) => (
						<tr key={item._id}>
							<td>{item.orderId}</td>
							<td>{item.productId}</td>
							<td>{item.orderName}</td>
							<td>{item.order_date}</td>
							<td>{item.email}</td>
						</tr>
					))}
				</tbody>
			</Table>
		</div>
	);
};

export default CompletedOrders;
