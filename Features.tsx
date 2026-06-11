import React, { useState } from "react";

interface FeaturesProps {
    features: string[];
}

const truncateText = (text: string, maxLength: number = 200): { truncated: string; isTruncated: boolean } => {
    const firstSentenceMatch = text.match(/^[^.!?]*[.!?]/);
    if (firstSentenceMatch && firstSentenceMatch[0].length <= maxLength) {
        return { truncated: firstSentenceMatch[0], isTruncated: text.length > firstSentenceMatch[0].length };
    }
    if (text.length <= maxLength) return { truncated: text, isTruncated: false };
    const truncated = text.slice(0, maxLength).replace(/\s+\S*$/, "");
    return { truncated: truncated + "...", isTruncated: true };
};

const ACCENT_COLORS = [
    { dot: "#e8650a", bg: "rgba(232,101,10,0.1)", border: "rgba(232,101,10,0.2)" },
    { dot: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
    { dot: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
    { dot: "#6366f1", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.2)" },
    { dot: "#ec4899", bg: "rgba(236,72,153,0.1)", border: "rgba(236,72,153,0.2)" },
];

interface FeatureItemProps {
    feature: string;
    index: number;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ feature, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { truncated, isTruncated } = truncateText(feature);
    const color = ACCENT_COLORS[index % ACCENT_COLORS.length];

    return (
        <div className="feature-row group">
            {/* Numbered indicator */}
            <div
                className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white mt-0.5"
                style={{ background: color.dot }}
            >
                {index + 1}
            </div>

            {/* Feature text */}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-default leading-relaxed">
                    {isExpanded ? feature : truncated}
                </p>
                {isTruncated && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-1 text-xs font-medium transition-colors"
                        style={{ color: color.dot }}
                    >
                        {isExpanded ? "Show less ↑" : "Read more ↓"}
                    </button>
                )}
            </div>
        </div>
    );
};

// ── Extended: Feature Category Analysis ──────────────────────────────────────
const categorizeFeatures = (features: string[]): Record<string, string[]> => {
    const categories: Record<string, string[]> = {
        "Performance": [],
        "Design": [],
        "Connectivity": [],
        "Safety": [],
        "Other": [],
    };
    const keywords: Record<string, string[]> = {
        "Performance": ["processor", "cpu", "speed", "fast", "power", "battery", "performance", "ram", "memory", "storage", "ghz", "mhz", "watt"],
        "Design": ["design", "color", "colour", "material", "weight", "dimension", "size", "compact", "slim", "portable", "finish", "look"],
        "Connectivity": ["bluetooth", "wifi", "wireless", "usb", "hdmi", "port", "connect", "sync", "network", "lan", "5g", "4g"],
        "Safety": ["safe", "certified", "protection", "waterproof", "dustproof", "warranty", "guarantee", "standard", "comply"],
    };
    for (const feature of features) {
        const lower = feature.toLowerCase();
        let placed = false;
        for (const [cat, kws] of Object.entries(keywords)) {
            if (kws.some(k => lower.includes(k))) {
                categories[cat].push(feature);
                placed = true;
                break;
            }
        }
        if (!placed) categories["Other"].push(feature);
    }
    return Object.fromEntries(Object.entries(categories).filter(([, v]) => v.length > 0));
};

const MAX_FEATURES_DISPLAY = 5;

export const Features: React.FC<FeaturesProps> = ({ features }) => {
    const [showCategoryView, setShowCategoryView] = useState(false);
    const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());

    if (!features || features.length === 0) return null;

    const displayedFeatures = features.slice(0, MAX_FEATURES_DISPLAY);
    const categories = categorizeFeatures(features);
    const catEntries = Object.entries(categories);

    const toggleCat = (cat: string) => {
        setExpandedCats(prev => {
            const next = new Set(prev);
            if (next.has(cat)) next.delete(cat);
            else next.add(cat);
            return next;
        });
    };

    return (
        <div className="section-card fade-up fade-up-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="section-header">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" fill="currentColor" />
                    </svg>
                    Key Features
                    <span className="ml-1 text-xs font-normal opacity-60" style={{ fontFamily: "'DM Mono', monospace", textTransform: "none", letterSpacing: 0 }}>
                        {features.length} total
                    </span>
                </div>

                {/* Toggle: List / Category view */}
                <div className="flex gap-1 p-0.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <button
                        onClick={() => setShowCategoryView(false)}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold transition-all"
                        style={!showCategoryView ? { background: "#e8650a", color: "white" } : { color: "rgba(160,160,160,0.8)" }}
                    >
                        List
                    </button>
                    <button
                        onClick={() => setShowCategoryView(true)}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold transition-all"
                        style={showCategoryView ? { background: "#e8650a", color: "white" } : { color: "rgba(160,160,160,0.8)" }}
                    >
                        By Category
                    </button>
                </div>
            </div>

            {/* List View */}
            {!showCategoryView && (
                <div className="space-y-2">
                    {displayedFeatures.map((feature, index) => (
                        <FeatureItem key={index} feature={feature} index={index} />
                    ))}
                    {features.length > MAX_FEATURES_DISPLAY && (
                        <div className="pt-2 text-center">
                            <span className="pill-badge pill-badge-orange">
                                +{features.length - MAX_FEATURES_DISPLAY} more features
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Category View (Extended) */}
            {showCategoryView && (
                <div className="space-y-3">
                    {catEntries.map(([cat, items], catIdx) => {
                        const color = ACCENT_COLORS[catIdx % ACCENT_COLORS.length];
                        const isOpen = expandedCats.has(cat);
                        return (
                            <div
                                key={cat}
                                className="rounded-xl overflow-hidden"
                                style={{ border: `1px solid ${color.border}`, background: color.bg }}
                            >
                                <button
                                    onClick={() => toggleCat(cat)}
                                    className="w-full flex items-center justify-between px-4 py-3"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full" style={{ background: color.dot }} />
                                        <span className="text-sm font-semibold text-default" style={{ fontFamily: "'Syne', sans-serif" }}>{cat}</span>
                                        <span className="text-xs opacity-60" style={{ fontFamily: "'DM Mono', monospace", color: color.dot }}>
                                            {items.length}
                                        </span>
                                    </div>
                                    <svg
                                        className="w-4 h-4 transition-transform duration-200"
                                        style={{ transform: isOpen ? "rotate(180deg)" : "", color: color.dot }}
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </button>
                                {isOpen && (
                                    <div className="px-4 pb-3 space-y-2 border-t" style={{ borderColor: color.border }}>
                                        {items.map((f, i) => (
                                            <p key={i} className="text-xs text-secondary leading-relaxed pt-2">
                                                <span className="mr-2" style={{ color: color.dot }}>›</span>{f}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
