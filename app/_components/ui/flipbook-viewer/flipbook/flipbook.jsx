'use client';
import React, { memo, useState, useEffect, useCallback } from 'react';
import useRefSize from '@/app/_hooks/use-ref-size';
import FlipbookLoader from './flipbook-loader';
import { cn } from '@/app/_lib/utils';
import screenfull from 'screenfull';

const Flipbook = memo(({ viewerStates, setViewerStates, flipbookRef, pdfDetails }) => {
    const { ref, width, height, refreshSize } = useRefSize();
    const [scale, setScale] = useState(0); // Max scale for flipbook
    const [wrapperCss, setWrapperCss] = useState(null);
    const [viewRange, setViewRange] = useState([0, 4]);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Track fullscreen state and trigger refresh
    useEffect(() => {
        if (screenfull) {
            const handleChange = () => {
                const newFullscreenState = screenfull.isFullscreen;
                setIsFullscreen(newFullscreenState);
                // Force refresh size calculation when fullscreen changes
                setTimeout(() => {
                    refreshSize();
                }, 100);
            };
            screenfull.on('change', handleChange);
            return () => screenfull.off('change', handleChange);
        }
    }, [refreshSize]);

    // Calculate scale when pageSize or dimensions change >>>>>>>>
    useEffect(() => {
        if (pdfDetails && width && height) {
            const isMobile = width < 768;
            const pageMultiplier = isMobile ? 1 : 2;

            // No padding offset - maximize PDF size
            const paddingOffset = 0;
            const availableWidth = width - paddingOffset;
            const availableHeight = height - paddingOffset;

            // Always use Math.min to prevent cropping
            const baseScale = Math.min(
                availableWidth / (pageMultiplier * pdfDetails.width),
                availableHeight / pdfDetails.height
            );

            const finalScale = baseScale; // Keep it 1x base currency

            setScale(finalScale);
            setWrapperCss({
                width: `${pdfDetails.width * finalScale * pageMultiplier}px`,
                height: `${pdfDetails.height * finalScale}px`,
            });
        }
    }, [pdfDetails, width, height, isFullscreen]);

    // Refresh flipbook size & page range on window resize >>>>>>>>
    const shrinkPageLoadingRange = useCallback(() => {
        setViewRange([Math.max(viewerStates.currentPageIndex - 2, 0), Math.min(viewerStates.currentPageIndex + 2, pdfDetails.totalPages)]);
    }, [viewerStates.currentPageIndex, pdfDetails.totalPages, setViewRange]);

    const handleFullscreenChange = useCallback(() => {
        shrinkPageLoadingRange();
        refreshSize();
    }, [shrinkPageLoadingRange, refreshSize]);

    useEffect(() => {
        if (screenfull) {
            screenfull.on('change', handleFullscreenChange);
        }
        // Clean up the event listener
        return () => {
            if (screenfull) {
                screenfull.off('change', handleFullscreenChange);
            }
        };
    }, [handleFullscreenChange]);

    // Wheel scroll navigation >>>>>>>>
    useEffect(() => {
        const container = ref.current;
        if (!container || !flipbookRef?.current) return;

        let scrollTimeout;
        const handleWheel = (e) => {
            // Don't interfere with zoom scrolling
            if (viewerStates.zoomScale > 1) return;

            e.preventDefault();

            // Debounce to prevent rapid page changes
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const pageFlip = flipbookRef.current.pageFlip();

                if (e.deltaY > 0) {
                    // Scroll down = next page (slide left)
                    pageFlip.flipNext();
                } else if (e.deltaY < 0) {
                    // Scroll up = previous page (slide right)
                    pageFlip.flipPrev();
                }
            }, 100);
        };

        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
            clearTimeout(scrollTimeout);
        };
    }, [flipbookRef, viewerStates.zoomScale, ref]);

    const isZoomed = viewerStates.zoomScale > 1;

    return (
        <div ref={ref} className={cn(
            "relative flex flex-shrink-0",
            isZoomed ? "w-fit h-fit justify-start items-start overflow-visible" : "w-full h-full justify-center items-center overflow-hidden",
            "bg-transparent",
            screenfull?.isFullscreen && "!h-screen bg-black"
        )}>
            {/* If zoomed, we disable the inner flex centering and just let the spacer div take over */}
            <div className={cn(
                "flex flex-shrink-0",
                isZoomed ? "w-fit h-fit justify-start items-start overflow-visible" : "w-full h-full justify-center items-center overflow-hidden"
            )}>
                {pdfDetails && scale > 0 && wrapperCss && width > 0 && height > 0 && (
                    // Spacer Div: Forces the parent to scroll by occupying full zoomed size
                    <div
                        style={{
                            width: isZoomed ? (parseFloat(wrapperCss.width) * viewerStates.zoomScale) : wrapperCss.width,
                            height: isZoomed ? (parseFloat(wrapperCss.height) * viewerStates.zoomScale) : wrapperCss.height,
                            position: 'relative',
                            flexShrink: 0
                        }}
                    >
                        {/* Transformed Div: Scales the content visually */}
                        <div style={{
                            ...wrapperCss,
                            transform: isZoomed ? `scale(${viewerStates.zoomScale})` : 'none',
                            transformOrigin: 'top left',
                        }}>
                            <FlipbookLoader
                                ref={flipbookRef}
                                pdfDetails={pdfDetails}
                                scale={scale}
                                viewRange={viewRange}
                                setViewRange={setViewRange}
                                viewerStates={viewerStates}
                                setViewerStates={setViewerStates}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

Flipbook.displayName = 'Flipbook';
export default Flipbook;
