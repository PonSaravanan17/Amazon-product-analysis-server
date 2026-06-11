import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { McpUseProvider, useWidget, type WidgetMetadata } from "mcp-use/react";
import React from "react";
import { Link } from "react-router";
import {
    ProductCard,
    PricingDeal,
    Features,
    ImageGallery,
    ProductSpecs,
    DeliveryInfo,
    CustomerReviews,
    SellerInfo,
} from "./components";
import { useProductAnalysis } from "./hooks";
import type { AmazonProductAnalysisProps } from "./types";
import { propSchema } from "./types";
import "../styles.css";

export const widgetMetadata: WidgetMetadata = {
    description:
        "Analyze any Amazon product by URL. Returns comprehensive product details including pricing, features, specifications, delivery options, customer reviews, and seller information.",
    inputs: propSchema,
    appsSdkMetadata: {
        "openai/widgetDescription": "Interactive Amazon product analysis widget with full product insights",
    },
};

const queryClient = new QueryClient();

const AmazonProductAnalysisContent: React.FC = () => {
    const { props, mcp_url } = useWidget<AmazonProductAnalysisProps>();
    const { url, zipcode } = props;
    const { data: analysis, isLoading, error } = useProductAnalysis(url, zipcode, mcp_url);

    return (
        <McpUseProvider debugger viewControls autoSize>
            <AppsSDKUIProvider linkComponent={Link}>
                {/* Root container */}
                <div
                    className="relative overflow-hidden"
                    style={{
                        borderRadius: "24px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "var(--color-surface-elevated, #0f0f0f)",
                    }}
                >
                    {/* Ambient background glow */}
                    <div
                        aria-hidden
                        style={{
                            position: "absolute",
                            top: "-60px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "300px",
                            height: "200px",
                            background: "radial-gradient(ellipse, rgba(232,101,10,0.12) 0%, transparent 70%)",
                            pointerEvents: "none",
                            zIndex: 0,
                        }}
                    />

                    <div className="relative p-5 space-y-4" style={{ zIndex: 1 }}>

                        {/* ── Header ── */}
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2.5">
                                {/* Logo mark */}
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: "linear-gradient(135deg, #e8650a 0%, #f59e0b 100%)" }}
                                >
                                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M21.976 16.4c-.234-.165-.555-.104-.765.075-1.061.906-2.145 1.457-3.24 1.457-.841 0-1.267-.498-1.267-1.484V7.5c0-.276-.224-.5-.5-.5H14.7c-.276 0-.5.224-.5.5v9.067c0 2.133 1.017 3.175 3.1 3.175 1.478 0 2.868-.7 4.164-2.082.216-.234.203-.606-.013-.773l-.475-.487z" />
                                        <path d="M18.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2
                                        className="text-base font-bold text-default leading-none mb-0.5"
                                        style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.01em" }}
                                    >
                                        Product Analysis
                                    </h2>
                                    <p className="text-xs text-secondary" style={{ fontFamily: "'DM Mono', monospace" }}>
                                        Powered by AI + Bright Data
                                    </p>
                                </div>
                            </div>
                            <span
                                className="pill-badge pill-badge-orange"
                                style={{ fontFamily: "'DM Mono', monospace" }}
                            >
                                Amazon
                            </span>
                        </div>

                        {/* ── Loading State ── */}
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-16 space-y-5">
                                <div className="relative w-14 h-14">
                                    <div
                                        className="absolute inset-0 rounded-full"
                                        style={{ border: "3px solid rgba(232,101,10,0.15)" }}
                                    />
                                    <div
                                        className="absolute inset-0 rounded-full spin-ring"
                                        style={{ border: "3px solid transparent", borderTopColor: "#e8650a" }}
                                    />
                                    <div
                                        className="absolute inset-2 rounded-full flex items-center justify-center"
                                        style={{ background: "rgba(232,101,10,0.08)" }}
                                    >
                                        <svg className="w-5 h-5" style={{ color: "#e8650a" }} viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-default mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Analyzing product...</p>
                                    <p className="text-xs text-secondary" style={{ fontFamily: "'DM Mono', monospace" }}>Fetching data via Bright Data</p>
                                </div>
                            </div>
                        )}

                        {/* ── Error State ── */}
                        {error && (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <div
                                    className="w-14 h-14 rounded-full flex items-center justify-center"
                                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                                >
                                    <svg className="w-7 h-7" style={{ color: "#ef4444" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold mb-1" style={{ color: "#ef4444", fontFamily: "'Syne', sans-serif" }}>Analysis failed</p>
                                    <p className="text-xs text-secondary max-w-xs">{error.message}</p>
                                </div>
                            </div>
                        )}

                        {/* ── Success: Analysis Sections ── */}
                        {analysis && (
                            <>
                                {/* Product Card */}
                                {analysis.product && (
                                    <ProductCard
                                        title={analysis.product.title}
                                        imageUrl={analysis.product.imageUrl}
                                        price={analysis.product.price}
                                        currency={analysis.product.currency}
                                        rating={analysis.product.rating}
                                        totalReviews={analysis.product.totalReviews}
                                        mcpUrl={mcp_url}
                                    />
                                )}

                                {/* Image Gallery */}
                                {analysis.images && analysis.images.length > 1 && (
                                    <ImageGallery
                                        images={analysis.images}
                                        title={analysis.product?.title || "Product"}
                                        mcpUrl={mcp_url}
                                    />
                                )}

                                {/* Pricing + Features */}
                                {(analysis.pricing || (analysis.features && analysis.features.length > 0)) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {analysis.pricing && (
                                            <PricingDeal
                                                initialPrice={analysis.pricing.initialPrice}
                                                finalPrice={analysis.pricing.finalPrice}
                                                discount={analysis.pricing.discount}
                                                savings={analysis.pricing.savings}
                                                currency={analysis.pricing.currency}
                                            />
                                        )}
                                        {analysis.features && analysis.features.length > 0 && (
                                            <Features features={analysis.features} />
                                        )}
                                    </div>
                                )}

                                {/* Delivery + Seller */}
                                {(analysis.delivery || analysis.seller || analysis.rankings || analysis.categories) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {analysis.delivery && analysis.delivery.length > 0 && (
                                            <DeliveryInfo
                                                delivery={analysis.delivery}
                                                availability={analysis.product?.availability}
                                                stockQuantity={analysis.stockQuantity}
                                            />
                                        )}
                                        {(analysis.seller || (analysis.rankings && analysis.rankings.length > 0) || (analysis.categories && analysis.categories.length > 0)) && (
                                            <SellerInfo
                                                seller={analysis.seller}
                                                rankings={analysis.rankings}
                                                categories={analysis.categories}
                                            />
                                        )}
                                    </div>
                                )}

                                {/* Customer Reviews */}
                                {analysis.customerReview && (analysis.customerReview.summary || analysis.customerReview.topReview) && (
                                    <CustomerReviews
                                        summary={analysis.customerReview.summary}
                                        topReview={analysis.customerReview.topReview}
                                    />
                                )}

                                {/* Product Specs */}
                                {analysis.specifications && analysis.specifications.length > 0 && (
                                    <ProductSpecs specifications={analysis.specifications} />
                                )}
                            </>
                        )}

                        {/* ── Footer ── */}
                        <div
                            className="flex items-center justify-center gap-2 pt-2"
                            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                        >
                            <svg className="w-3.5 h-3.5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            <span className="text-xs text-secondary" style={{ fontFamily: "'DM Mono', monospace" }}>
                                Data via Bright Data · Analysis by AI
                            </span>
                        </div>

                    </div>
                </div>
            </AppsSDKUIProvider>
        </McpUseProvider>
    );
};

const AmazonProductAnalysis: React.FC = () => (
    <QueryClientProvider client={queryClient}>
        <AmazonProductAnalysisContent />
    </QueryClientProvider>
);

export default AmazonProductAnalysis;
