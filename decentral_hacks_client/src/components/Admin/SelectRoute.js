import React from 'react';
import { useParams } from 'react-router-dom';
import AddProduct from './components/AddProduct/AddProduct';
import CompletedOrders from './components/CompletedOrders/CompletedOrders';
import PendingOrders from './components/PendingOrders/PendingOrders';
import SellerProfile from './components/SellerProfile/SellerProfile';

const SelectRoute = () => {

    let { selectedRoute } = useParams()
    console.log(selectedRoute)

    const renderPage = () => {
        switch (selectedRoute) {
            case 'completed': {
                return <CompletedOrders />
            }
            case 'pending': {
                return <PendingOrders />
            }
            case 'add-product': {
                return <AddProduct />
            }
            case 'profile': {
                return <SellerProfile />
            }
            default: {
                return (
                    <div>Error 404 : Page Not Found</div>
                )
            }
        }
    }

    return (
        <>
            {renderPage()}
        </>
    );
}

export default SelectRoute;