import React, { useRef, useEffect, useState } from 'react';

const useRefSize = () => {
    const ref = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    const handleResize = () => {
        if (ref.current) {
            setSize({
                width: ref.current.offsetWidth,
                height: ref.current.offsetHeight
            });
        }
    };

    useEffect(() => {
        if (!ref.current) return;

        const observer = new ResizeObserver((entries) => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;

                setSize({
                    width: entries[0].contentRect.width,
                    height: entries[0].contentRect.height
                });
            }
        });

        observer.observe(ref.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    const refreshSize = () => {
        handleResize();
    };

    return { ref, ...size, refreshSize };
};

export default useRefSize;