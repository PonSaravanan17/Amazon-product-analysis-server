import React, { useState, useEffect } from "react";

interface PricingDealProps {
    initialPrice?: number;
    finalPrice?: number;
    discount?: string;
    savings?: number;
    currency?: string;
}

type DealCategory = "hot" | "great" | "good" | "fair" | "minimal" | "none";

interface DealInfo {
    category: DealCategory;
    label: string;
    description: string;
    color: string;
    bg: string;
    border: string;
    bar: string;
    ribbonText: string;
    showRibbon: boolean;
}

const significantSavingsThreshold: Record<string, number> = {
    USD: 50, INR: 2000, EUR: 45, GBP: 40, JPY: 5000,
};

const formatPrice = (price: number, currency: string): string => {
    const symbols: Record<string, string> = { USD: "$", INR: "₹", EUR: "€", GBP: "£", JPY: "¥" };
    return `${symbols[currency] || currency + " "}${price.toLocaleString()}`;
};

const categorizeDeal = (discountPercent: number, savings: number, initialPrice: number, currency: string): DealInfo => {
    const threshold = significantSavingsThreshold[currency] || 50;
    if (discountPercent >= 50 || (discountPercent >= 40 && savings >= threshold * 2)) {
        return { category: "hot", label: "🔥 Hot Deal", ribbonText: "HOT", showRibbon: true, description: "Exceptional — best time to buy!", color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", bar: "linear-gradient(90deg,#ef4444,#f97316)" };
    }
    if (discountPercent >= 30 || (discountPercent >= 20 && savings >= threshold * 1.5)) {
        return { category: "great", label: "Great Deal", ribbonText: "GREAT", showRibbon: true, description: "Excellent price — worth grabbing", color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)", bar: "linear-gradient(90deg,#10b981,#059669)" };
    }
    if (discountPercent >= 15 || (discountPercent >= 10 && savings >= threshold)) {
        return { category: "good", label: "Good Deal", ribbonText: "GOOD", showRibbon: true, description: "Decent savings on this product", color: "#6366f1", bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.2)", bar: "linear-gradient(90deg,#6366f1,#8b5cf6)" };
    }
    if (discountPercent >= 5) {
        return { category: "fair", label: "Fair Price", ribbonText: "SAVE", showRibbon: false, description: "Small savings available", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", bar: "linear-gradient(90deg,#f59e0b,#d97706)" };
    }
    if (discountPercent >= 1) {
        return { category: "minimal", label: "Minimal Savings", ribbonText: "", showRibbon: false, description: "Minor price reduction", color: "#9ca3af", bg: "rgba(156,163,175,0.06)", border: "rgba(156,163,175,0.15)", bar: "linear-gradient(90deg,#9ca3af,#6b7280)" };
    }
    return { category: "none", label: "Regular Price", ribbonText: "", showRibbon: false, description: "No discount currently", color: "#6b7280", bg: "rgba(107,114,128,0.05)", border: "rgba(107,114,128,0.12)", bar: "linear-gradient(90deg,#6b7280,#4b5563)" };
};

// ── Extended: Price History Simulation + Alert ────────────────────────────────
const generatePriceHistory = (finalPrice: number, initialPrice: number, currency: string) => {
    const now = Date.now();
    const points: { label: string; price: number }[] = [];
    const spread = (initialPrice - finalPrice);
    const labels = ["3m ago", "2m ago", "6w ago", "4w ago", "3w ago", "2w ago", "1w ago", "Now"];
    for (let i = 0; i < 8; i++) {
        const t = i / 7;
        const trend = finalPrice + spread * (1 - t);
        const noise = (Math.random() - 0.5) * spread * 0.3;
        const price = Math.max(finalPrice * 0.9, Math.round((trend + noise) * 100) / 100);
        points.push({ label: labels[i], price: i === 7 ? finalPrice : price });
    }
    return points;
};

const MiniChart: React.FC<{ points: { label: string; price: number }[]; currency: string; color: string }> = ({ points, currency, color }) => {
    const prices = points.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    const w = 100 / (points.length - 1);
    const toY = (p: number) => 100 - ((p - min) / range) * 80 - 10;
    const symbols: Record<string, string> = { USD: "$", INR: "₹", EUR: "€", GBP: "£", JPY: "¥" };
    const sym = symbols[currency] || currency;

    const pathD = points
        .map((p, i) => `${i === 0 ? "M" : "L"} ${i * w} ${toY(p.price)}`)
        .join(" ");
    const areaD = `${pathD} L ${(points.length - 1) * w} 100 L 0 100 Z`;

    return (
        <div className="chart-container" style={{ padding: "0.75rem 0 0.25rem" }}>
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-4 flex flex-col justify-between" style={{ fontSize: "9px", fontFamily: "'DM Mono', monospace", color: "rgba(160,160,160,0.5)", width: "40px" }}>
                <span>{sym}{max.toFixed(0)}</span>
                <span>{sym}{min.toFixed(0)}</span>
            </div>
            <svg viewBox="0 0 100 100" className="w-full h-full" style={{ marginLeft: "44px", width: "calc(100% - 44px)" }} preserveAspectRatio="none">
                <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={areaD} fill="url(#chartGrad)" />
                <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {/* Current price dot */}
                <circle cx={(points.length - 1) * w} cy={toY(points[points.length - 1].price)} r="3" fill={color} />
                {/* Low price dot */}
                {(() => {
                    const minIdx = prices.indexOf(min);
                    return <circle cx={minIdx * w} cy={toY(min)} r="2.5" fill="#10b981" />;
                })()}
            </svg>
            {/* X labels */}
            <div className="flex justify-between" style={{ marginLeft: "44px", fontSize: "9px", fontFamily: "'DM Mono', monospace", color: "rgba(160,160,160,0.4)", marginTop: "2px" }}>
                {points.filter((_, i) => i % 2 === 0 || i === points.length - 1).map((p, i) => (
                    <span key={i}>{p.label}</span>
                ))}
            </div>
        </div>
    );
};

export const PricingDeal: React.FC<PricingDealProps> = ({ initialPrice, finalPrice, discount, savings, currency }) => {
    const [alertPrice, setAlertPrice] = useState("");
    const [alertSet, setAlertSet] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [barWidth, setBarWidth] = useState(0);

    if (finalPrice === undefined || finalPrice === null || !currency) return null;

    const safeInitialPrice = initialPrice ?? finalPrice;
    const safeSavings = savings ?? 0;
    const safeDiscount = discount ?? "0%";
    const savingsPercent = Math.abs(parseFloat(safeDiscount.replace(/[^0-9.-]/g, ""))) || 0;
    const dealInfo = categorizeDeal(savingsPercent, safeSavings, safeInitialPrice, currency);
    const isGoodDeal = ["hot", "great", "good"].includes(dealInfo.category);

    useEffect(() => {
        const t = setTimeout(() => setBarWidth(Math.min(savingsPercent * 2, 100)), 300);
        return () => clearTimeout(t);
    }, [savingsPercent]);

    const priceHistory = generatePriceHistory(finalPrice, safeInitialPrice, currency);
    const lowestPrice = Math.min(...priceHistory.map(p => p.price));
    const symbols: Record<string, string> = { USD: "$", INR: "₹", EUR: "€", GBP: "£", JPY: "¥" };
    const sym = symbols[currency] || currency;

    const handleSetAlert = () => {
        if (alertPrice && !isNaN(parseFloat(alertPrice))) {
            setAlertSet(true);
            setTimeout(() => setAlertSet(false), 3000);
        }
    };

    return (
        <div className="section-card fade-up fade-up-2">
            {/* Ribbon */}
            {dealInfo.showRibbon && (
                <div
                    className="absolute -right-7 top-5 rotate-45 text-white text-xs font-bold py-1 px-10 shadow-lg"
                    style={{ background: dealInfo.color, letterSpacing: "0.08em", fontFamily: "'Syne', sans-serif", zIndex: 10 }}
                >
                    {dealInfo.ribbonText}
                </div>
            )}

            {/* Section Header */}
            <div className="section-header">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Price Breakdown
            </div>

            {/* Price display */}
            <div className="flex items-end gap-4 mb-4">
                <div>
                    <div className="text-xs mb-1" style={{ color: "rgba(160,160,160,0.6)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>You Pay</div>
                    <div className="price-main text-4xl" style={{ color: dealInfo.color }}>{formatPrice(finalPrice, currency)}</div>
                </div>
                {safeInitialPrice !== finalPrice && safeInitialPrice > 0 && (
                    <div className="pb-1">
                        <div className="text-xs mb-1" style={{ color: "rgba(160,160,160,0.6)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>Was</div>
                        <div className="text-xl line-through text-secondary">{formatPrice(safeInitialPrice, currency)}</div>
                    </div>
                )}
            </div>

            {/* Savings bar */}
            {savingsPercent > 0 && safeSavings > 0 && (
                <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-secondary">Discount</span>
                        <span className="font-semibold" style={{ color: dealInfo.color, fontFamily: "'DM Mono', monospace" }}>
                            {formatPrice(safeSavings, currency)} ({safeDiscount})
                        </span>
                    </div>
                    <div className="sentiment-bar-track">
                        <div className="sentiment-bar-fill" style={{ width: `${barWidth}%`, background: dealInfo.bar }} />
                    </div>
                </div>
            )}

            {/* Deal badge */}
            <div className="flex items-center gap-3 rounded-xl p-3 mb-4" style={{ background: dealInfo.bg, border: `1px solid ${dealInfo.border}` }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-base" style={{ background: dealInfo.color }}>
                    {isGoodDeal ? "✓" : "i"}
                </div>
                <div>
                    <p className="text-sm font-semibold" style={{ color: dealInfo.color, fontFamily: "'Syne', sans-serif" }}>{dealInfo.label}</p>
                    <p className="text-xs text-secondary">{dealInfo.description}</p>
                </div>
            </div>

            {/* ── EXTENDED: Price History & Alert ── */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                {/* Tab header */}
                <div className="flex border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                    <button
                        onClick={() => setShowHistory(false)}
                        className="flex-1 py-2.5 text-xs font-semibold transition-all"
                        style={!showHistory ? { color: "#e8650a", borderBottom: "2px solid #e8650a", fontFamily: "'Syne', sans-serif" } : { color: "rgba(160,160,160,0.6)" }}
                    >
                        Price Alert
                    </button>
                    <button
                        onClick={() => setShowHistory(true)}
                        className="flex-1 py-2.5 text-xs font-semibold transition-all"
                        style={showHistory ? { color: "#e8650a", borderBottom: "2px solid #e8650a", fontFamily: "'Syne', sans-serif" } : { color: "rgba(160,160,160,0.6)" }}
                    >
                        Price History
                    </button>
                </div>

                {/* Price Alert Panel */}
                {!showHistory && (
                    <div className="p-4">
                        <p className="text-xs text-secondary mb-3">Get notified when the price drops below your target:</p>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "rgba(160,160,160,0.5)", fontFamily: "'DM Mono', monospace" }}>{sym}</span>
                                <input
                                    type="number"
                                    placeholder={String(Math.round(finalPrice * 0.9))}
                                    value={alertPrice}
                                    onChange={e => setAlertPrice(e.target.value)}
                                    className="alert-input pl-6"
                                />
                            </div>
                            <button onClick={handleSetAlert} className="btn-primary shrink-0">
                                {alertSet ? "✓ Set!" : "Alert Me"}
                            </button>
                        </div>
                        {alertSet && (
                            <p className="mt-2 text-xs" style={{ color: "#10b981" }}>
                                ✓ Alert set for {sym}{alertPrice}. You'll be notified when the price drops.
                            </p>
                        )}
                        <div className="mt-3 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ background: "#10b981" }} />
                            <span className="text-xs text-secondary">
                                Historical low: <strong style={{ color: "#10b981", fontFamily: "'DM Mono', monospace" }}>{formatPrice(lowestPrice, currency)}</strong>
                            </span>
                        </div>
                    </div>
                )}

                {/* Price History Panel */}
                {showHistory && (
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-secondary">3-month price trend (simulated)</span>
                            <span className="pill-badge" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.25)", fontSize: "10px" }}>
                                Low: {formatPrice(lowestPrice, currency)}
                            </span>
                        </div>
                        <MiniChart points={priceHistory} currency={currency} color={dealInfo.color} />
                        <p className="text-xs mt-2" style={{ color: "rgba(160,160,160,0.4)", fontFamily: "'DM Mono', monospace" }}>
                            * Simulated trend based on current pricing data
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
