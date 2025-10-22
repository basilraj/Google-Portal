import React, { useEffect, useRef } from 'react';

export type AdPlacement = 'header' | 'sidebar' | 'footer' | 'in-feed';

interface AdComponentProps {
    code: string;
    placement: AdPlacement;
}

const AdComponent: React.FC<AdComponentProps> = ({ code, placement }) => {
    const adContainerRef = useRef<HTMLDivElement>(null);
    // An ad code is considered a placeholder only if it's the default comment.
    const isPlaceholder = code.trim().startsWith('<!--') && code.trim().endsWith('-->');

    useEffect(() => {
        if (isPlaceholder || !adContainerRef.current) return;

        const container = adContainerRef.current;
        container.innerHTML = ''; // Clear previous content to avoid ad duplication on re-renders

        // Create a temporary div to parse the HTML string. This is a standard way
        // to handle an HTML string and extract its parts, like script tags.
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = code;

        // Find all script tags within the provided ad code.
        const scripts = Array.from(tempDiv.getElementsByTagName('script'));

        // Append the main content (non-script parts) of the ad code.
        container.innerHTML = tempDiv.innerHTML;

        // For each script found, create a *new* script element and append it.
        // This is the crucial step that forces the browser to execute the script.
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            // Copy all attributes (like src, async, etc.) from the original script tag.
            for (let i = 0; i < script.attributes.length; i++) {
                const attr = script.attributes[i];
                newScript.setAttribute(attr.name, attr.value);
            }
            // Copy the inline script content.
            if (script.innerHTML) {
                newScript.innerHTML = script.innerHTML;
            }
            document.body.appendChild(newScript);
        });

    }, [code, isPlaceholder]);

    if (isPlaceholder) {
        const dimensions = {
            header: { width: '728px', height: '90px', text: '728x90 Ad Space' },
            sidebar: { width: '300px', height: '250px', text: '300x250 Ad Space' },
            footer: { width: '728px', height: '90px', text: '728x90 Ad Space' },
            'in-feed': { width: '728px', height: '90px', text: '728x90 In-Feed Ad' },
        };
        const style = dimensions[placement];

        return (
            <div className="my-6 flex items-center justify-center bg-gray-200 border-2 border-dashed border-gray-400 rounded-md mx-auto" style={{ maxWidth: style.width, minHeight: style.height }}>
                <span className="text-gray-500 font-semibold">{style.text}</span>
            </div>
        );
    }
    
    // Using a key ensures React creates a new component instance when the ad code changes,
    // which guarantees a clean state for the useEffect hook.
    return <div key={code} ref={adContainerRef} className="my-6 flex justify-center items-center" />;
};

export default AdComponent;