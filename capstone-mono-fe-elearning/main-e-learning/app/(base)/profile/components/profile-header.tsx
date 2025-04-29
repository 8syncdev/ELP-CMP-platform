"use client";

import { useAuth } from "@/providers";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DotPattern } from "./dot-pattern";

export function ProfileHeader() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const router = useRouter();

    const handleTabChange = (value: string) => {
        setActiveTab(value);

        if (value === "profile") {
            router.push("/profile");
        } else if (value === "subscriptions") {
            router.push("/profile?tab=subscriptions");
        }
    };

    return (
        <div className="relative mb-10">
            <DotPattern
                className="absolute inset-0 -z-10 h-full w-full opacity-50"
                width={32}
                height={32}
                cx={1}
                cy={1}
                cr={1}
            />

            <div className="relative z-10 text-center mb-10 max-w-3xl mx-auto px-4">
                <div className="inline-block mb-4 rounded-full bg-primary/10 p-2 backdrop-blur">
                    <div className="rounded-full bg-primary/10 p-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-10 w-10 text-primary"
                        >
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                    Thông tin tài khoản
                </h1>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                    Quản lý thông tin cá nhân và xem các gói học tập đã đăng ký của bạn. Cập nhật thông tin và theo dõi các gói đăng ký để tận dụng tối đa tính năng của nền tảng.
                </p>

                <Tabs
                    defaultValue="profile"
                    value={activeTab}
                    onValueChange={handleTabChange}
                    className="w-full max-w-md mx-auto"
                >
                    <TabsList className="grid w-full grid-cols-2 p-1">
                        <TabsTrigger value="profile" className="rounded-md py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            Thông tin cá nhân
                        </TabsTrigger>
                        <TabsTrigger value="subscriptions" className="rounded-md py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            Gói đã đăng ký
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </div>
    );
} 