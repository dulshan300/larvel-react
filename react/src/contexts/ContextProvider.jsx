import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    pageTitle: "",
    setUser: () => { },
    setToken: () => { },
    setPageTitle: (title) => { },
    notification: null,
    setNotification: (type, message) => { }
});

export const ContextProvider = ({ children }) => {

    const [user, setUser] = useState({});
    const [pageTitle, _setPageTitle] = useState("");
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

    const [notification, _setNotification] = useState(null)

    const setNotification = (type, message) => {
        _setNotification({
            type: type,
            message: message
        })
        setTimeout(() => {
            _setNotification(null)
        }, 3000)
    }

    const setToken = (token) => {
        _setToken(token)
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN');
        }
    }

    const setPageTitle = (title) => {
        _setPageTitle(title)
    }

    return (
        <StateContext.Provider value={{
            user, token, setUser, setToken, setPageTitle, pageTitle, notification, setNotification
        }}>

            {children}

        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);