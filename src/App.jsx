import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2, Zap, History, Home, LogOut, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './contexts/LanguageContext';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import TestModal from './components/TestModal';
import Predictions from './components/Predictions';
import HistoryDashboard from './components/HistoryDashboard';
import ExportShare from './components/ExportShare';
import LearningResources from './components/LearningResources';
import ComparisonView from './components/ComparisonView';
import { BLOCKED_WORDS } from '../dataBase';
import { formatTimeframe } from './utils/timeframeFormatter';

export default function App() {
    const { t } = useTranslation();
    const { language, changeLanguage } = useLanguage();
    const [page, setPage] = useState('landing'); // landing, login, register, main
    const [view, setView] = useState('main'); // main, history, comparison
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const [currentSkill, setCurrentSkill] = useState('');
    const [currentLevel, setCurrentLevel] = useState('beginner');
    const [timeframeMonths, setTimeframeMonths] = useState(12); // Default to 12 months (1 year)
    const [predictions, setPredictions] = useState(null);
    const [currentPredictionId, setCurrentPredictionId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [showTest, setShowTest] = useState(false);
    const [testStep, setTestStep] = useState(0);
    const [testAnswers, setTestAnswers] = useState([]);
    
    const [comparisonIds, setComparisonIds] = useState([]);
    const [refreshHistory, setRefreshHistory] = useState(0);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const langMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
                setShowLangMenu(false);
            }
        };
        if (showLangMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showLangMenu]);

    const generatePredictions = async () => {
        if (!currentSkill.trim()) {
            setError(t('errors.enterSkill'));
            return;
        }

        // Check for blocked words
        const inputLower = currentSkill.toLowerCase();
        const hasBlockedWord = BLOCKED_WORDS.some(word =>
            inputLower.includes(word.toLowerCase())
        );

        if (hasBlockedWord) {
            setError(t('errors.rudeWord'));
            return;
        }

        setLoading(true);
        setError('');
        setPredictions(null);

        try {
            const response = await fetch('http://localhost:3001/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: `You are an expert in skill development and career planning. 

Skill/Project: ${currentSkill}
Current Level: ${currentLevel}
Time Horizon: ${timeframeMonths} month(s) (${(timeframeMonths / 12).toFixed(1)} year(s))

Create a realistic growth forecast in JSON format. Respond ONLY with JSON without explanation. All text values MUST be in English:

{
  "trajectory": "brief description of the general trajectory (2-3 sentences)",
  "milestones": [
    {
      "period": "in X months",
      "achievement": "specific achievement",
      "skills": ["skill1", "skill2"]
    }
  ],
  "opportunities": [
    "opportunity 1",
    "opportunity 2",
    "opportunity 3"
  ],
  "risks": [
    "risk/challenge 1",
    "risk/challenge 2"
  ],
  "nextSteps": [
    "specific step 1",
    "specific step 2",
    "specific step 3"
  ],
  "careerPaths": [
    {
      "title": "Career path name (e.g., 'Full-Stack Developer', 'Data Scientist')",
      "description": "Brief description of this career path",
      "growthPotential": 85,
      "marketDemand": 90,
      "difficulty": 70,
      "skills": ["skill1", "skill2", "skill3"]
    }
  ],
  "salaryInfo": {
    "hasJobPotential": true,
    "midSalary": 95000,
    "currency": "USD",
    "region": "Global average",
    "salaryRange": {
      "min": 70000,
      "max": 120000
    },
    "jobTitles": ["Job Title 1", "Job Title 2", "Job Title 3"],
    "progression": [
      {"year": "Year 1", "salary": 60000},
      {"year": "Year 2", "salary": 75000},
      {"year": "Year 3", "salary": 95000},
      {"year": "Year 5", "salary": 120000}
    ]
  }
}`
                })
            });

            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/71323d95-debc-4ecf-a311-79ceedb88b4e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:99',message:'API response received',data:{ok:response.ok,status:response.status,statusText:response.statusText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
            // #endregion
            
            if (!response.ok) {
                const errorText = await response.text();
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/71323d95-debc-4ecf-a311-79ceedb88b4e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:103',message:'API response not ok',data:{status:response.status,errorText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                // #endregion
                throw new Error(`API Error: ${response.status} ${errorText}`);
            }
            
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message || 'API Error');
            }

            if (!data.content || !data.content[0]) {
                throw new Error('Invalid response from model');
            }

            const content = data.content[0].text;

            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const parsed = JSON.parse(jsonMatch[0]);
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/71323d95-debc-4ecf-a311-79ceedb88b4e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:126',message:'JSON parsed successfully',data:{hasTrajectory:!!parsed.trajectory,hasMilestones:!!parsed.milestones,milestoneCount:parsed.milestones?.length||0,isArray:Array.isArray(parsed.milestones)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
                    // #endregion
                    
                    // Validate parsed data structure
                    if (!parsed.milestones || !Array.isArray(parsed.milestones)) {
                        parsed.milestones = [];
                    }
                    if (!parsed.opportunities || !Array.isArray(parsed.opportunities)) {
                        parsed.opportunities = [];
                    }
                    if (!parsed.risks || !Array.isArray(parsed.risks)) {
                        parsed.risks = [];
                    }
                    if (!parsed.nextSteps || !Array.isArray(parsed.nextSteps)) {
                        parsed.nextSteps = [];
                    }
                    if (!parsed.careerPaths || !Array.isArray(parsed.careerPaths)) {
                        parsed.careerPaths = [];
                    }
                    // Validate salaryInfo structure
                    if (parsed.salaryInfo && parsed.salaryInfo.hasJobPotential === false) {
                        parsed.salaryInfo = null;
                    } else if (parsed.salaryInfo) {
                        if (!parsed.salaryInfo.progression || !Array.isArray(parsed.salaryInfo.progression)) {
                            parsed.salaryInfo.progression = [];
                        }
                        if (!parsed.salaryInfo.jobTitles || !Array.isArray(parsed.salaryInfo.jobTitles)) {
                            parsed.salaryInfo.jobTitles = [];
                        }
                    }
                    
                    setPredictions(parsed);
                } catch (parseError) {
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/71323d95-debc-4ecf-a311-79ceedb88b4e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:140',message:'JSON parse error',data:{error:parseError.message,jsonMatchLength:jsonMatch[0]?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'N'})}).catch(()=>{});
                    // #endregion
                    throw new Error(`Failed to parse JSON: ${parseError.message}`);
                }
                
                // Save prediction to backend
                const userId = user?.email || user?.name || 'guest';
                try {
                    const saveResponse = await fetch('http://localhost:3001/api/predictions/save', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId,
                            skill: currentSkill,
                            level: currentLevel,
                            timeframe: timeframeMonths.toString(),
                            predictions: parsed
                        })
                    });
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/71323d95-debc-4ecf-a311-79ceedb88b4e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:132',message:'Save prediction response',data:{ok:saveResponse.ok,status:saveResponse.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
                    // #endregion
                    if (saveResponse.ok) {
                        const saveData = await saveResponse.json();
                        if (saveData.prediction) {
                            setCurrentPredictionId(saveData.prediction.id);
                        }
                    } else {
                        const errorText = await saveResponse.text();
                        console.error('Failed to save prediction:', errorText);
                    }
                } catch (saveErr) {
                    console.error('Error saving prediction:', saveErr);
                    // Continue even if save fails
                }
            } else {
                throw new Error('Could not parse JSON in model response');
            }
        } catch (err) {
            if (err instanceof TypeError && err.message.includes('fetch')) {
                setError(t('errors.connectionError'));
            } else {
                setError(t('errors.apiError', { message: err.message }));
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPrediction = (prediction) => {
        setPredictions(prediction.predictions);
        setCurrentSkill(prediction.skill);
        setCurrentLevel(prediction.level);
        // Convert timeframe string to months if it's a number
        const timeframeValue = parseInt(prediction.timeframe) || 12;
        setTimeframeMonths(timeframeValue);
        setCurrentPredictionId(prediction.id);
        setView('main');
    };

    const handleCompare = (ids) => {
        setComparisonIds(ids);
        setView('comparison');
    };

    const getUserId = () => {
        return user?.email || user?.name || 'guest';
    };

    if (page === 'landing') {
        return <Landing setPage={setPage} setUser={setUser} />;
    }

    if (page === 'login') {
        return <Login setPage={setPage} setUser={setUser} email={email} setEmail={setEmail} password={password} setPassword={setPassword} />;
    }

    if (page === 'register') {
        return <Register setPage={setPage} setUser={setUser} email={email} setEmail={setEmail} password={password} setPassword={setPassword} name={name} setName={setName} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 md:p-8 text-white">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                        <div className="text-center flex-1">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Sparkles className="w-10 h-10 text-yellow-300 animate-pulse" />
                            <h1 className="text-4xl md:text-5xl font-bold text-white">
                                {t('app.title')}
                            </h1>
                        </div>
                        <p className="text-purple-200 text-lg">
                            {t('app.greeting', { name: user?.name })}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative" ref={langMenuRef}>
                            <button
                                className="px-4 py-2 rounded-lg font-semibold bg-white/20 text-white hover:bg-white/30 transition-all flex items-center gap-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowLangMenu(!showLangMenu);
                                }}
                            >
                                <Globe className="w-4 h-4" />
                                {language.toUpperCase()}
                            </button>
                            {showLangMenu && (
                                <div className="absolute right-0 mt-2 bg-white/90 backdrop-blur-lg rounded-lg shadow-lg z-50 min-w-[120px]">
                                    <button
                                        onClick={() => { changeLanguage('en'); setShowLangMenu(false); }}
                                        className={`w-full text-left px-4 py-2 hover:bg-purple-500 hover:text-white transition-all ${language === 'en' ? 'bg-purple-500 text-white' : 'text-gray-800'}`}
                                    >
                                        English
                                    </button>
                                    <button
                                        onClick={() => { changeLanguage('ru'); setShowLangMenu(false); }}
                                        className={`w-full text-left px-4 py-2 hover:bg-purple-500 hover:text-white transition-all ${language === 'ru' ? 'bg-purple-500 text-white' : 'text-gray-800'}`}
                                    >
                                        Русский
                                    </button>
                                    <button
                                        onClick={() => { changeLanguage('am'); setShowLangMenu(false); }}
                                        className={`w-full text-left px-4 py-2 hover:bg-purple-500 hover:text-white transition-all ${language === 'am' ? 'bg-purple-500 text-white' : 'text-gray-800'}`}
                                    >
                                        Հայերեն
                                    </button>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setView('main')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                                view === 'main'
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                        >
                            <Home className="w-4 h-4" />
                            {t('navigation.home')}
                        </button>
                        <button
                            onClick={() => {
                                setView('history');
                                setRefreshHistory(prev => prev + 1);
                            }}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                                view === 'history'
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                        >
                            <History className="w-4 h-4" />
                            {t('navigation.history')}
                        </button>
                        <button
                            onClick={() => {
                                setUser(null);
                                setPage('landing');
                                setView('main');
                                setPredictions(null);
                                setCurrentPredictionId(null);
                            }}
                            className="px-4 py-2 rounded-lg font-semibold bg-white/20 text-white hover:bg-white/30 transition-all flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            {t('navigation.logout')}
                        </button>
                    </div>
                </div>

                {view === 'history' && (
                    <HistoryDashboard
                        userId={getUserId()}
                        onSelectPrediction={handleSelectPrediction}
                        onCompare={handleCompare}
                        onClose={() => setView('main')}
                        key={refreshHistory}
                    />
                )}

                {view === 'comparison' && (
                    <ComparisonView
                        userId={getUserId()}
                        predictionIds={comparisonIds}
                        onClose={() => setView('history')}
                    />
                )}

                {view === 'main' && (
                    <>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 mb-8 border border-white/20">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-white font-semibold mb-2">
                                {t('form.skillOrProject')}
                            </label>
                            <input
                                type="text"
                                value={currentSkill}
                                onChange={(e) => setCurrentSkill(e.target.value)}
                                placeholder={t('form.skillPlaceholder')}
                                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                        </div>

                        <div>
                            <label className="block text-white font-semibold mb-2">
                                {t('form.currentLevel')}
                            </label>
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { value: 'beginner', label: t('form.beginner') },
                                    { value: 'intermediate', label: t('form.intermediate') },
                                    { value: 'advanced', label: t('form.advanced') }
                                ].map((level) => (
                                    <button
                                        key={level.value}
                                        onClick={() => setCurrentLevel(level.value)}
                                        className={`py-3 rounded-lg font-medium transition-all ${currentLevel === level.value
                                            ? 'bg-purple-500 text-white shadow-lg scale-105'
                                            : 'bg-white/20 text-white hover:bg-white/30'
                                            }`}
                                    >
                                        {level.label}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setShowTest(true)}
                                    className="py-3 rounded-lg font-medium bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg transition-all"
                                >
                                    📝 {t('form.test')}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-white font-semibold mb-2">
                                {t('form.timeHorizon')}
                            </label>
                            <div className="space-y-3">
                                <div className="relative">
                                    <input
                                        type="range"
                                        min="0"
                                        max="120"
                                        value={timeframeMonths}
                                        onChange={(e) => setTimeframeMonths(parseInt(e.target.value))}
                                        className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer accent-pink-500 relative z-10"
                                        style={{
                                            background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${(timeframeMonths / 120) * 100}%, rgba(255,255,255,0.2) ${(timeframeMonths / 120) * 100}%, rgba(255,255,255,0.2) 100%)`
                                        }}
                                    />
                                    {/* Tick marks/stations */}
                                    <div className="absolute top-0 left-0 right-0 h-3 flex justify-between items-start pointer-events-none z-0 px-0">
                                        {[0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120].map((month, index) => (
                                            <div 
                                                key={month} 
                                                className="flex flex-col items-center"
                                                style={{ 
                                                    position: 'absolute',
                                                    left: `${(month / 120) * 100}%`,
                                                    transform: 'translateX(-50%)'
                                                }}
                                            >
                                                <div className="w-0.5 h-2 bg-white/50 mt-0.5"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Station labels */}
                                <div className="flex justify-between items-center text-white/60 text-xs -mt-1 relative">
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((year) => (
                                        <span 
                                            key={year} 
                                            className="text-center"
                                            style={{ 
                                                position: 'absolute',
                                                left: year === 0 ? '0' : year === 10 ? '100%' : `${(year / 10) * 100}%`,
                                                transform: year === 0 ? 'translateX(0)' : year === 10 ? 'translateX(-100%)' : 'translateX(-50%)'
                                            }}
                                        >
                                            {year === 0 ? '0' : year === 10 ? '10' : year}
                                        </span>
                                    ))}
                                </div>
                                {/* Current value display */}
                                <div className="flex justify-center items-center">
                                    <span className="text-white font-semibold text-lg">
                                        {(() => {
                                            if (timeframeMonths === 0) return `0 ${t('form.months', { count: 0 })}`;
                                            if (timeframeMonths < 12) return t('form.months', { count: timeframeMonths });
                                            const years = Math.floor(timeframeMonths / 12);
                                            const months = timeframeMonths % 12;
                                            if (years === 0) return t('form.months', { count: months });
                                            if (months === 0) {
                                                return years === 1 ? t('form.years', { count: 1 }) : t('form.years_plural', { count: years });
                                            }
                                            // Show both years and months if there's a remainder
                                            const yearText = years === 1 ? t('form.years', { count: 1 }) : t('form.years_plural', { count: years });
                                            const monthText = t('form.months', { count: months });
                                            return `${yearText} ${monthText}`;
                                        })()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={generatePredictions}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {t('form.lookingIntoFuture')}
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    {t('form.showFuture')}
                                </>
                            )}
                        </button>

                        {error && (
                            <div className="bg-red-500/20 border border-red-400 text-red-100 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                        {predictions && (
                            <>
                                <div className="flex gap-3 mb-4">
                                    <ExportShare
                                        prediction={predictions}
                                        skill={currentSkill}
                                        level={currentLevel}
                                        timeframe={timeframeMonths.toString()}
                                        userId={getUserId()}
                                        predictionId={currentPredictionId}
                                    />
                                </div>
                                <Predictions
                                    predictions={predictions}
                                    predictionId={currentPredictionId}
                                    userId={getUserId()}
                                    onProgressUpdate={() => setRefreshHistory(prev => prev + 1)}
                                    skill={currentSkill}
                                />
                                <LearningResources skill={currentSkill} />
                            </>
                        )}
                    </>
                )}
            </div>

            {showTest && (
                <TestModal
                    setShowTest={setShowTest}
                    testStep={testStep}
                    setTestStep={setTestStep}
                    testAnswers={testAnswers}
                    setTestAnswers={setTestAnswers}
                    setCurrentLevel={setCurrentLevel}
                />
            )}
        </div>
    );
}
