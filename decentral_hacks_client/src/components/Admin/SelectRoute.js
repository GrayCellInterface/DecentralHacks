import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import AddProduct from './components/AddProduct/AddProduct';
import CompletedOrders from './components/CompletedOrders/CompletedOrders';
import PendingOrders from './components/PendingOrders/PendingOrders';
import SellerProfile from './components/SellerProfile/SellerProfile';

const SelectRoute = (props) => {

    let { selectedRoute } = useParams()

    const [authenticated, setAuthenticated] = useState(false)

    useEffect(() => {
        if (true) {
            setAuthenticated(true)
        } else {
            setAuthenticated(false)
        }
    }, [])

    const renderPage = () => {
        let page;
        if (authenticated) {
            switch (selectedRoute) {
                case 'completed': {
                    page = <CompletedOrders />
                    break
                }
                case 'pending': {
                    page = <PendingOrders />
                    break
                }
                case 'add-product': {
                    page = <AddProduct />
                    break
                }
                case 'profile': {
                    page = <SellerProfile />
                    break
                }
                default: {
                    return (
                        <div>Error 404 : Page Not Found</div>
                    )
                }
            }
        } else {
            return (
                <>
                    <div>Error 403 : Forbidden Request</div>
                </>
            )
        }

        return (
            <>
                <Navbar
                    url={props.url}
                />
                {page}
            </>
        )
    }

export default SelectRoute;
