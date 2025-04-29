'use client';


declare global {
    interface Window {
        SpeechRecognition?: any;
        webkitSpeechRecognition: any;
    }
}

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";
import { LANGUAGES } from "../constants/languages";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface VoiceToTextProps {
    onTranscript: (text: string) => void;
    defaultLanguage?: keyof typeof LANGUAGES;
    disabled?: boolean;
}

export function VoiceToText({
    onTranscript,
    defaultLanguage = 'vi-VN',
    disabled = false
}: VoiceToTextProps) {
    const [isListening, setIsListening] = useState(false);
    const [selectedLang, setSelectedLang] = useState<keyof typeof LANGUAGES>(defaultLanguage);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = selectedLang;

            recognitionRef.current.onresult = (event: any) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        transcript += event.results[i][0].transcript;
                    }
                }
                if (transcript) {
                    onTranscript(transcript);
                }
            };

            recognitionRef.current.onerror = () => {
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [selectedLang, onTranscript]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert(LANGUAGES[selectedLang].notSupported);
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    return (
        <Card className={cn(disabled ? "opacity-50 cursor-not-allowed p-4" : "p-4")}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between gap-4"
            >
                <Select value={selectedLang} onValueChange={(value: keyof typeof LANGUAGES) => setSelectedLang(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn ngôn ngữ" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(LANGUAGES).map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                                {lang.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <span className="text-sm text-muted-foreground flex-1">
                    {isListening ?
                        LANGUAGES[selectedLang].listening :
                        LANGUAGES[selectedLang].placeholder
                    }
                </span>

                <Button
                    variant={isListening ? "destructive" : "secondary"}
                    size="sm"
                    onClick={toggleListening}
                >
                    {isListening ? (
                        <MicOff className="h-4 w-4" />
                    ) : (
                        <Mic className="h-4 w-4" />
                    )}
                </Button>
            </motion.div>
        </Card>
    );
} 