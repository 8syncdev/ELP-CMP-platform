'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Code2, History } from "lucide-react"
import { MarkdownRenderer } from "@/components/shared/dev/mdx"
import { ExerciseSolution } from "./exercise-solution"
import { ExerciseSubmissions } from "./exercise-submissions"
import { ExerciseDto } from "@/lib/actions/exercise"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ExerciseEditor } from "./exercise-editor"
import { useIsMobile } from "@/hooks/use-mobile"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

interface ExerciseContentProps {
    exercise: ExerciseDto;
    allowShowSolution?: boolean;
}

export const ExerciseContent = ({ exercise, allowShowSolution = false }: ExerciseContentProps) => {
    const isMobile = useIsMobile()
    const [activeTab, setActiveTab] = useState<'content' | 'editor'>('content')

    if (isMobile) {
        return (
            <div className="h-full flex flex-col">
                <div className="flex border-b">
                    <button
                        className={`flex-1 p-3 text-sm font-medium ${activeTab === 'content' ? 'border-b-2 border-primary' : ''}`}
                        onClick={() => setActiveTab('content')}
                    >
                        Nội dung
                    </button>
                    <button
                        className={`flex-1 p-3 text-sm font-medium ${activeTab === 'editor' ? 'border-b-2 border-primary' : ''}`}
                        onClick={() => setActiveTab('editor')}
                    >
                        Code Editor
                    </button>
                </div>

                {activeTab === 'content' ? (
                    <div className="flex-1 overflow-auto">
                        <Tabs defaultValue="problem" className="h-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="problem">
                                    <BookOpen className="w-4 h-4" />
                                </TabsTrigger>
                                <TabsTrigger value="solution">
                                    <Code2 className="w-4 h-4" />
                                </TabsTrigger>
                                <TabsTrigger value="submissions">
                                    <History className="w-4 h-4" />
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="problem" className="mt-4 px-4">
                                <MarkdownRenderer content={exercise.content} />
                            </TabsContent>
                            <TabsContent value="solution" className="mt-4 px-4">
                                <ExerciseSolution exercise={exercise} allowShowSolution={allowShowSolution} />
                            </TabsContent>
                            <TabsContent value="submissions" className="mt-4 px-4">
                                <ExerciseSubmissions exercise={exercise} />
                            </TabsContent>
                        </Tabs>
                    </div>
                ) : (
                    <div className="flex-1">
                        <ExerciseEditor exercise={exercise} />
                    </div>
                )}
            </div>
        )
    }

    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="h-[calc(100vh-4rem)]"
        >
            <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full flex flex-col">
                    <Tabs defaultValue="problem" className="flex-1">
                        <TabsList className="w-full grid grid-cols-3 sticky top-0 z-10 bg-background">
                            <TabsTrigger value="problem" className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                <span className="hidden sm:inline">Đề bài</span>
                            </TabsTrigger>
                            <TabsTrigger value="solution" className="flex items-center gap-2">
                                <Code2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Giải chi tiết</span>
                            </TabsTrigger>
                            <TabsTrigger value="submissions" className="flex items-center gap-2">
                                <History className="w-4 h-4" />
                                <span className="hidden sm:inline">Lịch sử nộp</span>
                            </TabsTrigger>
                        </TabsList>

                        <ScrollArea className="flex-1 h-[calc(100vh-8rem)]">
                            <div className="px-4">
                                <TabsContent value="problem" className="mt-4 m-0">
                                    <MarkdownRenderer content={exercise.content} />
                                </TabsContent>
                                <TabsContent value="solution" className="mt-4 m-0">
                                    <ExerciseSolution exercise={exercise} allowShowSolution={allowShowSolution} />
                                </TabsContent>
                                <TabsContent value="submissions" className="mt-4 m-0">
                                    <ExerciseSubmissions exercise={exercise} />
                                </TabsContent>
                            </div>
                        </ScrollArea>
                    </Tabs>
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50} minSize={30}>
                <ExerciseEditor exercise={exercise} />
            </ResizablePanel>
        </ResizablePanelGroup>
    )
} 