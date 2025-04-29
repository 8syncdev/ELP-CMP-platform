"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { UserProfileTab } from "./user-profile-tab";
import { UserSubscriptionsTab } from "./user-subscriptions-tab";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function UserProfileContent() {
    const { user, isLoading } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const searchParams = useSearchParams();
    const { toast } = useToast();

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab === "subscriptions") {
            setActiveTab("subscriptions");
        } else {
            setActiveTab("profile");
        }
    }, [searchParams]);

    if (isLoading) {
        return (
            <Card className="w-full max-w-4xl mx-auto p-8">
                <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                    <p className="text-muted-foreground">Đang tải thông tin tài khoản...</p>
                </div>
            </Card>
        );
    }

    if (!user) {
        return (
            <Card className="w-full max-w-4xl mx-auto p-8">
                <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-xl font-medium mb-2">Vui lòng đăng nhập để xem thông tin tài khoản</p>
                    <p className="text-muted-foreground">Bạn cần đăng nhập để truy cập trang này</p>
                </div>
            </Card>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <Tabs value={activeTab} className="w-full">
                <TabsContent value="profile" className="mt-0">
                    <UserProfileTab user={user} />
                </TabsContent>
                <TabsContent value="subscriptions" className="mt-0">
                    <UserSubscriptionsTab userId={user.userID} />
                </TabsContent>
            </Tabs>
        </div>
    );
} 