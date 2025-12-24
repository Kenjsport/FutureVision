import React from 'react';
import { X } from 'lucide-react';

export default function TestModal({ setShowTest, testStep, setTestStep, testAnswers, setTestAnswers, setCurrentLevel }) {
    const testQuestions = [
        {
            q: 'How long have you been working on this skill?',
            options: ['Only started', '1-6 months', '6-12 months', 'More than a year']
        },
        {
            q: 'Can you create projects independently?',
            options: ['No, need help', 'Simple - yes', 'Medium complexity - yes', 'Complex - yes']
        },
        {
            q: 'How often do you practice?',
            options: ['Rarely', '1-2 times a week', '3-5 times a week', 'Every day']
        },
        {
            q: 'Do you understand the basic concepts?',
            options: ['Not at all', 'Surface level', 'Good', 'Excellent, can explain']
        }
    ];

    const handleTestAnswer = (answerIndex) => {
        const newAnswers = [...testAnswers, answerIndex];
        setTestAnswers(newAnswers);

        if (testStep < testQuestions.length - 1) {
            setTestStep(testStep + 1);
        } else {
            const avg = newAnswers.reduce((a, b) => a + b, 0) / newAnswers.length;
            if (avg < 1) setCurrentLevel('beginner');
            else if (avg < 2.5) setCurrentLevel('intermediate');
            else setCurrentLevel('advanced');

            setShowTest(false);
            setTestStep(0);
            setTestAnswers([]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="max-w-lg w-full bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-white">Test</h3>
                    <button
                        onClick={() => {
                            setShowTest(false);
                            setTestStep(0);
                            setTestAnswers([]);
                        }}
                        className="text-white/60 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="mb-6">
                    <div className="flex gap-2 mb-4">
                        {testQuestions.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-2 flex-1 rounded-full ${idx <= testStep ? 'bg-purple-400' : 'bg-white/20'
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-white/60 text-sm">
                        Question {testStep + 1} of {testQuestions.length}
                    </p>
                </div>

                <div className="mb-8">
                    <h4 className="text-xl text-white font-semibold mb-6">
                        {testQuestions[testStep].q}
                    </h4>
                    <div className="space-y-3">
                        {testQuestions[testStep].options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleTestAnswer(idx)}
                                className="w-full text-left px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
