import { Metadata } from "next";
import { ProfileHeader } from "./components/profile-header";
import { UserProfileContent } from "./components/user-profile-content";

export const metadata: Metadata = {
    title: "Thông tin tài khoản",
    description: "Quản lý thông tin cá nhân và các gói học tập đã đăng ký",
};

export default async function ProfilePage() {
    return (
        <div className="container mx-auto py-8 md:py-16 flex flex-col items-center justify-center">
            <div className="w-full max-w-5xl">
                <ProfileHeader />
                <UserProfileContent />
            </div>
        </div>
    );
} 