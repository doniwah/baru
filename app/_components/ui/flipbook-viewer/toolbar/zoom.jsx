'use client';
import React from 'react'
// import { useControls } from 'react-zoom-pan-pinch';
import { Button } from '../../button';
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

// Zoom feature temporarily disabled due to react-zoom-pan-pinch mounting issues
const Zoom = ({ zoomScale, screenWidth }) => {
    // Zoom controls are disabled until TransformWrapper mounting issue is resolved
    return null;
    
    /* Original zoom controls - commented out temporarily
    const ZoomControls = ({ zoomScale, screenWidth }) => {
        const { zoomIn, zoomOut, resetTransform } = useControls();
        
        return (
            <>
                {screenWidth > 768 &&
                    <>
                        <Button onClick={() => zoomOut(0.25)} disabled={zoomScale == 1} variant='secondary' size='icon' className='size-8 min-w-8'><ZoomOut className="size-4 min-w-4" /></Button>
                        <Button onClick={() => zoomIn(0.25)} disabled={zoomScale >= 5} variant='secondary' size='icon' className='size-8 min-w-8'><ZoomIn className="size-4 min-w-4" /></Button>
                        <Button onClick={() => resetTransform()} variant='secondary' size='icon' className='size-8 min-w-8'><RotateCcw className="size-4 min-w-4" /></Button>
                    </>
                }
            </>
        )
    }
    */
}

export default Zoom