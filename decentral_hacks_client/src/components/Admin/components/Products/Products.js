import React, { useEffect, useState } from "react";
import axios from 'axios';
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import defaultImage from '../../../../assets/images/defaultProduct.png'
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";
import './css/Products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false)
    const [selectedProductId, setSelectedProductId] = useState("");

    useEffect(() => {
        const getProducts = () => {
            axios.get(`${process.env.REACT_APP_BACKEND_API}/shop/all-products`).then((res) => {
                setProducts(res.data.data.slice(0).reverse())
            })
        };

        getProducts();
    }, []);

    const handleOpenDeleteConfirmation = (selectedProductIndex) => {
        setSelectedProductId(products[selectedProductIndex]._id)
        setOpenDeleteConfirmation(true)
    }

    const handleCloseDeleteConfirmation = (e) => {
        e.preventDefault()
        setOpenDeleteConfirmation(false)
    }

    const renderProducts = () => {
        return (
            <>
                <div className="row">
                    {products.map((product, index) => {
                        let image;
                        if (product.p_link === "") {
                            image = defaultImage
                        } else {
                            image = product.p_link
                        }
                        return (
                            <div
                                className="col-sm-12 col-md-6 col-lg-4"
                                key={index}
                                style={{ margin: "30px 0px" }}
                            >
                                <Card style={{ width: "23rem", height: "773px" }} key={index}>
                                    <Card.Img style={{ height: "340px", objectFit: "contain" }} variant="top" src={image} />
                                    <Card.Body>
                                        <div className="row">
                                            <div className="col-7">
                                                <Card.Title style={{ float: "left", height: "30px" }}>
                                                    {product.p_name}
                                                </Card.Title>
                                            </div>
                                            <div className="col-5">
                                                <Card.Title style={{ float: "right" }}>
                                                    <strong>{product.p_price} USDC</strong>
                                                </Card.Title>
                                            </div>
                                        </div>
                                        <Card.Text style={{ height: "90px" }}>
                                            <br />
                                            <b>Description: </b>
                                            {product.p_description}
                                        </Card.Text>
                                    </Card.Body>
                                    <ListGroup className="list-group-flush">
                                        <ListGroupItem>
                                            <div className="row">
                                                <div className="col-6">
                                                    <p style={{ float: "left" }}>
                                                        <b>Stock :</b>
                                                    </p>
                                                </div>
                                                <div className="col-6">
                                                    <p style={{ float: "right" }}>
                                                        {product.p_count}
                                                    </p>
                                                </div>
                                            </div>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <div className="row">
                                                <div className="col-6">
                                                    <p style={{ float: "left" }}>
                                                        <b>Delivery Time :</b>
                                                    </p>
                                                </div>
                                                <div className="col-6">
                                                    <p style={{ float: "right" }}>
                                                        {product.p_delivery} DAYS
                                                    </p>
                                                </div>
                                            </div>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <div className="row">
                                                <div className="col-12">
                                                    <p style={{ float: "left" }}>
                                                        <b>Seller Address :</b>
                                                    </p>
                                                </div>
                                                <div className="col-12">
                                                    <p style={{ float: "left" }}>
                                                        TVyXtKiMoG2PZpSsAnMaLZW747PSvRAQmT
                                                    </p>
                                                </div>
                                            </div>
                                        </ListGroupItem>
                                    </ListGroup>
                                    <Card.Body className="text-center">
                                        <div className="row">
                                            <div className="col-6">
                                                <button
                                                    className="me-btn"
                                                    style={{ width: "70%", height: "40px", backgroundColor: "orange" }}
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                            <div className="col-6">
                                                <button
                                                    onClick={() => { handleOpenDeleteConfirmation(index) }}
                                                    className="me-btn"
                                                    style={{ width: "70%", height: "40px", backgroundColor: "red" }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    return (
        <>
            <div className="container">{renderProducts()}</div>
            <DeleteConfirmationModal
                selectedProductId={selectedProductId}
                handleCloseDeleteConfirmation={handleCloseDeleteConfirmation}
                openDeleteConfirmation={openDeleteConfirmation}
            />
        </>
    );
}

export default Products;