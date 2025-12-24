import React, { useState } from 'react';
import { Download, Share2, Link2, FileText, X, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatTimeframe } from '../utils/timeframeFormatter';

export default function ExportShare({ prediction, skill, level, timeframe, userId, predictionId }) {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [shareLink, setShareLink] = useState('');
    const [copied, setCopied] = useState(false);
    
    const formatTimeframeForExport = () => {
        const months = parseInt(timeframe) || 12;
        return formatTimeframe(months, t);
    };

    const generateShareLink = () => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/71323d95-debc-4ecf-a311-79ceedb88b4e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ExportShare.jsx:9',message:'generateShareLink called',data:{hasPredictionId:!!predictionId,hasPredictionObjId:!!prediction?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        const link = `${window.location.origin}?share=${predictionId || prediction?.id || 'temp'}`;
        setShareLink(link);
        return link;
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const exportToPDF = () => {
        const content = generatePDFContent();
        const printWindow = window.open('', '_blank');
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.print();
    };

    const exportToMarkdown = () => {
        const markdown = generateMarkdown();
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${skill}-prediction-${new Date().toISOString().split('T')[0]}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const generatePDFContent = () => {
        const timeframeStr = formatTimeframeForExport();
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Future Prediction - ${skill}</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #333; }
        .container { background: white; padding: 40px; border-radius: 20px; max-width: 800px; margin: 0 auto; }
        h1 { color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 10px; }
        h2 { color: #764ba2; margin-top: 30px; }
        .meta { background: #f5f5f5; padding: 15px; border-radius: 10px; margin: 20px 0; }
        .milestone { background: #f9f9f9; padding: 15px; margin: 10px 0; border-left: 4px solid #667eea; border-radius: 5px; }
        ul, ol { line-height: 1.8; }
        .badge { display: inline-block; background: #667eea; color: white; padding: 5px 15px; border-radius: 20px; margin: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Future Prediction: ${skill}</h1>
        <div class="meta">
            <p><strong>Current Level:</strong> ${level}</p>
            <p><strong>Time Horizon:</strong> ${timeframeStr}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <h2>Your Direction</h2>
        <p>${prediction.trajectory || 'No trajectory available'}</p>
        
        <h2>Key Milestones</h2>
        ${prediction.milestones?.map(m => `
            <div class="milestone">
                <strong>${m.period}:</strong> ${m.achievement}
                <div style="margin-top: 10px;">
                    ${m.skills?.map(s => `<span class="badge">${s}</span>`).join('')}
                </div>
            </div>
        `).join('') || '<p>No milestones available</p>'}
        
        <h2>Opportunities</h2>
        <ul>
            ${prediction.opportunities?.map(o => `<li>${o}</li>`).join('') || '<li>No opportunities listed</li>'}
        </ul>
        
        <h2>Risks</h2>
        <ul>
            ${prediction.risks?.map(r => `<li>${r}</li>`).join('') || '<li>No risks listed</li>'}
        </ul>
        
        <h2>Next Steps</h2>
        <ol>
            ${prediction.nextSteps?.map(s => `<li>${s}</li>`).join('') || '<li>No next steps listed</li>'}
        </ol>
    </div>
</body>
</html>
        `;
    };

    const generateMarkdown = () => {
        const timeframeStr = formatTimeframeForExport();
        return `# Future Prediction: ${skill}

**Current Level:** ${level}  
**Time Horizon:** ${timeframeStr}  
**Generated:** ${new Date().toLocaleDateString()}

## Your Direction

${prediction.trajectory || 'No trajectory available'}

## Key Milestones

${prediction.milestones?.map((m, i) => `
### ${i + 1}. ${m.period}

${m.achievement}

**Skills:** ${m.skills?.join(', ') || 'N/A'}
`).join('\n') || 'No milestones available'}

## Opportunities

${prediction.opportunities?.map((o, i) => `${i + 1}. ${o}`).join('\n') || 'No opportunities listed'}

## Risks

${prediction.risks?.map((r, i) => `${i + 1}. ${r}`).join('\n') || 'No risks listed'}

## Next Steps

${prediction.nextSteps?.map((s, i) => `${i + 1}. ${s}`).join('\n') || 'No next steps listed'}

---
*Generated by Future Simulator*
`;
    };

    const shareToSocial = (platform) => {
        const text = `Check out my ${skill} development prediction!`;
        const url = shareLink || generateShareLink();
        
        const urls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        };
        
        if (urls[platform]) {
            window.open(urls[platform], '_blank', 'width=600,height=400');
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition-all flex items-center gap-2"
            >
                <Share2 className="w-5 h-5" />
                {t('export.share', 'Export & Share')}
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="max-w-2xl w-full bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-white">{t('export.share', 'Export & Share')}</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-white/60 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-white font-semibold mb-3">{t('export.export', 'Export')}</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={exportToPDF}
                                        className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <FileText className="w-5 h-5" />
                                        {t('export.pdf', 'Export PDF')}
                                    </button>
                                    <button
                                        onClick={exportToMarkdown}
                                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-5 h-5" />
                                        Export Markdown
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-white font-semibold mb-3">{t('export.shareLink', 'Share Link')}</h4>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={shareLink || generateShareLink()}
                                        readOnly
                                        className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(shareLink || generateShareLink())}
                                        className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition-all flex items-center gap-2"
                                    >
                                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                        {copied ? t('export.copied', 'Copied!') : t('export.copy', 'Copy')}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-white font-semibold mb-3">{t('export.socialMedia', 'Share on Social Media')}</h4>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => shareToSocial('twitter')}
                                        className="bg-[#1DA1F2] text-white px-4 py-3 rounded-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <Share2 className="w-5 h-5" />
                                        Twitter
                                    </button>
                                    <button
                                        onClick={() => shareToSocial('linkedin')}
                                        className="bg-[#0077B5] text-white px-4 py-3 rounded-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <Share2 className="w-5 h-5" />
                                        LinkedIn
                                    </button>
                                    <button
                                        onClick={() => shareToSocial('facebook')}
                                        className="bg-[#1877F2] text-white px-4 py-3 rounded-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <Share2 className="w-5 h-5" />
                                        Facebook
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

