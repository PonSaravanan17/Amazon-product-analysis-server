import React, { useState } from "react";
import type { Specification } from "../types";

interface ProductSpecsProps {
    specifications: Specification[];
}

const KEY_SPEC_TYPES = ["Brand","Screen Size","RAM Memory Installed Size","Hard Disk Size","CPU Model","Processor Type","Operating System","Colour","Resolution","Item Weight"];
const MAX_COLLAPSED_SPECS = 6;

export const ProductSpecs: React.FC<ProductSpecsProps> = ({ specifications }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!specifications || specifications.length === 0) return null;

    const seen = new Set<string>();
    const uniqueSpecs = specifications.filter((spec) => {
        const key = spec.type.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    const sortedSpecs = [...uniqueSpecs].sort((a, b) => {
        const aIdx = KEY_SPEC_TYPES.findIndex(k => a.type.toLowerCase().includes(k.toLowerCase()));
        const bIdx = KEY_SPEC_TYPES.findIndex(k => b.type.toLowerCase().includes(k.toLowerCase()));
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;
        return a.type.localeCompare(b.type);
    });

    const displayedSpecs = isExpanded ? sortedSpecs : sortedSpecs.slice(0, MAX_COLLAPSED_SPECS);
    const hasMore = sortedSpecs.length > MAX_COLLAPSED_SPECS;

    return (
        <div className="section-card fade-up fade-up-7">
            <div className="flex items-center justify-between mb-4">
                <div className="section-header" style={{ marginBottom: 0 }}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    Specifications
                </div>
                <span className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "rgba(160,160,160,0.4)" }}>
                    {sortedSpecs.length} specs
                </span>
            </div>

            <div>
                {displayedSpecs.map((spec, index) => (
                    <div key={`${spec.type}-${index}`} className="spec-row">
                        <span className="spec-label">{spec.type}</span>
                        <span className="spec-value text-default">{spec.value}</span>
                    </div>
                ))}
            </div>

            {hasMore && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-secondary transition-all"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(232,101,10,0.06)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                >
                    {isExpanded ? "Show less" : `Show all ${sortedSpecs.length} specifications`}
                    <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" strokeLinecap="round" />
                    </svg>
                </button>
            )}
        </div>
    );
};
