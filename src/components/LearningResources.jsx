import React, { useState, useEffect } from 'react';
import { Book, Video, FileText, ExternalLink, Loader2 } from 'lucide-react';

export default function LearningResources({ skill }) {
    const [resources, setResources] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (skill) {
            fetchResources();
        }
    }, [skill]);

    const fetchResources = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3001/api/resources/${encodeURIComponent(skill)}`);
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/71323d95-debc-4ecf-a311-79ceedb88b4e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LearningResources.jsx:17',message:'fetchResources response',data:{ok:response.ok,status:response.status,skill},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'J'})}).catch(()=>{});
            // #endregion
            if (response.ok) {
                const data = await response.json();
                setResources(data.resources);
            } else {
                console.error('Failed to fetch resources:', response.status);
                setResources(null);
            }
        } catch (error) {
            console.error('Error fetching resources:', error);
            setResources(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                    <Book className="w-6 h-6 text-blue-300" />
                    <h2 className="text-2xl font-bold text-white">Learning Resources</h2>
                </div>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-white/60 animate-spin" />
                </div>
            </div>
        );
    }

    if (!resources) {
        return null;
    }

    const getIcon = (type) => {
        switch (type) {
            case 'course':
                return <Video className="w-5 h-5" />;
            case 'book':
                return <Book className="w-5 h-5" />;
            case 'docs':
                return <FileText className="w-5 h-5" />;
            default:
                return <ExternalLink className="w-5 h-5" />;
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
                <Book className="w-6 h-6 text-blue-300" />
                <h2 className="text-2xl font-bold text-white">Learning Resources</h2>
            </div>

            <div className="space-y-6">
                {resources.courses && resources.courses.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <Video className="w-5 h-5 text-purple-300" />
                            Courses
                        </h3>
                        <div className="space-y-2">
                            {resources.courses.map((resource, idx) => (
                                <a
                                    key={idx}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-4 transition-all group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {getIcon(resource.type)}
                                            <div>
                                                <p className="text-white font-medium group-hover:text-purple-300 transition-colors">
                                                    {resource.title}
                                                </p>
                                                <p className="text-white/60 text-sm">{resource.platform}</p>
                                            </div>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {resources.books && resources.books.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <Book className="w-5 h-5 text-yellow-300" />
                            Books
                        </h3>
                        <div className="space-y-2">
                            {resources.books.map((resource, idx) => (
                                <a
                                    key={idx}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-4 transition-all group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {getIcon(resource.type)}
                                            <div>
                                                <p className="text-white font-medium group-hover:text-yellow-300 transition-colors">
                                                    {resource.title}
                                                </p>
                                                {resource.author && (
                                                    <p className="text-white/60 text-sm">by {resource.author}</p>
                                                )}
                                            </div>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {resources.documentation && resources.documentation.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-green-300" />
                            Documentation
                        </h3>
                        <div className="space-y-2">
                            {resources.documentation.map((resource, idx) => (
                                <a
                                    key={idx}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-4 transition-all group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {getIcon(resource.type)}
                                            <p className="text-white font-medium group-hover:text-green-300 transition-colors">
                                                {resource.title}
                                            </p>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

