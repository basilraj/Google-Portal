import React, { useEffect, useRef } from 'react';
import Icon from './Icon.tsx';

export type AdPlacement = 'header' | 'sidebar' | 'footer' | 'in-feed';

interface AdComponentProps {
    code: string;
    placement: AdPlacement;
}

const AdComponent: React.FC<AdComponentProps> = ({ code, placement }) => {
    const adContainerRef = useRef<HTMLDivElement>(null);
    const isPlaceholder = code.trim().startsWith('<!--') && code.trim().endsWith('-->');

    // New Test Ad Logic
    if (code.trim().startsWith('<!-- JOBTICA_TEST_AD::')) {
        const placementName = code.match(/::(.*?)\s*-->/)?.[1] || 'Test Ad';
        return (
            <div className="my-6 flex flex-col items-center justify-center bg-yellow-300 border-2 border-dashed border-yellow-500 rounded-md mx-auto p-4 text-center" style={{ maxWidth: '728px', minHeight: '90px' }}>
                <Icon name="vial" className="text-yellow-700 text-2xl mb-2" />
                <span className="text-yellow-800 font-bold text-lg">TEST MODE ACTIVE</span>
                <span className="text-yellow-700 font-mono text-sm">{placementName}</span>
            </div>
        );
    }

    useEffect(() => {
        if (isPlaceholder || !adContainerRef.current) return;

        const container = adContainerRef.current;
        container.innerHTML = ''; // Clear previous content to avoid ad duplication

        // Use a DocumentFragment to parse the HTML string into DOM nodes
        const range = document.createRange();
        const documentFragment = range.createContextualFragment(code);
        const nodes = Array.from(documentFragment.childNodes);

        nodes.forEach(node => {
            // If the node is a script, we need to create a new script element
            // and append it to the container to force it to execute.
            if (node.nodeName === 'SCRIPT') {
                const script = node as HTMLScriptElement;
                const newScript = document.createElement('script');

                // Copy all attributes (src, async, type, etc.)
                script.getAttributeNames().forEach(attrName => {
                    newScript.setAttribute(attrName, script.getAttribute(attrName) || '');
                });

                // Copy the inline script content
                if (script.innerHTML) {
                    newScript.innerHTML = script.innerHTML;
                }

                container.appendChild(newScript);
            } else {
                // For all other nodes (like <ins>, <div>, comments), just append them directly.
                container.appendChild(node.cloneNode(true));
            }
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