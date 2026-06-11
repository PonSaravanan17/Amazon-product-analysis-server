import React from "react";
import { getProxiedImageUrl } from "../utils";

interface ImageGalleryProps {
    images: string[];
    title: string;
    mcpUrl?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title, mcpUrl }) => {
    if (!images || images.length <= 1) return null;

    const displayImages = images.slice(0, 6);

    return (
        <div className="section-card fade-up fade-up-2" style={{ padding: "1.25rem" }}>
            <div className="section-header">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
                Product Gallery
                <span className="ml-1 text-xs font-normal opacity-60" style={{ fontFamily: "'DM Mono', monospace", textTransform: "none", letterSpacing: 0 }}>
                    {images.length} images
                </span>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-1 carousel-scroll-container">
                {displayImages.map((image, index) => {
                    const proxied = getProxiedImageUrl(image, mcpUrl);
                    return (
                        <div
                            key={index}
                            className="carousel-item shrink-0 w-20 h-20"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            <div className="carousel-item-bg">
                                {proxied && <img src={proxied} alt="" />}
                            </div>
                            <div className="carousel-item-content p-1">
                                {proxied && (
                                    <img
                                        src={proxied}
                                        alt={`${title} image ${index + 1}`}
                                        className="w-full h-full object-contain"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
