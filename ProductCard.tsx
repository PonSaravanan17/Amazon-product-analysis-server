import React from "react";
import { getProxiedImageUrl } from "../utils";

interface ProductCardProps {
    title?: string;
    imageUrl?: string;
    price?: number;
    currency?: string;
    rating?: number;
    totalReviews?: number;
    mcpUrl?: string;
}

const StarIcon: React.FC<{ filled: boolean; half?: boolean }> = ({ filled, half }) => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {half ? (
            <>
                <defs>
                    <linearGradient id="halfStar">
                        <stop offset="50%" stopColor="#e8650a" />
                        <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                </defs>
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#halfStar)" stroke="#e8650a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </>
        ) : (
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={filled ? "#e8650a" : "transparent"} stroke={filled ? "#e8650a" : "rgba(160,160,160,0.4)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        )}
    </svg>
);

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) stars.push(<StarIcon key={i} filled={true} />);
        else if (rating >= i - 0.5) stars.push(<StarIcon key={i} filled={false} half={true} />);
        else stars.push(<StarIcon key={i} filled={false} />);
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
};

const formatPrice = (price: number, currency: string): string => {
    const symbols: Record<string, string> = { USD: "$", INR: "₹", EUR: "€", GBP: "£", JPY: "¥" };
    return `${symbols[currency] || currency}${price.toLocaleString()}`;
};

const formatReviews = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
};

export const ProductCard: React.FC<ProductCardProps> = ({ title, imageUrl, price, currency, rating, totalReviews, mcpUrl }) => {
    if (!title && !imageUrl && price === undefined && rating === undefined) return null;

    const hasPrice = price !== undefined && price !== null && currency;
    const hasRating = rating !== undefined && rating !== null;
    const hasReviews = totalReviews !== undefined && totalReviews !== null;
    const proxiedImageUrl = getProxiedImageUrl(imageUrl, mcpUrl);

    return (
        <div className="section-card fade-up fade-up-1">
            <div className="flex gap-5">
                {/* Product Image */}
                {proxiedImageUrl && (
                    <div className="relative shrink-0">
                        <div className="w-28 h-28 rounded-2xl overflow-hidden bg-white/5 border border-white/8 flex items-center justify-center">
                            <img
                                src={proxiedImageUrl}
                                alt={title || "Product image"}
                                className="w-full h-full object-contain p-2"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='1'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
                                }}
                            />
                        </div>
                        {/* Amazon badge */}
                        <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-[#e8650a] rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21.976 16.4c-.234-.165-.555-.104-.765.075-1.061.906-2.145 1.457-3.24 1.457-.841 0-1.267-.498-1.267-1.484V7.5c0-.276-.224-.5-.5-.5H14.7c-.276 0-.5.224-.5.5v9.067c0 2.133 1.017 3.175 3.1 3.175 1.478 0 2.868-.7 4.164-2.082.216-.234.203-.606-.013-.773l-.475-.487z"/>
                                <path d="M18.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                            </svg>
                        </div>
                    </div>
                )}

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                    {title && (
                        <h3 className="text-base font-semibold text-default line-clamp-2 mb-2 leading-snug" style={{ fontFamily: "'Syne', sans-serif" }}>
                            {title}
                        </h3>
                    )}

                    {hasPrice && (
                        <div className="price-main text-2xl mb-2" style={{ color: "#e8650a" }}>
                            {formatPrice(price!, currency!)}
                        </div>
                    )}

                    {hasRating && (
                        <div className="flex items-center gap-2 flex-wrap">
                            <StarRating rating={rating} />
                            <span className="text-sm font-semibold text-default">{rating.toFixed(1)}</span>
                            {hasReviews && (
                                <span className="text-xs text-secondary">
                                    ({formatReviews(totalReviews!)} reviews)
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
