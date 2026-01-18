'use client';
import React from 'react'
import { Button } from '../../button';
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

const Zoom = ({ zoomScale, screenWidth, onZoomIn, onZoomOut, onResetZoom }) => {
    return (
        <>
            {screenWidth > 768 &&
                <>
                    <Button onClick={onZoomOut} disabled={zoomScale == 1} variant='secondary' size='icon' className='size-8 min-w-8'><ZoomOut className="size-4 min-w-4" /></Button>
                    <Button onClick={onZoomIn} disabled={zoomScale >= 5} variant='secondary' size='icon' className='size-8 min-w-8'><ZoomIn className="size-4 min-w-4" /></Button>
                    <Button onClick={onResetZoom} variant='secondary' size='icon' className='size-8 min-w-8'><RotateCcw className="size-4 min-w-4" /></Button>
                </>
            }
        </>
    )
}

export default Zoom