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
    user: (User & { firebaseUid?: string; id?: string }) | null;
    login: (token: string) => void;
    logout: () => void;
    signInWithGoogle: () => Promise<void>;
    loginWithEmail: (email: string, pass: string) => Promise<User>;
    signupWithEmail: (email: string, pass: string) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
    const [backendUser, setBackendUser] = useState<any>(() => {
        const saved = localStorage.getItem('user_data');
        try {
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setFirebaseUser(currentUser);
            if (currentUser && !backendUser) {
                try {
                    const token = await currentUser.getIdToken();
                    const response = await authService.firebaseLogin(token);
                    if (response.user) {
                        setBackendUser(response.user);
                        localStorage.setItem('user_data', JSON.stringify(response.user));
                    }
                } catch (error) {
                    console.error("Error auto-syncing with backend", error);
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
            localStorage.removeItem('user_data');
            setIsAuthenticated(false);
            setFirebaseUser(null);
            setBackendUser(null);
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    const handleFirebaseAction = async (action: () => Promise<any>): Promise<User> => {
        let result;

        // Firebase auth step
        try {
            result = await action();
        } catch (firebaseError: any) {
            console.error("Firebase Auth Error:", firebaseError.code);
            throw firebaseError; // Rethrow so the component can catch it
        }

        const user = result.user;

        // Backend sync step
        try {
            const token = await user.getIdToken();
            const response = await authService.firebaseLogin(token);
            if (response.user) {
                setBackendUser(response.user);
                localStorage.setItem('user_data', JSON.stringify(response.user));
            }
            setIsAuthenticated(true);
        } catch (backendError) {
            console.error("Backend sync failed:", backendError);
            setIsAuthenticated(true);
        }

        return user; // Crucial: Return the user object here
    };


    const signInWithGoogle = async () => {
        await handleFirebaseAction(() => signInWithPopup(auth, googleProvider));
    };

    const loginWithEmail = async (email: string, pass: string) => {
        return handleFirebaseAction(() =>
            signInWithEmailAndPassword(auth, email, pass)
        );
    };

    // Inside AuthProvider in your AuthContext file

    const signupWithEmail = async (email: string, pass: string) => {
        // Create the user in Firebase
        const result = await createUserWithEmailAndPassword(auth, email, pass);

        // Optional: Backend sync (if you want the backend to know about the user now)
        try {
            const token = await result.user.getIdToken();
            await authService.firebaseLogin(token);
        } catch (err) {
            console.error("Backend sync failed during signup:", err);
        }

        // The "Secret Sauce": Sign out immediately so they aren't auto-logged in
        await signOut(auth);

        // Reset local state just in case
        setFirebaseUser(null);
        setBackendUser(null);
        setIsAuthenticated(false);

        return result.user;
    };


    const combinedUser = firebaseUser ? {
        ...firebaseUser,
        uid: firebaseUser.uid,
        firebaseUid: firebaseUser.uid,
        id: backendUser?.id
    } : (backendUser ? {
        uid: backendUser.firebaseUid,
        firebaseUid: backendUser.firebaseUid,
        email: backendUser.email,
        displayName: backendUser.name,
        photoURL: backendUser.photoUrl,
        id: backendUser.id
    } : null);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user: combinedUser as any,
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
