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

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "relative h-[20.163rem] xs:h-[25.163rem] lg:h-[33.163rem] xl:h-[34.66rem] w-full overflow-hidden",
        isFullscreen ? "bg-black" : "bg-transparent",
        className
      )}
    >
      {pdfLoading && <PdfLoading />}
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} loading={<></>} >
        {(isClient && pdfDetails && !pdfLoading) &&
          <div className="w-full h-full relative bg-transparent flex flex-col">
            <div className="flex-1 overflow-hidden">
              <Flipbook
                viewerStates={viewerStates}
                setViewerStates={setViewerStates}
                flipbookRef={flipbookRef}
                screenfull={screenfull}
                pdfDetails={pdfDetails}
              />
            </div>
            <div className={cn(
              "w-full",
              isFullscreen && "absolute bottom-0 left-0 right-0 z-50"
            )}>
              <Toolbar
                viewerStates={viewerStates}
                setViewerStates={setViewerStates}
                containerRef={containerRef}
                flipbookRef={flipbookRef}
                screenfull={screenfull}
                pdfDetails={pdfDetails}
                shareUrl={shareUrl}
                disableShare={disableShare}
              />
            </div>
          </div>
        }
      </Document>
    </div>
  );
}

export default FlipbookViewer;
