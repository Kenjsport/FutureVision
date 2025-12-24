import React from 'react';
import { Mail, Lock, X } from 'lucide-react';

export default function Login({ setPage, setUser, email, setEmail, password, setPassword }) {
    const handleLogin = () => {
        if (email && password) {
            setUser({ email, name: email.split('@')[0] });
            setPage('main');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-white">Log In</h2>
                    <button onClick={() => setPage('landing')} className="text-white/60 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-white/80 mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-white/50" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-white/80 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-white/50" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all"
                    >
                        Log In
                    </button>

                    <div className="text-center">
                        <button
                            onClick={() => setPage('register')}
                            className="text-purple-300 hover:text-purple-200 text-sm"
                        >
                            Don't have an account? Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
