import { createContext, useContext, useEffect, useState } from 'react';
import { account } from '../appwrite/config';
import { ID } from 'appwrite';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserStatus();
    }, []);

    const checkUserStatus = async () => {
        try {
            const currentUser = await account.get();
            setUser(currentUser);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            await account.createEmailPasswordSession(email, password);
            const currentUser = await account.get();
            setUser(currentUser);
            return { success: true };
        } catch (error) {
            let message = error.message;
            if (error.type === 'user_invalid_credentials') message = "Invalid email or password. Please try again.";
            if (error.type === 'user_not_found') message = "Account not found. Please sign up.";
            return { success: false, message: message };
        } finally {
            setLoading(false);
        }
    };

    const signup = async (email, password, name) => {
        setLoading(true);
        try {
            await account.create(ID.unique(), email, password, name);
            await login(email, password);
            return { success: true };
        } catch (error) {
            let message = error.message;
            if (error.type === 'user_already_exists') message = "An account with this email already exists.";
            return { success: false, message: message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        checkUserStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
