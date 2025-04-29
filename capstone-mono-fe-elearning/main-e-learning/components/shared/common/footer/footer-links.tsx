import { MY_INFO } from "@/constants";
import { Code2, Brain, Server } from "lucide-react";

export function FooterLinks() {
    return (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
                <div className="flex items-center gap-2 font-semibold">
                    <Server className="h-5 w-5" />
                    Backend
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                    {MY_INFO.techStack.backend.map((tech) => (
                        <li key={tech}>{tech}</li>
                    ))}
                </ul>
            </div>
            <div>
                <div className="flex items-center gap-2 font-semibold">
                    <Code2 className="h-5 w-5" />
                    Frontend
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                    {MY_INFO.techStack.frontend.map((tech) => (
                        <li key={tech}>{tech}</li>
                    ))}
                </ul>
            </div>
            <div>
                <div className="flex items-center gap-2 font-semibold">
                    <Brain className="h-5 w-5" />
                    AI
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                    {MY_INFO.techStack.ai.map((tech) => (
                        <li key={tech}>{tech}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
} 