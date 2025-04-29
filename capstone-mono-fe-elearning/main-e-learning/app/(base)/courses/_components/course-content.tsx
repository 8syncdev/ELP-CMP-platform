import MarkdownRenderer from "@/components/shared/dev/mdx/mdx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Info } from "lucide-react";

interface CourseContentProps {
    content: string;
}

export function CourseContent({ content }: CourseContentProps) {
    return (
        <div className="mt-8">
            <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                    <TabsTrigger value="content">
                        <Book className="mr-2 h-4 w-4" />
                        Nội Dung
                    </TabsTrigger>
                    <TabsTrigger value="overview">
                        <Info className="mr-2 h-4 w-4" />
                        Tổng Quan
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="mt-6">
                    <MarkdownRenderer content={content} />
                </TabsContent>
                <TabsContent value="overview" className="mt-6">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold">Bạn sẽ học được gì?</h3>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Hiểu sâu về các khái niệm cơ bản và nâng cao</li>
                            <li>Thực hành với các ví dụ thực tế</li>
                            <li>Xây dựng portfolio cá nhân</li>
                            <li>Tham gia cộng đồng học tập</li>
                        </ul>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}