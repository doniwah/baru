import React, { useRef, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { cn } from '@/app/_lib/utils';
import { Button } from '@/app/_components/ui/button';
import { X } from 'lucide-react';

const ThumbnailStrip = ({ pdfUrl, totalPages, currentPageIndex, onPageClick, onClose }) => {
    const scrollContainerRef = useRef(null);

    // Drag to scroll logic
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const isDragging = useRef(false);

    const onMouseDown = (e) => {
        isDown.current = true;
        isDragging.current = false;
        startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
        scrollLeft.current = scrollContainerRef.current.scrollLeft;
        scrollContainerRef.current.style.cursor = 'grabbing';
    };

    const onMouseLeave = () => {
        isDown.current = false;
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.cursor = 'grab';
        }
    };

    const onMouseUp = () => {
        isDown.current = false;
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.cursor = 'grab';
        }
    };

    const onMouseMove = (e) => {
        if (!isDown.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX.current) * 2; // Scroll speed multiplier
        scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;

        if (Math.abs(x - startX.current) > 5) {
            isDragging.current = true;
        }
    };

    // Calculate spreads: [ [1], [2,3], [4,5], ... ]
    const spreads = React.useMemo(() => {
        const result = [];
        if (totalPages > 0) {
            result.push([1]); // Cover
            for (let i = 2; i <= totalPages; i += 2) {
                const spread = [i];
                if (i + 1 <= totalPages) spread.push(i + 1);
                result.push(spread);
            }
        }
        return result;
    }, [totalPages]);

    // Auto-scroll to active page
    useEffect(() => {
        if (scrollContainerRef.current && currentPageIndex >= 0) {
            // Check if we are currently dragging/interacting to avoid fighting the user
            if (isDown.current) return;

            const activeSpreadIndex = spreads.findIndex(spread => spread.includes(currentPageIndex + 1));
            if (activeSpreadIndex >= 0) {
                const activeElement = scrollContainerRef.current.children[0]?.children[activeSpreadIndex];
                if (activeElement) {
                    activeElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
                }
            }
        }
    }, [currentPageIndex, totalPages, spreads]);



    // Helper to check if a spread contains the current page
    const isSpreadActive = (spread) => {
        // currentPageIndex is 0-based. spread contains 1-based page numbers.
        return spread.includes(currentPageIndex + 1);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[60] bg-[#1a1a1a]/95 backdrop-blur-md border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] transition-transform duration-300 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                <span className="text-sm font-medium text-white/80">Pages</span>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 text-white/60 hover:text-white hover:bg-white/10">
                    <X className="size-4" />
                </Button>
            </div>

            <div
                ref={scrollContainerRef}
                className="w-full overflow-x-auto p-4 flex gap-4 min-h-[160px] scrollbar-hide cursor-grab select-none items-end justify-start"
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
            >
                <Document file={pdfUrl} loading={<div className="text-white/50 text-sm p-4">Loading thumbnails...</div>}>
                    <div className="flex gap-6 px-4">
                        {spreads.map((spread, index) => {
                            const active = isSpreadActive(spread);
                            return (
                                <div
                                    key={`spread_${index}`}
                                    className={cn(
                                        "relative cursor-pointer group transition-all duration-200 flex flex-col items-center gap-2",
                                    )}
                                    // Navigate to the first page of the spread (0-based)
                                    onClick={(e) => {
                                        if (!isDragging.current) {
                                            onPageClick(spread[0] - 1);
                                        }
                                    }}
                                >
                                    {/* Spread Container (Border Wrapper) */}
                                    <div className={cn(
                                        "flex rounded-sm overflow-hidden border-2 transition-all duration-200 relative",
                                        active
                                            ? "border-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] scale-105"
                                            : "border-transparent opacity-70 group-hover:opacity-100 group-hover:scale-105"
                                    )}>
                                        {spread.map(pageNum => (
                                            <div key={`thumb_page_${pageNum}`} className="relative bg-white">
                                                <Page
                                                    pageNumber={pageNum}
                                                    width={100}
                                                    renderTextLayer={false}
                                                    renderAnnotationLayer={false}
                                                    className="pointer-events-none block"
                                                    loading={<div className="w-[100px] h-[140px] bg-white/5 animate-pulse" />}
                                                />
                                                {/* Page Number Overlay */}
                                                <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1 rounded backdrop-blur-sm">
                                                    {pageNum}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Spread Label */}
                                    <span className={cn(
                                        "text-xs font-medium transition-colors",
                                        active ? "text-primary" : "text-white/60 group-hover:text-white"
                                    )}>
                                        {spread.join("-")}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </Document>
            </div>
        </div>
    );
};

export default ThumbnailStrip;
