'use client';
import React, { memo, useState, useEffect, useCallback } from 'react';
import useRefSize from '@/app/_hooks/use-ref-size';
import FlipbookLoader from './flipbook-loader';
import { cn } from '@/app/_lib/utils';
import screenfull from 'screenfull';

const Flipbook = memo(({ viewerStates, setViewerStates, flipbookRef, pdfDetails }) => {
    const { ref, width, height, refreshSize } = useRefSize();
    const [scale, setScale] = useState(1); // Max scale for flipbook
    const [wrapperCss, setWrapperCss] = useState({});
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
            // Always use Math.min to prevent cropping
            const calculatedScale = Math.min(
                width / (2 * pdfDetails.width),
                height / pdfDetails.height
            );
            
            setScale(calculatedScale);
            setWrapperCss({
                width: `${pdfDetails.width * calculatedScale * 2}px`,
                height: `${pdfDetails.height * calculatedScale}px`,
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

    return (
        <div ref={ref} className={cn(
    "relative h-[15rem] xs:h-[20rem] lg:h-[28rem] xl:h-[30rem] w-full flex justify-center items-center overflow-hidden bg-transparent",
    screenfull?.isFullscreen &&
      "!h-screen bg-black"
  )}>
            <div className='overflow-hidden flex justify-center items-center h-full w-full'>
                {pdfDetails && scale && (
                    <div style={wrapperCss}>
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
                )}
            </div>
        </div>
    );
});

Flipbook.displayName = 'Flipbook';
export default Flipbook;
