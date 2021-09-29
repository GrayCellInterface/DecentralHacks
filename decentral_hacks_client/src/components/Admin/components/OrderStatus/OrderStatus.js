import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";

const OrderStatus = (props) => {
	const [orders, setOrders] = useState([]);
	const type = props.type;
	const name = type.toUpperCase();

	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_BACKEND_API}/status/get-order-type/${type}`)
			.then((res) => {
				setOrders(res.data.data);
			})
			.catch((error) => {
				console.log(error.response.msg);
			});
	}, [type]);
	return (
		<div className="m-4">
			<h6>{name} ORDERS LIST</h6>
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
					{orders.slice(0).reverse().map((item) => (
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

export default OrderStatus;