'use client'

import { memo, useState } from 'react'
import dynamic from "next/dynamic"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, Save, Terminal } from "lucide-react"
import { ExerciseDto } from "@/lib/actions/exercise"
import { useTheme } from "next-themes"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useIsMobile } from '@/hooks/use-mobile'
import { createSubmissionExternalService } from '@/lib/actions/submission'
import { ExerciseTestRun } from './exercise-test-run'
import { ExerciseSubmit } from './exercise-submit'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExerciseTerminal } from './exercise-terminal'

const MonacoEditor = dynamic(
    () => import("@monaco-editor/react").then((mod) => mod.Editor),
    { ssr: false }
)

interface ExerciseEditorProps {
    exercise: ExerciseDto
}

export const ExerciseEditor = memo(({ exercise }: ExerciseEditorProps) => {
    const { theme: systemTheme, setTheme: setSystemTheme } = useTheme()
    const [code, setCode] = useState("")
    const [language, setLanguage] = useState(exercise.metadata.language[0].toLowerCase())
    const [fontSize, setFontSize] = useState(14)
    const [showLineNumbers, setShowLineNumbers] = useState(true)
    const [editorTheme, setEditorTheme] = useState(systemTheme === 'dark' ? 'vs-dark' : 'light')
    const [testResult, setTestResult] = useState<any>(null)
    const [isRunning, setIsRunning] = useState(false)
    const [activeTab, setActiveTab] = useState("run")

    const handleThemeChange = (newTheme: string) => {
        setEditorTheme(newTheme)
        setSystemTheme(newTheme === 'vs-dark' ? 'dark' : 'light')
    }

    const handleRun = async () => {
        try {
            setIsRunning(true)
            const response = await createSubmissionExternalService({
                exercise_slug: exercise.slug,
                code: code,
                language: language,
            })
            setTestResult(response.result)
        } catch (error) {
            console.error(error)
        } finally {
            setIsRunning(false)
        }
    }

    const isMobile = useIsMobile()

    return (
        <Card className="h-full border-0 rounded-none">
            <CardHeader className="border-b">
                <CardTitle>Code Editor</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col">
                <div className="flex flex-wrap gap-4 p-4 border-b">
                    <div className="flex items-center gap-2 min-w-[12.5rem] flex-1">
                        <Label className="whitespace-nowrap">Ngôn ngữ:</Label>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {exercise.metadata.language.map((lang) => (
                                    <SelectItem key={lang} value={lang.toLowerCase()}>
                                        {lang}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2 min-w-[12.5rem] flex-1">
                        <Label className="whitespace-nowrap">
                            Font Size: {fontSize}px
                        </Label>
                        <Slider
                            value={[fontSize]}
                            onValueChange={([value]) => setFontSize(value)}
                            min={10}
                            max={24}
                            step={1}
                        />
                    </div>

                    <div className="flex items-center gap-2 min-w-[9.375rem]">
                        <Label>Line Numbers:</Label>
                        <Switch
                            checked={showLineNumbers}
                            onCheckedChange={setShowLineNumbers}
                        />
                    </div>

                    <div className="flex items-center gap-2 min-w-[9.375rem]">
                        <Label>Theme:</Label>
                        <Select value={editorTheme} onValueChange={handleThemeChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="vs-dark">Dark</SelectItem>
                                <SelectItem value="light">Light</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex-1">
                    <MonacoEditor
                        height={isMobile ? "calc(100vh - 35rem)" : "calc(100vh - 30rem)"}
                        language={language}
                        value={code}
                        onChange={(value) => setCode(value || "")}
                        theme={editorTheme}
                        options={{
                            minimap: { enabled: false },
                            fontSize: fontSize,
                            lineNumbers: showLineNumbers ? "on" : "off",
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            quickSuggestions: {
                                other: true,
                                comments: true,
                                strings: true,
                            },
                            suggestFontSize: fontSize,
                            suggest: {
                                preview: true,
                                showColors: true,
                                showIcons: true,
                                showStatusBar: true,
                                previewMode: "subwordSmart",
                            },
                            wordWrap: "on",
                        }}
                    />

                </div>
            </CardContent>
            <div className="border-t">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="border-b px-4">
                        <TabsList className="border-b-0">
                            <TabsTrigger value="run" className="flex items-center gap-2">
                                <PlayCircle className="w-4 h-4" />
                                Chạy & Nộp bài
                            </TabsTrigger>
                            <TabsTrigger value="terminal" className="flex items-center gap-2">
                                <Terminal className="w-4 h-4" />
                                Terminal
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="run" className="m-0">
                        <CardFooter className="gap-2 p-2">
                            <Button
                                variant="default"
                                onClick={handleRun}
                                disabled={isRunning}
                                className="flex items-center gap-2"
                            >
                                <PlayCircle className="w-4 h-4" />
                                {isRunning ? "Đang chạy..." : "Chạy thử"}
                            </Button>
                            <ExerciseSubmit
                                exercise={exercise}
                                code={code}
                                language={language}
                                isDisabled={isRunning}
                            />
                        </CardFooter>
                        <div className="p-4 border-t">
                            <ExerciseTestRun
                                result={testResult}
                                isLoading={isRunning}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="terminal" className="m-0">
                        <ExerciseTerminal code={code} />
                    </TabsContent>
                </Tabs>
            </div>
        </Card>
    )
})

ExerciseEditor.displayName = "ExerciseEditor" 