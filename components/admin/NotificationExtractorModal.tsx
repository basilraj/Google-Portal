import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import Modal from '../Modal';
import Icon from '../Icon';

const NotificationExtractorModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const [notificationText, setNotificationText] = useState('');
    const [extractedJson, setExtractedJson] = useState('');
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractionError, setExtractionError] = useState('');

    const handleExtract = async () => {
        // FIX: The use of import.meta.env was causing a TypeScript error.
        // Switched to process.env.API_KEY to align with Gemini API guidelines.
        if (!process.env.API_KEY) {
            setExtractionError('API Key is not configured. Please ensure the API_KEY environment variable is set.');
            return;
        }
        if (!notificationText.trim()) {
            setExtractionError('Notification text cannot be empty.');
            return;
        }

        setIsExtracting(true);
        setExtractionError('');
        setExtractedJson('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `
You are an assistant that extracts and structures government job recruitment notifications into a structured JSON format.

### TASK
Given the full text of a government job notification, analyze it and output structured JSON in the following format:

{
  "masterNotification": {
    "jobTitle": "string",
    "organization": "string",
    "category": "string",
    "totalVacancies": "number",
    "notificationNo": "string",
    "applicationStartDate": "string (YYYY-MM-DD)",
    "applicationLastDate": "string (YYYY-MM-DD)",
    "examDate": "string or null",
    "officialPdfLink": "string or null",
    "applicationLink": "string or null"
  },
  "posts": [
    {
      "postName": "string",
      "totalVacancies": "number",
      "vacancyBreakdown": "string (formatted with UR/EWS/OBC/SC/ST/PwBD if available)",
      "payLevel": "string",
      "ageLimit": "string",
      "qualification": "string",
      "experience": "string or null",
      "examPattern": "string",
      "applicationFee": "string",
      "selectionProcess": "string",
      "importantNotes": "string or null"
    }
  ]
}

### RULES
- Always include ALL posts mentioned (e.g., Principal, PGT, TGT, Non-Teaching, etc.).
- For posts with subject-wise vacancies (like PGT/TGT), create separate entries.
- If a field is not present in the text, its value should be null, not the string "null".
- Ensure JSON is always valid and properly formatted.
- Do not skip important details like age limit, educational qualification, fee exemptions, and pay levels.
- Your output MUST be only the raw JSON text. Do not include any explanatory text, markdown formatting like \`\`\`json, or anything else. Just the JSON object.

### NOTIFICATION TEXT TO PARSE:
${notificationText}
`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                 config: {
                    responseMimeType: "application/json",
                }
            });

            // FIX: Trim whitespace from the response text as per guidelines to ensure reliable JSON parsing.
            const jsonString = response.text.trim();
            const parsedJson = JSON.parse(jsonString);
            setExtractedJson(JSON.stringify(parsedJson, null, 2));

        } catch (error) {
            console.error('Error extracting notification:', error);
            setExtractionError('Failed to extract data. The model may have returned an invalid format or an error occurred. Please check the console for details.');
        } finally {
            setIsExtracting(false);
        }
    };

    const handleCopy = () => {
        if(extractedJson){
            navigator.clipboard.writeText(extractedJson);
        }
    };

    const handleClose = () => {
        setNotificationText('');
        setExtractedJson('');
        setExtractionError('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Extract Job Details from Notification">
            <div className="space-y-4">
                <p className="text-sm text-gray-600">
                    Paste the full text from a job notification below. The AI will attempt to extract the key details into a structured JSON format.
                </p>
                <div>
                    <label htmlFor="notification-text" className="block text-sm font-medium text-gray-700">
                        Notification Text
                    </label>
                    <textarea
                        id="notification-text"
                        rows={10}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                        placeholder="Paste notification content here..."
                        value={notificationText}
                        onChange={(e) => setNotificationText(e.target.value)}
                        disabled={isExtracting}
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleExtract}
                        disabled={isExtracting || !notificationText.trim()}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
                    >
                        {isExtracting ? (
                            <><Icon name="spinner" className="animate-spin" /> Extracting...</>
                        ) : (
                            <><Icon name="wand-magic-sparkles" /> Generate JSON</>
                        )}
                    </button>
                </div>

                {extractionError && (
                    <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm rounded-md">
                        <p className="font-bold">Error:</p>
                        <p>{extractionError}</p>
                    </div>
                )}

                {extractedJson && (
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800">Extracted JSON</h3>
                        <div className="relative">
                            <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto text-sm max-h-[30vh]">
                                <code>{extractedJson}</code>
                            </pre>
                            <button
                                onClick={handleCopy}
                                className="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 text-xs rounded-md"
                            >
                                <Icon name="copy" className="mr-1" /> Copy
                            </button>
                        </div>
                    </div>
                )}
                 <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                    <button type="button" onClick={handleClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
                        {extractedJson ? 'Close' : 'Cancel'}
                    </button>
                    {extractedJson && (
                        <button type="button" onClick={() => { handleCopy(); handleClose(); }} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                           Copy & Close
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default NotificationExtractorModal;
