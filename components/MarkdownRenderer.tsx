import React from 'react';

interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    const toHtml = (text: string) => {
        if (!text) return '';

        let html = text
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Links
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

        // Lists (needs to be done before paragraphs)
        html = html.replace(/^(?:-|\*)\s(.*)$/gm, '<li>$1</li>');
        html = html.replace(/^(?:\d+\.)\s(.*)$/gm, '<olli>$1</olli>'); // Use a temp tag for ordered lists
        
        // Wrap consecutive list items in <ul> or <ol>
        html = html.replace(/(<li>(?:.|\n)*?<\/li>)+/g, '<ul>$&</ul>');
        html = html.replace(/(<olli>(?:.|\n)*?<\/olli>)+/g, '<ol>$&</ol>');
        html = html.replace(/<olli>/g, '<li>').replace(/<\/olli>/g, '</li>');

        // Tables (simple implementation)
        const tableRegex = /^\|.*\|(?:\r?\n|\r)((?:\|.*\|(?:\r?\n|\r))+)/gm;
        html = html.replace(tableRegex, (table) => {
            const rows = table.trim().split('\n');
            const headerRow = rows.shift();
            const separatorRow = rows.shift();
            if (!headerRow || !separatorRow || !separatorRow.includes('---')) return table;

            let tableHtml = '<table><thead><tr>';
            headerRow.split('|').slice(1, -1).forEach(cell => {
                tableHtml += `<th>${cell.trim()}</th>`;
            });
            tableHtml += '</tr></thead><tbody>';

            rows.forEach(row => {
                tableHtml += '<tr>';
                row.split('|').slice(1, -1).forEach(cell => {
                    tableHtml += `<td>${cell.trim()}</td>`;
                });
                tableHtml += '</tr>';
            });

            tableHtml += '</tbody></table>';
            return tableHtml;
        });


        // Paragraphs
        const blocks = html.split(/\n{2,}/);
        return blocks.map(block => {
            const trimmedBlock = block.trim();
            if (trimmedBlock.startsWith('<ul') || trimmedBlock.startsWith('<ol') || trimmedBlock.startsWith('<table')) {
                return block;
            }
            if (trimmedBlock === '') return '';
            return `<p>${block.replace(/\n/g, '<br/>')}</p>`;
        }).join('');
    };

    return <div dangerouslySetInnerHTML={{ __html: toHtml(content) }} />;
};

export default MarkdownRenderer;
