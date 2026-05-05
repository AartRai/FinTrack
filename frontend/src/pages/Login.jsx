import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { 
    Activity, Wallet, Target, ShieldCheck, 
    Mail, Lock, Eye, EyeOff, User
} from 'lucide-react';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('user@example.com');
    const [password, setPassword] = useState('password');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login, register, user, loading: authLoading } = useAuth();
    const [authChecking, setAuthChecking] = useState(true);

    React.useEffect(() => {
        if (!authLoading) {
            setAuthChecking(false);
        }
    }, [authLoading]);

    if (authChecking) {
        return null; // Or a spinner
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(name, email, password);
            }
        } catch (err) {
            const errorData = err.response?.data;
            if (errorData?.errors) {
                // Extract the first error message from the errors object
                const firstError = Object.values(errorData.errors)[0][0];
                setError(firstError);
            } else {
                setError(errorData?.message || 'Authentication failed');
            }
        } finally {
            setLoading(false);
        }
    };


    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
    };

    return (
        <div className="min-h-screen flex w-full bg-slate-50 font-sans">
            
            {/* Left Panel - Branding & Info (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#061B40] to-[#010915] flex-col p-12 relative overflow-hidden text-white">
                {/* Decorative Circles */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[80px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/10 blur-[80px]"></div>

                {/* Logo */}
                <div className="flex items-center gap-2 mb-16 relative z-10">
                    <div className="flex items-end gap-0.5">
                        <div className="w-2 h-4 bg-blue-500 rounded-sm"></div>
                        <div className="w-2 h-6 bg-blue-400 rounded-sm"></div>
                        <div className="w-2 h-8 bg-blue-600 rounded-sm"></div>
                    </div>
                    <span className="text-2xl font-bold tracking-tight">Fin<span className="text-blue-500">Track</span></span>
                </div>

                {/* Hero Text */}
                <div className="relative z-10 max-w-lg mb-12">
                    <h1 className="text-5xl font-bold leading-tight mb-4 tracking-tight">
                        Track Today.<br />
                        Build <span className="text-blue-500">Tomorrow.</span>
                    </h1>
                    <p className="text-slate-300 text-lg">
                        FinTrack helps you manage your finances, track expenses, set budgets, and achieve your financial goals.
                    </p>
                </div>

                {/* Features List */}
                <div className="space-y-6 relative z-10 max-w-md">
                    <div className="flex items-start gap-4">
                        <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 backdrop-blur-sm border border-blue-500/20 mt-1">
                            <Activity size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Dashboard Overview</h3>
                            <p className="text-slate-400 text-sm mt-1">Get a clear view of your financial health.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 backdrop-blur-sm border border-emerald-500/20 mt-1">
                            <Wallet size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Expense Tracking</h3>
                            <p className="text-slate-400 text-sm mt-1">Track every expense in real-time.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 backdrop-blur-sm border border-blue-500/20 mt-1">
                            <Target size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Budget Goals</h3>
                            <p className="text-slate-400 text-sm mt-1">Set budgets and achieve your goals.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 backdrop-blur-sm border border-emerald-500/20 mt-1">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Secure & Private</h3>
                            <p className="text-slate-400 text-sm mt-1">Your data is safe with top-notch security.</p>
                        </div>
                    </div>
                </div>

                {/* Mock Dashboard Graphic (Absolute Positioned) */}
                <div className="absolute bottom-[-50px] right-[-50px] w-[500px] h-[300px] bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-6 hidden xl:block rotate-[-2deg] opacity-90 transition-transform hover:rotate-0 hover:scale-105 duration-500">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 bg-slate-800/50 rounded-xl p-4 border border-white/5">
                            <div className="text-slate-400 text-xs mb-1">Total Balance</div>
                            <div className="text-2xl font-bold text-white mb-2">₹1,25,000.00</div>
                            <div className="w-full h-16 bg-blue-500/20 rounded-lg mt-2 relative overflow-hidden">
                                <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                    <path d="M0 100 L0 50 Q25 20 50 60 T100 30 L100 100 Z" fill="rgba(59, 130, 246, 0.5)" />
                                    <path d="M0 50 Q25 20 50 60 T100 30" fill="none" stroke="#3b82f6" strokeWidth="2" />
                                </svg>
                            </div>
                        </div>
                        <div className="col-span-1 flex flex-col gap-4">
                            <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5 flex-1">
                                <div className="text-slate-400 text-xs mb-1">Income</div>
                                <div className="text-lg font-bold text-emerald-400">₹2,40,000</div>
                            </div>
                            <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5 flex-1">
                                <div className="text-slate-400 text-xs mb-1">Expenses</div>
                                <div className="text-lg font-bold text-red-400">₹1,15,000</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="max-w-[450px] w-full bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10">
                    
                    {/* Tabs */}
                    <div className="flex w-full border-b border-slate-100 mb-8 relative">
                        <button 
                            className={`flex-1 pb-4 text-center font-medium transition-colors ${isLogin ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setIsLogin(true)}
                        >
                            Login
                        </button>
                        <button 
                            className={`flex-1 pb-4 text-center font-medium transition-colors ${!isLogin ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setIsLogin(false)}
                        >
                            Sign Up
                        </button>
                        <div className={`absolute bottom-0 h-0.5 bg-blue-600 w-1/2 transition-transform duration-300 ease-out ${isLogin ? 'translate-x-0' : 'translate-x-full'}`}></div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                            {isLogin ? 'Welcome back!' : 'Create an account'}
                        </h2>
                        <p className="text-slate-500 mt-2 text-sm">
                            {isLogin ? 'Log in to continue managing your finances.' : 'Sign up to start your journey to financial freedom.'}
                        </p>
                    </div>
                    
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 border border-red-100 flex items-center gap-2">
                            <ShieldCheck size={16} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <User size={18} />
                                    </div>
                                    <input 
                                        type="text" 
                                        className="w-full rounded-xl border-slate-200 border pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50/50" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your full name"
                                        required={!isLogin} 
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Mail size={18} />
                                </div>
                                <input 
                                    type="email" 
                                    className="w-full rounded-xl border-slate-200 border pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50/50" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required 
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-medium text-slate-700">Password</label>
                                {isLogin && (
                                    <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700">Forgot password?</a>
                                )}
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    className="w-full rounded-xl border-slate-200 border pl-11 pr-11 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50/50"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="Enter your password"
                                    required 
                                />
                                <button 
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl px-4 py-3 transition-all focus:ring-4 focus:ring-blue-500/30 outline-none shadow-lg shadow-blue-600/20 mt-2"
                        >
                            {loading ? (isLogin ? 'Signing in...' : 'Signing up...') : (isLogin ? 'Log In' : 'Sign Up')}
                        </button>
                        
                        <div className="relative py-6 flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative bg-white px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                                or continue with
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" className="flex items-center justify-center gap-2 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.8 15.71 17.58V20.34H19.27C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                                    <path d="M12 23C14.97 23 17.46 22.02 19.27 20.34L15.71 17.58C14.73 18.24 13.48 18.64 12 18.64C9.13 18.64 6.71 16.7 5.84 14.1H2.17V16.94C3.98 20.53 7.69 23 12 23Z" fill="#34A853"/>
                                    <path d="M5.84 14.1C5.62 13.44 5.49 12.74 5.49 12C5.49 11.26 5.62 10.56 5.84 9.9V7.06H2.17C1.43 8.55 1 10.23 1 12C1 13.77 1.43 15.45 2.17 16.94L5.84 14.1Z" fill="#FBBC05"/>
                                    <path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.35 3.88C17.46 2.12 14.97 1 12 1C7.69 1 3.98 3.47 2.17 7.06L5.84 9.9C6.71 7.3 9.13 5.38 12 5.38Z" fill="#EA4335"/>
                                </svg>
                                Google
                            </button>
                            <button type="button" className="flex items-center justify-center gap-2 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.19 2.24-.86 3.64-.86 1.34 0 2.54.54 3.32 1.48-2.83 1.63-2.34 5.41.48 6.47-.63 1.83-1.61 3.63-2.52 5.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.02 4.46-3.74 4.25z"/>
                                </svg>
                                Apple
                            </button>
                        </div>
                        
                        <p className="text-center text-sm text-slate-500 pt-4">
                            {isLogin ? (
                                <>Don't have an account? <button type="button" onClick={toggleMode} className="text-blue-600 font-medium hover:text-blue-700">Sign up</button></>
                            ) : (
                                <>Already have an account? <button type="button" onClick={toggleMode} className="text-blue-600 font-medium hover:text-blue-700">Log in</button></>
                            )}
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
