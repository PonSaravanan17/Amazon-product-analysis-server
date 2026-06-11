import React from "react";
import type { DeliveryOption } from "../types";

interface DeliveryInfoProps {
    delivery: DeliveryOption[];
    availability?: string;
    stockQuantity?: number;
}

const getAvailabilityStyle = (availability?: string) => {
    if (!availability) return { color: "#9ca3af", bg: "rgba(156,163,175,0.08)", dot: "#9ca3af" };
    const lower = availability.toLowerCase();
    if (lower.includes("in stock")) return { color: "#10b981", bg: "rgba(16,185,129,0.08)", dot: "#10b981" };
    if (lower.includes("only") || lower.includes("few")) return { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", dot: "#f59e0b" };
    if (lower.includes("out") || lower.includes("unavailable")) return { color: "#ef4444", bg: "rgba(239,68,68,0.08)", dot: "#ef4444" };
    return { color: "#6366f1", bg: "rgba(99,102,241,0.08)", dot: "#6366f1" };
};

export const DeliveryInfo: React.FC<DeliveryInfoProps> = ({ delivery, availability, stockQuantity }) => {
    if (!delivery || delivery.length === 0) return null;
    const avStyle = getAvailabilityStyle(availability);

    return (
        <div className="section-card fade-up fade-up-4">
            <div className="section-header">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" rx="1" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                Delivery & Availability
            </div>

            {/* Availability pill */}
            {availability && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: avStyle.bg, border: `1px solid ${avStyle.dot}30` }}>
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: avStyle.dot }} />
                    <span className="text-sm font-medium" style={{ color: avStyle.color, fontFamily: "'Syne', sans-serif" }}>{availability}</span>
                    {stockQuantity && stockQuantity > 0 && stockQuantity <= 10 && (
                        <span className="text-xs text-secondary">({stockQuantity} left)</span>
                    )}
                </div>
            )}

            {/* Delivery options */}
            <div className="space-y-2.5">
                {delivery.map((option, index) => {
                    const isFast = option.type === "fast";
                    const isFree = option.text.toLowerCase().includes("free");
                    return (
                        <div
                            key={index}
                            className="flex items-start gap-3 p-4 rounded-xl"
                            style={{
                                background: isFast ? "rgba(232,101,10,0.06)" : "rgba(255,255,255,0.02)",
                                border: `1px solid ${isFast ? "rgba(232,101,10,0.2)" : "rgba(255,255,255,0.06)"}`,
                            }}
                        >
                            <div
                                className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                                style={{ background: isFast ? "#e8650a" : "rgba(99,102,241,0.12)", color: isFast ? "white" : "#6366f1" }}
                            >
                                {isFast ? (
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="1" y="3" width="15" height="13" rx="1" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                                    </svg>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                    {isFast && <span className="pill-badge pill-badge-orange">Fastest</span>}
                                    {isFree && <span className="pill-badge pill-badge-green">Free</span>}
                                </div>
                                <p className="text-sm text-default leading-relaxed">{option.text}</p>
                                {option.date && (
                                    <p className="text-xs text-secondary mt-1 flex items-center gap-1">
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                        Arrives: {option.date}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Stock indicator */}
            {stockQuantity && stockQuantity > 0 && (
                <div className="mt-3 pt-3 flex items-center gap-2 text-xs text-secondary" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                    {stockQuantity > 10 ? "Ships soon from warehouse" : `Only ${stockQuantity} left — order soon`}
                </div>
            )}
        </div>
    );
};
