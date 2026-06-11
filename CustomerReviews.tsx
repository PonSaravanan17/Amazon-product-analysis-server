import React, { useState, useEffect } from "react";

interface CustomerReviewsProps {
    summary?: string;
    topReview?: string;
}

// ── Sentiment analysis helper ─────────────────────────────────────────────────
const POSITIVE_WORDS = ["great","excellent","amazing","love","perfect","best","good","awesome","fantastic","wonderful","happy","satisfied","recommend","easy","fast","quality","durable","nice","superb","outstanding","impressive","reliable","comfortable","works","helpful","brilliant","solid","value"];
const NEGATIVE_WORDS = ["bad","poor","terrible","awful","disappointed","horrible","worst","broken","slow","defective","cheap","flimsy","waste","useless","problem","issue","fail","failed","return","refund","avoid","disappointing","frustrating","wrong","missing","damage","damaged"];
const NEUTRAL_WORDS = ["okay","ok","average","decent","fine","alright","acceptable","moderate","normal","typical","standard","expected","mediocre","fair"];

const analyzeSentiment = (text: string): { positive: number; negative: number; neutral: number; score: number } => {
    const words = text.toLowerCase().split(/\W+/);
    let pos = 0, neg = 0, neu = 0;
    for (const w of words) {
        if (POSITIVE_WORDS.includes(w)) pos++;
        else if (NEGATIVE_WORDS.includes(w)) neg++;
        else if (NEUTRAL_WORDS.includes(w)) neu++;
    }
    const total = pos + neg + neu || 1;
    const score = ((pos - neg) / total + 1) / 2;
    return {
        positive: Math.round((pos / total) * 100),
        negative: Math.round((neg / total) * 100),
        neutral: Math.max(0, 100 - Math.round((pos / total) * 100) - Math.round((neg / total) * 100)),
        score,
    };
};

// Extract pseudo-phrases (consecutive relevant words) from review text
const extractThemes = (text: string): { theme: string; sentiment: "positive" | "negative" | "neutral" }[] => {
    const themes: { theme: string; sentiment: "positive" | "negative" | "neutral" }[] = [];
    const sentences = text.split(/[.!?,]+/).filter(s => s.trim().length > 5);
    for (const sentence of sentences.slice(0, 6)) {
        const lower = sentence.toLowerCase();
        const hasPos = POSITIVE_WORDS.some(w => lower.includes(w));
        const hasNeg = NEGATIVE_WORDS.some(w => lower.includes(w));
        const trimmed = sentence.trim().slice(0, 60);
        if (trimmed.length > 10) {
            themes.push({
                theme: trimmed + (sentence.trim().length > 60 ? "…" : ""),
                sentiment: hasNeg ? "negative" : hasPos ? "positive" : "neutral",
            });
        }
    }
    return themes;
};

const MAX_REVIEW_LENGTH = 300;

const SentimentBar: React.FC<{ label: string; value: number; color: string; delay?: number }> = ({ label, value, color, delay = 0 }) => {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const t = setTimeout(() => setWidth(value), 200 + delay);
        return () => clearTimeout(t);
    }, [value, delay]);

    return (
        <div className="flex items-center gap-3">
            <span className="text-xs w-16 shrink-0" style={{ fontFamily: "'DM Mono', monospace", color: "rgba(160,160,160,0.7)" }}>{label}</span>
            <div className="flex-1 sentiment-bar-track">
                <div className="sentiment-bar-fill" style={{ width: `${width}%`, background: color }} />
            </div>
            <span className="text-xs w-8 text-right shrink-0" style={{ fontFamily: "'DM Mono', monospace", color }}>{value}%</span>
        </div>
    );
};

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ summary, topReview }) => {
    const [activeFilter, setActiveFilter] = useState<"all" | "positive" | "negative" | "neutral">("all");
    const [isExpanded, setIsExpanded] = useState(false);

    if (!summary && !topReview) return null;

    const fullText = `${summary || ""} ${topReview || ""}`;
    const sentiment = analyzeSentiment(fullText);
    const themes = extractThemes(topReview || summary || "");

    const needsTruncation = topReview && topReview.length > MAX_REVIEW_LENGTH;
    const displayedReview = needsTruncation && !isExpanded
        ? topReview!.slice(0, MAX_REVIEW_LENGTH).replace(/\s+\S*$/, "") + "..."
        : topReview;

    const filteredThemes = activeFilter === "all"
        ? themes
        : themes.filter(t => t.sentiment === activeFilter);

    const sentimentColor = sentiment.score > 0.6 ? "#10b981" : sentiment.score < 0.4 ? "#ef4444" : "#f59e0b";
    const sentimentLabel = sentiment.score > 0.6 ? "Mostly Positive" : sentiment.score < 0.4 ? "Mixed/Negative" : "Neutral";

    return (
        <div className="section-card fade-up fade-up-6">
            {/* Header */}
            <div className="section-header">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Customer Feedback
            </div>

            {/* ── EXTENDED: Sentiment Analysis Panel ── */}
            <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {/* Overall score */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-xs text-secondary mb-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>Sentiment Score</div>
                        <div className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif", color: sentimentColor }}>
                            {Math.round(sentiment.score * 100)}
                            <span className="text-sm font-normal ml-0.5 opacity-70">/100</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="pill-badge" style={{
                            background: `${sentimentColor}18`,
                            color: sentimentColor,
                            border: `1px solid ${sentimentColor}30`,
                            fontFamily: "'Syne', sans-serif"
                        }}>
                            {sentimentLabel}
                        </span>
                    </div>
                </div>

                {/* Sentiment bars */}
                <div className="space-y-2.5">
                    <SentimentBar label="Positive" value={sentiment.positive} color="#10b981" delay={0} />
                    <SentimentBar label="Neutral" value={sentiment.neutral} color="#f59e0b" delay={100} />
                    <SentimentBar label="Negative" value={sentiment.negative} color="#ef4444" delay={200} />
                </div>
            </div>

            {/* AI Summary */}
            {summary && (
                <div className="mb-4 p-4 rounded-xl" style={{ background: "rgba(232,101,10,0.06)", border: "1px solid rgba(232,101,10,0.15)" }}>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#e8650a" }} />
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#e8650a", fontFamily: "'Syne', sans-serif" }}>AI Insights</span>
                    </div>
                    <p className="text-sm text-default leading-relaxed">{summary}</p>
                </div>
            )}

            {/* ── EXTENDED: Theme Filter + Top Review ── */}
            {topReview && (
                <div>
                    {/* Filter chips */}
                    {themes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {[
                                { key: "all", label: "All", count: themes.length },
                                { key: "positive", label: "Positive", count: themes.filter(t => t.sentiment === "positive").length },
                                { key: "neutral", label: "Neutral", count: themes.filter(t => t.sentiment === "neutral").length },
                                { key: "negative", label: "Negative", count: themes.filter(t => t.sentiment === "negative").length },
                            ].filter(chip => chip.count > 0 || chip.key === "all").map(chip => (
                                <button
                                    key={chip.key}
                                    onClick={() => setActiveFilter(chip.key as typeof activeFilter)}
                                    className={`review-chip ${activeFilter === chip.key
                                        ? chip.key === "positive" ? "review-chip-active-positive"
                                            : chip.key === "negative" ? "review-chip-active-negative"
                                                : chip.key === "neutral" ? "review-chip-active-neutral"
                                                    : "review-chip-active-positive"
                                        : "review-chip-inactive"
                                        }`}
                                >
                                    {chip.label}
                                    <span className="opacity-60">({chip.count})</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Themes extracted from review */}
                    {filteredThemes.length > 0 && (
                        <div className="space-y-1.5 mb-4">
                            {filteredThemes.map((theme, i) => {
                                const themeColor = theme.sentiment === "positive" ? "#10b981" : theme.sentiment === "negative" ? "#ef4444" : "#f59e0b";
                                return (
                                    <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg" style={{ background: `${themeColor}08`, border: `1px solid ${themeColor}18` }}>
                                        <span className="text-xs mt-0.5 shrink-0" style={{ color: themeColor }}>
                                            {theme.sentiment === "positive" ? "+" : theme.sentiment === "negative" ? "−" : "○"}
                                        </span>
                                        <span className="text-xs text-secondary leading-relaxed">{theme.theme}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Top review quote */}
                    <div className="relative pl-4" style={{ borderLeft: "2px solid rgba(232,101,10,0.3)" }}>
                        <div className="flex items-center gap-1 mb-1.5">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#e8650a"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                            ))}
                            <span className="ml-1 text-xs text-secondary" style={{ fontFamily: "'DM Mono', monospace" }}>Top Review</span>
                        </div>
                        <p className="text-sm text-secondary leading-relaxed italic">
                            "{displayedReview}"
                        </p>
                        {needsTruncation && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="mt-2 text-xs font-medium transition-colors"
                                style={{ color: "#e8650a" }}
                            >
                                {isExpanded ? "Show less ↑" : "Read full review ↓"}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="mt-4 pt-3 flex items-center gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <svg className="w-3.5 h-3.5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
                </svg>
                <span className="text-xs text-secondary">Sourced from verified Amazon customer reviews</span>
            </div>
        </div>
    );
};
