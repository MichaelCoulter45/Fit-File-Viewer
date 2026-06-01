import React, { useRef, useState, ChangeEvent, DragEvent } from 'react';

// Define the Props interface
interface Props {
    onFileLoaded: (buffer: ArrayBuffer) => void;
    onError?: (error: string) => void;
}

export default function UploadBox({ onFileLoaded, onError }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    // Core file processing logic
    const processFile = async (file: File) => {
        // 1. Make sure it's a .fit file
        if (!file.name.toLowerCase().endsWith('.fit')) {
        const errorMsg = 'Invalid file type. Please select a .fit file.';
        onError?.(errorMsg);
        setFileName(null);
        return;
        }

        setFileName(file.name);
        
        try {
        // 2. Read file
        const buffer = await file.arrayBuffer();
        onFileLoaded(buffer);
        } catch (error) {
        onError?.('Error reading file.');
        console.error(error);
        }
    };

    // Click on label/button
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    // Drag and Drop 
    const handleDrag = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
        setIsDragging(true);
        } else if (e.type === 'dragleave') {
        setIsDragging(false);
        }
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const containerStyle: React.CSSProperties = {
        marginTop: 20,
        padding: '20px',
        border: `2px dashed ${isDragging ? '#007bff' : '#000000'}`,
        borderRadius: '8px',
        textAlign: 'center',
        backgroundColor: isDragging ? '#210166' : '#03003837',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    };

    return (
        <div
        style={containerStyle}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        >
            <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
            {fileName ? (
            <p>Selected: <strong>{fileName}</strong></p>
            ) : (
            <p>Drag & Drop .FIT file or click to select</p>
            )}
            </label>
            <input
                id="file-input"
                ref={inputRef}
                type="file"
                accept=".fit"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </div>
    );
}

