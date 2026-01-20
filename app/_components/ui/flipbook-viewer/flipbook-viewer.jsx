'use client';
import React, { useCallback, useRef, useState, useEffect } from "react";
import Toolbar from './toolbar/toolbar';
import dynamic from 'next/dynamic';
const ThumbnailStrip = dynamic(() => import('./thumbnail-strip/thumbnail-strip'), {
  ssr: false,
});
import { cn } from "@/app/_lib/utils";

import Flipbook from "./flipbook/flipbook";
import screenfull from 'screenfull';
import { Document } from "react-pdf";
import PdfLoading from "./pad-loading/pdf-loading";
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import useScreenSize from '@/app/_hooks/use-screensize';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const FlipbookViewer = ({ pdfUrl, shareUrl, disableShare = false, className }) => {
  const [viewerStates, setViewerStates] = useState({
    zoomScale: 1,
    pdfScale: 1,
    currentPageIndex: 0
  });
  const [pdfDetails, setPdfDetails] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewportPct, setViewportPct] = useState({ x: 0, y: 0, w: 1, h: 1 });

  const containerRef = useRef(null); // For full screen container
  const flipbookRef = useRef(null);
  const { width: screenWidth } = useScreenSize();

  const handleToggleThumbnails = () => setShowThumbnails(prev => !prev);

  const handleThumbnailClick = (pageIndex) => {
    if (flipbookRef.current && flipbookRef.current.pageFlip()) {
      const pageFlip = flipbookRef.current.pageFlip();
      const current = pageFlip.getCurrentPageIndex();

      // Calculate distance
      const diff = pageIndex - current;

      // If just 1 or 2 pages away (next/prev spread), use animation methods
      if (diff > 0 && diff <= 2) {
        pageFlip.flipNext();
      } else if (diff < 0 && diff >= -2) {
        pageFlip.flipPrev();
      } else {
        // Further away, just jump
        pageFlip.turnToPage(pageIndex);
      }
    }
  };

  // Ensure client-side only rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Track fullscreen changes
  useEffect(() => {
    if (typeof window !== 'undefined' && screenfull?.isEnabled) {
      const handleFullscreenChange = () => {
        setIsFullscreen(screenfull.isFullscreen);
      };

      screenfull.on('change', handleFullscreenChange);

      return () => {
        screenfull.off('change', handleFullscreenChange);
      };
    }
  }, []);

  // Setting pdf details on document load >>>>>>>>>>>
  const onDocumentLoadSuccess = useCallback(async (document) => {
    try {
      const pageDetails = await document.getPage(1);
      setPdfDetails({
        totalPages: document.numPages,
        width: pageDetails.view[2],
        height: pageDetails.view[3],
      });
      setPdfLoading(false);
    } catch (error) {
      console.error('Error loading document:', error);
    }
  }, []);

  // Custom zoom functions
  const handleZoomIn = useCallback(() => {
    setViewerStates(prev => {
      let targetScale = 1;
      if (prev.zoomScale < 1.5) targetScale = 1.5;
      else if (prev.zoomScale < 1.7) targetScale = 1.7;
      else if (prev.zoomScale < 1.8) targetScale = 1.8;
      else targetScale = 1; // Reset if already max

      return {
        ...prev,
        zoomScale: targetScale
      };
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setViewerStates(prev => ({
      ...prev,
      zoomScale: 1
    }));
  }, []);

  const handleResetZoom = useCallback(() => {
    setViewerStates(prev => ({
      ...prev,
      zoomScale: 1
    }));
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        (isFullscreen || viewerStates.zoomScale > 1)
          ? "fixed inset-0 z-50 bg-black h-screen w-screen"
          : "relative w-full overflow-hidden h-[80vh] md:h-[85vh] bg-transparent",
        className
      )}
    >
      {pdfLoading && <PdfLoading />}
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} loading={<></>} className="w-full h-full">
        {(isClient && pdfDetails && !pdfLoading) &&
          <div className="w-full h-full relative bg-transparent flex flex-col">
            {/* Toolbar Spacer (since Toolbar is fixed default, but we moved it to header relative in previous steps... wait, Toolbar IS fixed top-0 in code I saw) */}
            {/* The Toolbar is rendered later with fixed top-0. We need to reserve space for it. */}
            <div className="h-14 md:h-16 w-full flex-none" />

            {/* Content Area */}
            {/* Content Area with Drag-to-Pan */}
            <div
              ref={(node) => {
                // We can assign this ref to a new variable if needed, but we need it for drag logic
                // Let's reuse a ref for this container
                if (node) containerRef.current = node; // Wait, containerRef is used for fullscreen. Let's create a new ref for scroll area.
              }}
              className={cn(
                "flex-1 w-full relative min-h-0 overflow-hidden", // Base classes
                viewerStates.zoomScale > 1 ? "cursor-grab active:cursor-grabbing" : "" // Cursor
              )}
              onMouseDown={(e) => {
                if (viewerStates.zoomScale <= 1) return;
                e.preventDefault();
                const container = e.currentTarget;
                container.dataset.isDown = "true";
                container.dataset.startX = e.pageX - container.offsetLeft;
                container.dataset.startY = e.pageY - container.offsetTop;
                container.dataset.scrollLeft = container.scrollLeft;
                container.dataset.scrollTop = container.scrollTop;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.dataset.isDown = "false";
              }}
              onMouseUp={(e) => {
                e.currentTarget.dataset.isDown = "false";
              }}
              onMouseMove={(e) => {
                const container = e.currentTarget;
                if (container.dataset.isDown !== "true" || viewerStates.zoomScale <= 1) return;
                e.preventDefault();
                const x = e.pageX - container.offsetLeft;
                const y = e.pageY - container.offsetTop;
                const walkX = (x - parseFloat(container.dataset.startX)) * 1.5; // Speed multiplier
                const walkY = (y - parseFloat(container.dataset.startY)) * 1.5;
                container.scrollLeft = parseFloat(container.dataset.scrollLeft) - walkX;
                container.scrollTop = parseFloat(container.dataset.scrollTop) - walkY;
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '100%',
                  minWidth: '100%',
                  display: 'flex',
                  alignItems: viewerStates.zoomScale > 1 ? 'flex-start' : 'center', // Align top-left when zoomed to allow scrolling from top
                  justifyContent: viewerStates.zoomScale > 1 ? 'flex-start' : 'center'
                }}
              >
                <Flipbook
                  viewerStates={viewerStates}
                  setViewerStates={setViewerStates}
                  flipbookRef={flipbookRef}
                  screenfull={screenfull}
                  pdfDetails={pdfDetails}
                />
              </div>
            </div>
            <div className="fixed top-0 left-0 right-0 z-50 w-full">
              <Toolbar
                containerRef={containerRef}
                flipbookRef={flipbookRef}
                pdfDetails={pdfDetails}
                viewerStates={viewerStates}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetZoom={handleResetZoom}
                screenfull={screenfull}
                shareUrl={shareUrl}
                disableShare={disableShare}
                showThumbnails={showThumbnails}
                onToggleThumbnails={handleToggleThumbnails}
              />
            </div>

            {showThumbnails && pdfDetails && (
              <ThumbnailStrip
                pdfUrl={pdfUrl}
                totalPages={pdfDetails.totalPages}
                currentPageIndex={viewerStates.currentPageIndex}
                onPageClick={handleThumbnailClick}
                onClose={() => setShowThumbnails(false)}
              />
            )}
          </div>
        }
      </Document>
    </div>
  );
}

export default FlipbookViewer;
