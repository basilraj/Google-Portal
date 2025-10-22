import React from 'react';

export type AdPlacement = 'header' | 'sidebar' | 'footer' | 'in-feed';

interface AdComponentProps {
    code: string;
    placement: AdPlacement;
}

const AdComponent: React.FC<AdComponentProps> = ({ code, placement }) => {
    const isPlaceholder = code.trim().startsWith('<!--') && code.trim().endsWith('-->');

    if (isPlaceholder) {
        const dimensions = {
            header: { width: '728px', height: '90px', text: '728x90 Ad Space' },
            sidebar: { width: '300px', height: '250px', text: '300x250 Ad Space' },
            footer: { width: '728px', height: '90px', text: '728x90 Ad Space' },
            'in-feed': { width: '728px', height: '90px', text: '728x90 In-Feed Ad' },
        };
        const style = dimensions[placement];

        return (
            <div className="my-6 flex items-center justify-center bg-gray-200 border-2 border-dashed border-gray-400 rounded-md mx-auto" style={{ maxWidth: style.width, height: style.height }}>
                <span className="text-gray-500 font-semibold">{style.text}</span>
            </div>
        );
    }
    
    return <div className="my-6" dangerouslySetInnerHTML={{ __html: code }} />;
};

export default AdComponent;
