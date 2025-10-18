import React, { useEffect } from 'react';

interface SEOHelmetProps {
  title: string;
  description: string;
  keywords?: string;
}

const SEOHelmet: React.FC<SEOHelmetProps> = ({ title, description, keywords }) => {
  useEffect(() => {
    document.title = `${title} | Sarkari Result - Sarkari Naukri, Govt Jobs`;

    const setMetaTag = (name: string, content: string) => {
        let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
        if (!element) {
            element = document.createElement('meta');
            element.name = name;
            document.head.appendChild(element);
        }
        element.content = content;
    };

    setMetaTag('description', description);
    if (keywords) {
        setMetaTag('keywords', keywords);
    }
  }, [title, description, keywords]);

  return null;
};

export default SEOHelmet;
