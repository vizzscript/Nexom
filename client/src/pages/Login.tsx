import { ROUTES } from '@/constants';
import { useAuth } from '@/features/auth';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { signInWithGoogle, loginWithEmail, signupWithEmail } = useAuth();

    const handleGoogleLogin = async () => {
        setError('');
        try {
            await signInWithGoogle();
            navigate(ROUTES.HOME);
            toast.success('Welcome back!');
        } catch (err: any) {
            console.error(err);
            setError('Failed to sign in with Google.');
            toast.error('Google Sign-In failed.');
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                await loginWithEmail(email, password);
                toast.success('Welcome back!');
                navigate(ROUTES.HOME);
            } else {
                await signupWithEmail(email, password);
                toast.success('Account created successfully! Please sign in.');
                setIsLogin(true);
                setPassword('');
                navigate(ROUTES.LOGIN);
            }
        } catch (err: any) {
            console.error(err);
            let message = 'Authentication failed.';

            if (err.code === 'auth/invalid-credential')
                message = 'Invalid email or password.';
            else if (err.code === 'auth/email-already-in-use')
                message = 'Email already in use.';
            else if (err.code === 'auth/weak-password')
                message = 'Password should be at least 6 characters.';
            else if (err.code === 'auth/too-many-requests')
                message = 'Too many attempts. Please try again later.';

            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50 dark:bg-[#0f172a] px-4 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-100 dark:border-slate-700"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 dark:bg-slate-700 text-[#d4af37] mb-4 shadow-lg shadow-black/20">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold font-serif text-slate-900 dark:text-white mb-2">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        {isLogin
                            ? 'Sign in to manage your bookings'
                            : 'Join us to book premium services'
                        }
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900/30"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleEmailAuth} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-[#d4af37] dark:focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-[#d4af37] dark:focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl text-base font-bold bg-[#d4af37] hover:bg-[#b5952f] text-white flex items-center justify-center gap-2 group disabled:opacity-70 transition-all shadow-lg shadow-[#d4af37]/20"
                    >
                        {loading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Sign Up')}
                        {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] font-bold">Or continue with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="mt-6 w-full py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors bg-transparent"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Google</span>
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-slate-600 dark:text-slate-400">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[#d4af37] font-bold hover:underline"
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;