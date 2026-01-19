'use client'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { Suspense } from 'react';
const primaryColor = "hsl(var(--primary))"; // Primary color of website

export default function NprogressProviders({ children }) {
    return (
        <>
            {children}
            <Suspense>
                <ProgressBar
                    height="4px"
                    color={primaryColor}
                    options={{ showSpinner: false }}
                    shallowRouting
                />
            </Suspense>
        </>
    );
};