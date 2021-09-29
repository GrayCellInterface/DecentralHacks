import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import forbidden from '../../assets/images/Forbidden.gif'
import Profile from './components/Profile/Profile';
import Orders from './components/Orders/Orders';

const SelectRoute = (props) => {

    let { selectedRoute } = useParams()
    const [authenticated, setAuthenticated] = useState(false)

    useEffect(() => {
        if (window.localStorage.getItem("email")) {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
        }
    }, [])

    const renderPage = () => {
        if (authenticated) {
            switch (selectedRoute) {
                case 'profile': {
                    return <Profile />
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
        } else {
            return (
                <>
                    <div className="text-center" style={{ marginTop: "100px" }}>
                        <img src={forbidden} alt="forbidden" />
                        <h5><strong>You are not authorized to view this page.</strong></h5>
                    </div>
                </>
            )
        }

    }

    return (
        <>
            {renderPage()}
        </>
    );
}

export default SelectRoute;