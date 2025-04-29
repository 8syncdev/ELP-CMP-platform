'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { X, Upload, FilePlus, FileText, Image, AlertCircle } from 'lucide-react';
import { Button } from './button';
import { Progress } from './progress';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const fileTypeIcons: Record<string, React.ReactNode> = {
    'image': <Image className="w-6 h-6 text-primary" />,
    'application/pdf': <FileText className="w-6 h-6 text-rose-500" />,
    'text': <FileText className="w-6 h-6 text-blue-500" />,
    'default': <FilePlus className="w-6 h-6 text-muted-foreground" />
};

export interface FileWithPreview extends File {
    preview: string;
}

interface FileUploadProps {
    value?: FileWithPreview[];
    onChange?: (files: FileWithPreview[]) => void;
    onBlur?: () => void;
    multiple?: boolean;
    className?: string;
    maxFiles?: number;
    accept?: Record<string, string[]>;
    disabled?: boolean;
}

export function FileUpload({
    value = [],
    onChange,
    onBlur,
    multiple = true,
    className,
    maxFiles = 5,
    accept,
    disabled = false
}: FileUploadProps) {
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            setError(null);

            // Check if we're exceeding max files
            if (value.length + acceptedFiles.length > maxFiles) {
                setError(`You can only upload up to ${maxFiles} files`);
                return;
            }

            // Simulate upload progress
            const newProgress: Record<string, number> = {};
            acceptedFiles.forEach(file => {
                newProgress[file.name] = 0;
            });
            setUploadProgress(newProgress);

            // Process files with preview
            const newFiles = acceptedFiles.map(file => {
                // Create preview for images
                const isImage = file.type.startsWith('image/');
                const preview = isImage
                    ? URL.createObjectURL(file)
                    : '';

                // Simulate upload progress
                simulateProgress(file.name);

                return Object.assign(file, { preview });
            });

            if (onChange) {
                onChange([...value, ...newFiles]);
            }

            if (onBlur) {
                onBlur();
            }
        },
        [value, onChange, onBlur, maxFiles]
    );

    const simulateProgress = (fileName: string) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 15) + 5;
            if (progress > 100) progress = 100;

            setUploadProgress(prev => ({
                ...prev,
                [fileName]: progress
            }));

            if (progress === 100) {
                clearInterval(interval);
            }
        }, 300);
    };

    const removeFile = (index: number) => {
        if (disabled) return;

        const newFiles = [...value];
        const fileToRemove = newFiles[index];

        // Revoke object URL to avoid memory leaks
        if (fileToRemove.preview) {
            URL.revokeObjectURL(fileToRemove.preview);
        }

        newFiles.splice(index, 1);

        if (onChange) {
            onChange(newFiles);
        }

        if (onBlur) {
            onBlur();
        }
    };

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        onDrop,
        multiple,
        maxSize: MAX_SIZE,
        accept,
        disabled
    });

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) return fileTypeIcons['image'];
        if (Object.keys(fileTypeIcons).includes(file.type)) return fileTypeIcons[file.type];

        // Try to match by main type
        const mainType = file.type.split('/')[0];
        if (fileTypeIcons[mainType]) return fileTypeIcons[mainType];

        return fileTypeIcons['default'];
    };

    return (
        <div className={className}>
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
                    "flex flex-col items-center justify-center text-sm",
                    isDragActive && "border-primary/50 bg-primary/5",
                    isDragAccept && "border-green-500/50 bg-green-500/5",
                    isDragReject && "border-red-500/50 bg-red-500/5",
                    disabled && "cursor-not-allowed opacity-60 bg-muted",
                    !isDragActive && !disabled && "border-muted-foreground/25 hover:border-primary/25 hover:bg-primary/5"
                )}
            >
                <input {...getInputProps()} />

                <Upload className="w-10 h-10 mb-4 text-muted-foreground" />
                <div className="text-center space-y-2">
                    <p className="text-muted-foreground">
                        {isDragActive
                            ? "Drop the files here..."
                            : "Drag & drop files here, or click to select files"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Supported files: Images, PDFs, Documents (Max 10MB)
                    </p>
                    {!multiple && value.length > 0 && (
                        <p className="text-xs text-amber-500">
                            Uploading a new file will replace the current one
                        </p>
                    )}
                </div>
            </div>

            {error && (
                <div className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                </div>
            )}

            {value.length > 0 && (
                <ul className="mt-4 space-y-3">
                    {value.map((file, index) => {
                        const isImage = file.type.startsWith('image/');
                        const isComplete = uploadProgress[file.name] === 100 || !uploadProgress[file.name];

                        return (
                            <li
                                key={`${file.name}-${index}`}
                                className="relative flex items-center gap-3 p-2 border rounded-md hover:bg-muted/50 group"
                            >
                                {isImage && file.preview ? (
                                    <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                                        <img
                                            src={file.preview}
                                            alt={file.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-12 w-12 rounded-md border flex items-center justify-center flex-shrink-0 bg-muted">
                                        {getFileIcon(file)}
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>

                                    {!isComplete && (
                                        <Progress
                                            value={uploadProgress[file.name] || 0}
                                            className="h-1 mt-1"
                                        />
                                    )}
                                </div>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                                    onClick={() => removeFile(index)}
                                    disabled={disabled}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
} 