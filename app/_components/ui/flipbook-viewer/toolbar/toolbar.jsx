'use client';
import React, { useEffect, useCallback } from 'react';
import { Button } from '../../button';
import { ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';
import keyboardjs from 'keyboardjs';
import Zoom from './zoom';
import SliderNav from './slider-nav/slider-nav';
import useScreenSize from '@/app/_hooks/use-screensize';
import Share from '../../share';

const Toolbar = ({ flipbookRef, containerRef, screenfull, pdfDetails, viewerStates, shareUrl, disableShare, onZoomIn, onZoomOut, onResetZoom }) => {
    const { width: screenWidth } = useScreenSize();
    const pagesInFlipView = ((viewerStates.currentPageIndex + 1) % 2 === 0 && (viewerStates.currentPageIndex + 1) !== pdfDetails.totalPages)
        ? `${(viewerStates.currentPageIndex + 1)} - ${viewerStates.currentPageIndex + 2}`
        : (viewerStates.currentPageIndex + 1)

    const fullScreen = useCallback(() => {
        if (screenfull.isEnabled && containerRef) {
            screenfull.toggle(containerRef.current);
        }
    }, [screenfull, containerRef]);

    // Key bindings >>>>>>>>>
    useEffect(() => {
        keyboardjs.bind('right', () => {
            screenWidth < 768 ? flipbookRef.current.pageFlip().turnToNextPage() : flipbookRef.current.pageFlip().flipNext();
        });

        keyboardjs.bind('left', () => {
            screenWidth < 768 ? flipbookRef.current.pageFlip().turnToPreviousPage() : flipbookRef.current.pageFlip().flipPrev();
        });
        keyboardjs.bind('f', () => fullScreen());
        keyboardjs.bind('escape', () => {
            if (screenfull.isFullscreen) {
                fullScreen();
            }
        });

        return () => {
            keyboardjs.unbind('right');
            keyboardjs.unbind('left');
            keyboardjs.unbind('f');
            keyboardjs.unbind('escape');
        };
    }, [screenWidth, flipbookRef, fullScreen, screenfull]);

    return (
        <div className="px-3 w-full bg-transparent">
            <SliderNav 
                pdfDetails={pdfDetails} 
                flipbookRef={flipbookRef} 
                viewerStates={viewerStates} 
            />
            <div className="flex items-center gap-2 pb-2 max-xl:pt-2">
                <div className="hidden lg:block flex-1"></div>
                <Button
                    onClick={() => { screenWidth < 768 ? flipbookRef.current.pageFlip().turnToPreviousPage() : flipbookRef.current.pageFlip().flipPrev() }}
                    disabled={viewerStates.currentPageIndex === 0}
                    variant='secondary'
                    size='icon'
                    className='size-8 min-w-8'
                >
                    <ChevronLeft className="size-4 min-w-4" />
                </Button>
                <Button
                    onClick={() => { screenWidth < 768 ? flipbookRef.current.pageFlip().turnToNextPage() : flipbookRef.current.pageFlip().flipNext() }}
                    disabled={viewerStates.currentPageIndex === pdfDetails?.totalPages - 1 || viewerStates.currentPageIndex === pdfDetails?.totalPages - 2}
                    variant='secondary'
                    size='icon'
                    className='size-8 min-w-8'
                >
                    <ChevronRight className="size-4 min-w-4" />
                </Button>
                <Zoom 
                    zoomScale={viewerStates.zoomScale} 
                    screenWidth={screenWidth}
                    onZoomIn={onZoomIn}
                    onZoomOut={onZoomOut}
                    onResetZoom={onResetZoom}
                />
                {!disableShare && <Share shareUrl={shareUrl} />}
                <Button
                    onClick={fullScreen}
                    variant='secondary'
                    size='icon'
                    className='size-8 min-w-8'
                >
                    {screenfull.isEnabled && screenfull.isFullscreen ?
                        <Minimize className="size-4 min-w-4" /> :
                        <Maximize className="size-4 min-w-4" />
                    }
                </Button>
                <div className="flex-1"></div>
                {pdfDetails?.totalPages > 0 && (
                    <p className='text-sm font-medium'>
                        {pagesInFlipView} of {pdfDetails?.totalPages}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Toolbar;
