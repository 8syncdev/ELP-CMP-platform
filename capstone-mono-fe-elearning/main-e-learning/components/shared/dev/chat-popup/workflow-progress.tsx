import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle2, XCircle, AlertTriangle, RotateCw, ArrowDownUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export type WorkflowStepStatus = 'idle' | 'loading' | 'complete' | 'error';

export interface WorkflowStepProps {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    status: WorkflowStepStatus;
    isActive?: boolean;
    error?: string;
    elapsedTime?: string;
    progress?: number;
    progressColor?: string;
    onRetry?: () => void;
}

export interface WorkflowProgressProps {
    steps: WorkflowStepProps[];
    progress: number;
    iteration?: number;
    totalIterations?: number;
    title?: string;
    titleIcon?: React.ReactNode;
    className?: string;
    flowDirection?: 'up' | 'down';
    onToggleDirection?: () => void;
}

export const WorkflowProgress: React.FC<WorkflowProgressProps> = ({
    steps,
    progress,
    iteration,
    totalIterations,
    title = 'Quá trình xử lý',
    titleIcon,
    className,
    flowDirection = 'down',
    onToggleDirection
}) => {
    // Sort steps based on flow direction
    const sortedSteps = [...steps].sort((a, b) => {
        if (flowDirection === 'up') {
            return steps.indexOf(b) - steps.indexOf(a);
        }
        return steps.indexOf(a) - steps.indexOf(b);
    });

    return (
        <div className={cn("bg-muted/30 rounded-lg p-3 border border-border animate-fade-in", className)}>
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium flex items-center">
                    {titleIcon && <span className="mr-2">{titleIcon}</span>}
                    {title}
                </h4>
                <div className="flex items-center gap-2">
                    {iteration && totalIterations && (
                        <span className="text-xs text-muted-foreground">
                            Vòng {iteration}/{totalIterations}
                        </span>
                    )}
                    {onToggleDirection && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onToggleDirection}
                            className="h-6 w-6 p-0 rounded-full"
                            title={`Đổi hướng hiển thị ${flowDirection === 'down' ? 'từ dưới lên' : 'từ trên xuống'}`}
                        >
                            <ArrowDownUp className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            </div>

            <Progress value={progress} className="h-1.5 mb-3" />

            <div className={cn(
                "space-y-2 text-sm relative",
                flowDirection === 'up' && "flex flex-col-reverse"
            )}>
                {/* Connector line */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-muted-foreground/20 -z-10" />

                {sortedSteps.map((step) => (
                    <div
                        key={step.id}
                        className={cn(
                            "flex items-start gap-2 p-2 rounded-md transition-all duration-300 relative",
                            step.status === 'loading' && "bg-blue-100/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
                            step.status === 'complete' && "text-green-700 dark:text-green-300",
                            step.status === 'error' && "bg-red-100/30 dark:bg-red-900/20 text-red-700 dark:text-red-300",
                            step.isActive && "border-l-2 border-primary pl-2"
                        )}
                    >
                        <div className={cn(
                            "p-1 rounded-full z-10 bg-background",
                            step.status === 'loading' && "animate-pulse text-blue-500",
                            step.status === 'complete' && "text-green-500",
                            step.status === 'error' && "text-red-500",
                            step.status === 'idle' && "text-gray-400"
                        )}>
                            {step.status === 'loading' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : step.status === 'complete' ? (
                                <CheckCircle2 className="h-4 w-4" />
                            ) : step.status === 'error' ? (
                                <AlertTriangle className="h-4 w-4" />
                            ) : (
                                step.icon
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="font-medium text-xs flex justify-between">
                                <span>{step.name}</span>
                                {step.elapsedTime && (
                                    <span className="text-xs opacity-70">
                                        {step.elapsedTime}
                                    </span>
                                )}
                            </div>
                            {step.status === 'loading' && (
                                <>
                                    <div className="text-xs opacity-80 mb-1">{step.description}</div>
                                    {step.progress !== undefined && (
                                        <div className="w-full h-1 bg-muted/50 rounded-full overflow-hidden mt-1">
                                            <div
                                                className={cn("h-full transition-all duration-300",
                                                    step.progressColor || "bg-blue-500"
                                                )}
                                                style={{ width: `${step.progress}%` }}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                            {step.status === 'error' && (
                                <div className="text-xs text-red-500 mb-1">
                                    {step.error || 'Đã xảy ra lỗi'}
                                </div>
                            )}
                            {step.status === 'error' && step.onRetry && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-6 text-xs px-2 py-0 mt-1 bg-background/70"
                                    onClick={step.onRetry}
                                >
                                    <RotateCw className="h-3 w-3 mr-1" />
                                    Thử lại
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkflowProgress; 