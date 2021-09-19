import React from 'react';
import { useParams } from 'react-router-dom';
import Profile from './components/Profile/Profile';
import Shop from './components/Shop/Shop';

const SelectRoute = () => {

    let { selectedRoute } = useParams()
    console.log(selectedRoute)

    const renderPage = () => {
        switch (selectedRoute) {
            case 'profile': {
                return <Profile />
            }
            case 'shop': {
                return <Shop />
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