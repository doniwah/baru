import React from 'react';
import { cn } from '@/app/_lib/utils';
import { Document, Page } from 'react-pdf';

const Minimap = ({
    pdfUrl,
    pageIndex,
    scale,
    viewportPct, // { x: 0..1, y: 0..1, w: 0..1, h: 0..1 } represents the visible area percentage
    onClick
}) => {
    // If we are not zoomed in enough, don't show or showing is useless? User wants it when zoomed.
    if (scale <= 1) return null;

    return (
        <div className="absolute right-6 bottom-20 z-50 bg-black/80 border-2 border-white/20 shadow-2xl rounded-sm overflow-hidden transition-opacity duration-300 w-[120px]">
            <div className="relative w-full aspect-[1/1.414]"> {/* Assuming A4 roughly, but fits via object-contain logic usually */}
                {/* We render a small thumbnail of the current page */}
                <Document file={pdfUrl} loading={null}>
                    <Page
                        pageNumber={pageIndex + 1}
                        width={120}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        loading={null}
                    />
                </Document>

                {/* Viewport Indicator Box */}
                <div
                    className="absolute border-2 border-green-500 bg-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all duration-75 ease-out"
                    style={{
                        top: `${viewportPct.y * 100}%`,
                        left: `${viewportPct.x * 100}%`,
                        width: `${viewportPct.w * 100}%`,
                        height: `${viewportPct.h * 100}%`,
                    }}
                />
            </div>
        </div>
    );
};

export default Minimap;
