import React from 'react';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Landing({ setPage, setUser }) {
    const { t } = useTranslation();
    const skipAuth = () => {
        setUser({ name: 'Guest' });
        setPage('main');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Sparkles className="w-12 h-12 text-yellow-300 animate-pulse" />
                        <h1 className="text-5xl font-bold text-white">{t('landing.title')}</h1>
                    </div>
                    <p className="text-purple-200 text-lg">
                        {t('landing.subtitle')}
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => setPage('login')}
                        className="w-full bg-white/20 backdrop-blur-lg border border-white/30 text-white py-4 rounded-xl font-semibold hover:bg-white/30 transition-all"
                    >
                        {t('landing.login')}
                    </button>
                    <button
                        onClick={() => setPage('register')}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:shadow-2xl transition-all"
                    >
                        {t('landing.register')}
                    </button>
                    <button
                        onClick={skipAuth}
                        className="w-full bg-transparent border-2 border-white/30 text-white py-4 rounded-xl font-semibold hover:border-white/50 transition-all"
                    >
                        {t('landing.continueWithoutRegistration')}
                    </button>
                </div>
            </div>
        </div>
    );
}
