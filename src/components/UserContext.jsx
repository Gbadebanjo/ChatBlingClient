import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
        const [usernameDetails, setUsernameDetails] = useState(null);
        const [id, setId] = useState(null);
        useEffect(() => {
            axios.get('/profile').then(response => {
                setId(response.data.userId);
                setUsernameDetails(response.data.username)
            });
        }, []);
    return (
        <UserContext.Provider value={{usernameDetails, setUsernameDetails, id, setId}}>
            {children}
        </UserContext.Provider>
    );
} 

UserContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
