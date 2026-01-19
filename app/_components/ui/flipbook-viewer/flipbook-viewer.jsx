'use client';
import React, { useCallback, useRef, useState, useEffect } from "react";
import Toolbar from "./toolbar/toolbar";
import { cn } from "@/app/_lib/utils";
import Flipbook from "./flipbook/flipbook";
import screenfull from 'screenfull';
import { Document } from "react-pdf";
import PdfLoading from "./pad-loading/pdf-loading";
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const FlipbookViewer = ({ pdfUrl, shareUrl, className, disableShare }) => {
  const containerRef = useRef(); // For full screen container
  const flipbookRef = useRef();
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfDetails, setPdfDetails] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewerStates, setViewerStates] = useState({
    currentPageIndex: 0,
    zoomScale: 1,
  });

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
    setViewerStates(prev => ({
      ...prev,
      zoomScale: Math.min(prev.zoomScale + 0.25, 5)
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setViewerStates(prev => ({
      ...prev,
      zoomScale: Math.max(prev.zoomScale - 0.25, 1)
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
        "relative w-full overflow-hidden",
        "h-[80vh] md:h-[20.163rem] md:xs:h-[25.163rem] lg:h-[33.163rem] xl:h-[34.66rem]",
        isFullscreen ? "bg-black !h-screen" : "bg-transparent",
        className
      )}
    >
      {pdfLoading && <PdfLoading />}
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} loading={<></>} >
        {(isClient && pdfDetails && !pdfLoading) &&
          <div className="w-full h-full relative bg-transparent flex items-center justify-center">
            <div className="w-full h-full overflow-hidden flex items-center justify-center">
              <div
                style={{
                  transform: `scale(${viewerStates.zoomScale})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.2s ease-out',
                  width: '100%',
                  height: '100%'
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
            <div className="fixed bottom-0 left-0 right-0 z-50 w-full">
              <Toolbar
                viewerStates={viewerStates}
                setViewerStates={setViewerStates}
                containerRef={containerRef}
                flipbookRef={flipbookRef}
                screenfull={screenfull}
                pdfDetails={pdfDetails}
                shareUrl={shareUrl}
                disableShare={disableShare}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetZoom={handleResetZoom}
              />
            </div>
          </div>
        }
      </Document>
    </div>
  );
}

export default FlipbookViewer;
