import React from 'react';
import { useParams } from 'react-router-dom';
import Profile from './components/Profile/Profile';
import Shop from './components/Shop/Shop';
import Orders from './components/Orders/Orders';

const SelectRoute = (props) => {

    let { selectedRoute } = useParams()
    console.log(selectedRoute)

    const renderPage = () => {
        switch (selectedRoute) {
            case 'profile': {
                return <Profile />
            }
            case 'shop': {
                return <Shop
                    handleLoginModalOpen={props.handleLoginModalOpen}
                />
            }
            case 'orders': {
                return <Orders />
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