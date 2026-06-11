import React from "react";
import type { SellerInfo as SellerInfoType, Ranking } from "../types";

interface SellerInfoProps {
    seller?: SellerInfoType;
    rankings?: Ranking[];
    categories?: string[];
}

const getRankStyle = (rank: number) => {
    if (rank <= 10) return { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", badge: "🏆" };
    if (rank <= 50) return { color: "#9ca3af", bg: "rgba(156,163,175,0.1)", badge: "🥈" };
    if (rank <= 100) return { color: "#cd7c4e", bg: "rgba(180,100,60,0.1)", badge: "🥉" };
    return { color: "#6b7280", bg: "rgba(107,114,128,0.08)", badge: "" };
};

const formatRank = (rank: number): string => {
    if (rank >= 1000) return `#${(rank / 1000).toFixed(1)}K`;
    return `#${rank.toLocaleString()}`;
};

export const SellerInfo: React.FC<SellerInfoProps> = ({ seller, rankings, categories }) => {
    if (!seller && (!rankings || rankings.length === 0) && (!categories || categories.length === 0)) return null;

    return (
        <div className="section-card fade-up fade-up-5">
            <div className="section-header">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Seller & Rankings
            </div>

            <div className="space-y-4">
                {/* Seller details */}
                {seller && (
                    <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <div className="space-y-2.5">
                            {seller.soldBy && (
                                <div className="flex items-center gap-3">
                                    <span className="text-xs shrink-0" style={{ fontFamily: "'DM Mono', monospace", color: "rgba(160,160,160,0.5)", textTransform: "uppercase", letterSpacing: "0.05em", width: "70px" }}>Sold by</span>
                                    <span className="text-sm font-semibold text-default">{seller.soldBy}</span>
                                </div>
                            )}
                            {seller.name && seller.name !== seller.soldBy && (
                                <div className="flex items-center gap-3">
                                    <span className="text-xs shrink-0" style={{ fontFamily: "'DM Mono', monospace", color: "rgba(160,160,160,0.5)", textTransform: "uppercase", letterSpacing: "0.05em", width: "70px" }}>Seller</span>
                                    <span className="text-sm text-secondary">{seller.name}</span>
                                </div>
                            )}
                            {seller.shipsFrom && (
                                <div className="flex items-center gap-3">
                                    <span className="text-xs shrink-0" style={{ fontFamily: "'DM Mono', monospace", color: "rgba(160,160,160,0.5)", textTransform: "uppercase", letterSpacing: "0.05em", width: "70px" }}>Ships from</span>
                                    <span className="text-sm text-secondary flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="1" y="3" width="15" height="13" rx="1" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                            <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                                        </svg>
                                        {seller.shipsFrom}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Rankings */}
                {rankings && rankings.length > 0 && (
                    <div>
                        <div className="flex items-center gap-1.5 mb-2.5">
                            <svg className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                                <path d="M4 22h16" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                            </svg>
                            <span className="text-xs font-semibold text-secondary uppercase tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>Best Sellers Rank</span>
                        </div>
                        <div className="space-y-2">
                            {rankings.map((ranking, index) => {
                                const rs = getRankStyle(ranking.rank);
                                return (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: rs.bg, border: `1px solid ${rs.color}20` }}>
                                        <div className="shrink-0 px-3 py-1 rounded-lg text-sm font-bold" style={{ background: `${rs.color}20`, color: rs.color, fontFamily: "'DM Mono', monospace" }}>
                                            {rs.badge} {formatRank(ranking.rank)}
                                        </div>
                                        <span className="text-xs text-secondary truncate">in {ranking.category}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Categories breadcrumb */}
                {categories && categories.length > 0 && (
                    <div className="pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="text-xs mb-2" style={{ fontFamily: "'DM Mono', monospace", color: "rgba(160,160,160,0.5)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Category</div>
                        <div className="flex flex-wrap items-center gap-1.5">
                            {categories.map((cat, i) => (
                                <React.Fragment key={i}>
                                    <span className="px-2 py-1 text-xs text-secondary rounded-md" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                        {cat}
                                    </span>
                                    {i < categories.length - 1 && (
                                        <svg className="w-3 h-3 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
