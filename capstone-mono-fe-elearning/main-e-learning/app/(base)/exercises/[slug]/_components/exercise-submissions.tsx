'use client'

import { ExerciseDto } from "@/lib/actions/exercise"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { MY_INFO } from "@/constants/my-info"

const SubmissionsOverlay = ({ onLogin }: { onLogin: () => void }) => (
    <div className="absolute inset-0 flex flex-col items-stretch">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

        <div className="relative mt-[30%] flex items-center justify-center p-4 z-10">
            <Card className="w-full max-w-md border-2 border-primary/20 shadow-lg">
                <CardContent className="pt-8 pb-6 text-center space-y-6">
                    <div className="relative">
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary/10 rounded-full p-4">
                            <Lock className="w-8 h-8 text-primary" />
                        </div>
                    </div>

                    <div className="space-y-3 px-4">
                        <h3 className="text-2xl font-bold tracking-tight">
                            Bạn cần đăng kí chính sách để xem lịch sử nộp bài của bạn.
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Vui lòng liên hệ Zalo để được hỗ trợ đăng ký.
                        </p>
                    </div>

                    <Button
                        onClick={onLogin}
                        size="lg"
                        className="w-[90%] bg-gradient-to-r from-primary to-primary/90 hover:opacity-90"
                    >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Liên Hệ Zalo
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
)

interface ExerciseSubmissionsProps {
    exercise: ExerciseDto;
    allowShowSubmissions?: boolean;
}

export const ExerciseSubmissions = ({
    exercise,
    allowShowSubmissions = false
}: ExerciseSubmissionsProps) => {
    const router = useRouter();

    const handleLogin = () => {
        window.open(MY_INFO.socials.zalo, '_blank');
    };

    return (
        <div className="space-y-4 relative">
            {allowShowSubmissions ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Thời gian</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Ngôn ngữ</TableHead>
                            <TableHead>Điểm</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* TODO: Replace with actual submissions data */}
                        <TableRow>
                            <TableCell>
                                {formatDistanceToNow(new Date(), {
                                    addSuffix: true,
                                    locale: vi
                                })}
                            </TableCell>
                            <TableCell>
                                <Badge variant="default">Đạt</Badge>
                            </TableCell>
                            <TableCell>Python</TableCell>
                            <TableCell>100/100</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            ) : (
                <div className="relative">
                    <div className="blur-[0.05rem]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Thời gian</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Ngôn ngữ</TableHead>
                                    <TableHead>Điểm</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>---</TableCell>
                                    <TableCell>---</TableCell>
                                    <TableCell>---</TableCell>
                                    <TableCell>---</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <SubmissionsOverlay onLogin={handleLogin} />
                </div>
            )}
        </div>
    )
} 