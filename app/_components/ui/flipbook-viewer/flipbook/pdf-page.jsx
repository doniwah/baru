import { cn } from "@/app/_lib/utils";
import React, { forwardRef, memo } from "react";
import { Page } from "react-pdf";

const PdfPage = forwardRef(({ page, height, zoomScale, isPageInView, isPageInViewRange }, ref) => {
    return (
        <div 
            ref={ref} 
            className="bg-transparent"
            style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3), 0 6px 20px rgba(0, 0, 0, 0.19)',
                borderRadius: '2px'
            }}
        >
            {isPageInViewRange && (
                <Page
                    devicePixelRatio={(isPageInView && zoomScale > 1.7) ? Math.min(zoomScale * window.devicePixelRatio, 5) : window.devicePixelRatio}
                    height={height}
                    pageNumber={page}
                    loading={<></>}
                />
            )}
        </div>
    );
});

PdfPage.displayName = "PdfPage";

export default memo(PdfPage);
