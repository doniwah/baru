'use client';
import React, { useEffect, useCallback } from 'react';
import { cn } from '@/app/_lib/utils';
import { Button } from '../../button';
import {
    ChevronLeft,
    ChevronRight,
    Search,
    RotateCw,
    Maximize,
    Minimize,
    LayoutGrid
} from 'lucide-react';
import keyboardjs from 'keyboardjs';
import Zoom from './zoom';
import SliderNav from './slider-nav/slider-nav';
import useScreenSize from '@/app/_hooks/use-screensize';
import Share from '../../share';

const Toolbar = ({ flipbookRef, containerRef, screenfull, pdfDetails, viewerStates, shareUrl, disableShare, onZoomIn, onZoomOut, onResetZoom, showThumbnails, onToggleThumbnails }) => {
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
        <div className="w-full bg-[#1a1a1a] text-white shadow-md relative z-50">
            <div className="grid grid-cols-3 items-center px-4 py-3">
                {/* Left Side: Title/Logo */}
                <div className="flex items-center justify-start font-bold text-xl tracking-wider">
                    <span className="text-white">Lex Suite</span>
                </div>

                {/* Center: Actions */}
                <div className="flex items-center justify-center gap-1">
                    <Zoom
                        zoomScale={viewerStates.zoomScale}
                        screenWidth={screenWidth}
                        onZoomIn={onZoomIn}
                        onZoomOut={onZoomOut}
                        onResetZoom={onResetZoom}
                    />

                    <div className="h-4 w-[1px] bg-gray-600 mx-2" />

                    <Button
                        onClick={() => { screenWidth < 768 ? flipbookRef.current.pageFlip().turnToPreviousPage() : flipbookRef.current.pageFlip().flipPrev() }}
                        disabled={viewerStates.currentPageIndex === 0}
                        variant='ghost'
                        size='icon'
                        className='text-white hover:bg-white/10'
                    >
                        <ChevronLeft className="size-5" />
                    </Button>

                    {/* Page Info for Mobile embedded in center controls if needed, 
                        but let's keep it simple here or it gets crowded. 
                        Actually, let's put the mobile page info here too so it's central. */}
                    {pdfDetails?.totalPages > 0 && (
                        <div className='md:hidden text-xs font-medium px-2'>
                            {viewerStates.currentPageIndex + 1}
                        </div>
                    )}

                    <Button
                        onClick={() => { screenWidth < 768 ? flipbookRef.current.pageFlip().turnToNextPage() : flipbookRef.current.pageFlip().flipNext() }}
                        disabled={viewerStates.currentPageIndex === pdfDetails?.totalPages - 1 || viewerStates.currentPageIndex === pdfDetails?.totalPages - 2}
                        variant='ghost'
                        size='icon'
                        className='text-white hover:bg-white/10'
                    >
                        <ChevronRight className="size-5" />
                    </Button>

                    <Button
                        onClick={onToggleThumbnails}
                        variant='ghost'
                        size='icon'
                        className={cn('text-white hover:bg-white/10', showThumbnails && 'bg-white/20')}
                        title="Show Pages"
                    >
                        <LayoutGrid className="size-5" />
                    </Button>

                    <div className="h-4 w-[1px] bg-gray-600 mx-2" />

                    {!disableShare && <Share shareUrl={shareUrl} />}

                    <Button
                        onClick={fullScreen}
                        variant='ghost'
                        size='icon'
                        className='text-white hover:bg-white/10'
                    >
                        {screenfull.isEnabled && screenfull.isFullscreen ?
                            <Minimize className="size-5" /> :
                            <Maximize className="size-5" />
                        }
                    </Button>
                </div>

                {/* Right Side: Page Info (Moved here) */}
                <div className="flex items-center justify-end">
                    {pdfDetails?.totalPages > 0 && (
                        <div className='hidden md:block text-sm font-medium bg-black/30 px-3 py-1 rounded-full'>
                            {pagesInFlipView} / {pdfDetails?.totalPages}
                        </div>
                    )}
                </div>
            </div>
            {/* SliderNav for Mobile */}
            <div className="w-full px-4 pb-2 md:hidden">
                <SliderNav
                    pdfDetails={pdfDetails}
                    flipbookRef={flipbookRef}
                    viewerStates={viewerStates}
                />
            </div>
        </div>
    );
};

export default Toolbar;
