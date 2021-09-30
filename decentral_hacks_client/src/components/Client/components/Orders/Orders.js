import React, { useState, useEffect } from "react";
import axios from "axios";
import RefundConfirmationModal from "./RefundConfirmationModal";
import { Table } from "react-bootstrap";

const Orders = (props) => {
	const [orders, setOrders] = useState([]);
	const [refundProduct, setRefundProduct] = useState({});
	const [openRefundConfirmation, setOpenRefundConfirmation] = useState(false);

	useEffect(() => {
		axios
			.get(
				`${
					process.env.REACT_APP_BACKEND_API
				}/status/get-user-orders/${window.localStorage.getItem("email")}`
			)
			.then((res) => {
				setOrders(res.data.data.slice(0).reverse());
				console.log(res.data.data.slice(0).reverse());
			})
			.catch((error) => {
				console.log(error.response.msg);
			});
	}, []);

	const handleRefund = (refundProductIndex) => {
		setRefundProduct(orders[refundProductIndex]);
		setOpenRefundConfirmation(true);
	};

	const handleCloseRefundConfirmation = () => {
		setOpenRefundConfirmation(false);
	};

	return (
		<>
			<div style={{ margin: "120px" }}>
				<h6>YOUR ORDERS LIST</h6>
				<Table striped bordered hover responsive>
					<thead>
						<tr>
							<th>Order ID</th>
							<th>Amount Paid (Fees Excluded)</th>
							<th>Order Name</th>
							<th>Created On</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((item, index) => {
							let status;
							if (item.status === "pending") {
								status = (
									<>
										<button
											onClick={() => handleRefund(index)}
											className="me-btn"
											style={{ color: "#fff", backgroundColor: "#c93b33" }}
										>
											Get Refund
										</button>
									</>
								);
							} else if (item.status === "completed") {
								status = <p style={{ color: "green" }}>DELIVERED</p>;
							} else {
								status = <p style={{ color: "red" }}>CANCELLED</p>;
							}
							return (
								<tr key={item._id}>
									<td>{item.orderId}</td>
									<td>{item.amount} USDC</td>
									<td>{item.orderName}</td>
									<td>{item.order_date}</td>
									<td>{status}</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			</div>
			<RefundConfirmationModal
				refundProduct={refundProduct}
				openRefundConfirmation={openRefundConfirmation}
				handleCloseRefundConfirmation={handleCloseRefundConfirmation}
			/>
		</>
	);
};

export default Orders;
