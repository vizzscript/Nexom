import { auth, googleProvider } from '@/lib/firebase';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    type User
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authService } from '../services/auth.service';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
    signInWithGoogle: () => Promise<void>;
    loginWithEmail: (email: string, pass: string) => Promise<void>;
    signupWithEmail: (email: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    // const token = await currentUser.getIdToken();
                    // Optional: Automatically sync with backend on load/change
                    // await authService.firebaseLogin(token); 
                    // For now, we rely on explicit login actions to set the backend token
                    // but we could auto-refresh here.
                } catch (error) {
                    console.error("Error getting token", error);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token); // Note: authService uses 'auth_token' key, check consistency
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await signOut(auth);
            authService.logout();
            setIsAuthenticated(false);
            setUser(null);
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    const handleFirebaseAction = async (action: () => Promise<any>) => {
        let result;

        // 1️⃣ Firebase auth step
        try {
            result = await action();
        } catch (firebaseError: any) {
            // 🔥 THIS preserves auth/user-not-found
            console.error("Firebase Auth Error:", firebaseError.code);
            throw firebaseError;
        }

        // 2️⃣ Backend sync step (should NOT block login UI)
        try {
            const user = result.user;
            const token = await user.getIdToken();
            await authService.firebaseLogin(token);
            setIsAuthenticated(true);
            return user;
        } catch (backendError) {
            console.error("Backend sync failed:", backendError);
            // ⚠️ Optional: show warning toast, but do NOT block login
            setIsAuthenticated(true);
            return result.user;
        }
    };


    const signInWithGoogle = async () => {
        await handleFirebaseAction(() => signInWithPopup(auth, googleProvider));
    };

    const loginWithEmail = async (email: string, pass: string) => {
        return handleFirebaseAction(() =>
            signInWithEmailAndPassword(auth, email, pass)
        );
    };

    const signupWithEmail = async (email: string, pass: string) => {
        return handleFirebaseAction(() =>
            createUserWithEmailAndPassword(auth, email, pass)
        );
    };


    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            login,
            logout,
            signInWithGoogle,
            loginWithEmail,
            signupWithEmail
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
