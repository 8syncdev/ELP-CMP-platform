"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getPricingUsersByUserAuth, getPricing, deletePricingUserAuth } from "@/lib/actions/pricing";
import { PricingUserDto, PricingDto } from "@/lib/actions/pricing/pricing.type";
import { Badge } from "@/components/ui/badge";
import {
    Loader2,
    Calendar,
    CheckCircle2,
    Clock,
    AlertCircle,
    ExternalLink,
    Sparkles,
    Trash2,
    CreditCard,
    AlertTriangle
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import MarkdownRenderer from "@/components/shared/dev/mdx/mdx";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface UserSubscriptionsTabProps {
    userId: string;
}

interface PricingSubscription extends PricingUserDto {
    pricing?: PricingDto;
}

export function UserSubscriptionsTab({ userId }: UserSubscriptionsTabProps) {
    const [subscriptions, setSubscriptions] = useState<PricingSubscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cancelling, setCancelling] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [selectedPricingId, setSelectedPricingId] = useState<number | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    const fetchSubscriptions = async () => {
        try {
            const response = await getPricingUsersByUserAuth();

            if (response.success && response.result) {
                const subscriptionsData = Array.isArray(response.result) ? response.result : [response.result];

                // Fetch pricing details for each subscription
                const subscriptionsWithPricing = await Promise.all(
                    subscriptionsData.map(async (subscription) => {
                        try {
                            const pricingResponse = await getPricing(subscription.pricing_id);

                            if (pricingResponse.success && pricingResponse.result) {
                                const pricingData = Array.isArray(pricingResponse.result)
                                    ? pricingResponse.result[0]
                                    : pricingResponse.result;

                                return {
                                    ...subscription,
                                    pricing: pricingData
                                };
                            }

                            return subscription;
                        } catch (error) {
                            console.error("Error fetching pricing details:", error);
                            return subscription;
                        }
                    })
                );

                setSubscriptions(subscriptionsWithPricing);
            }
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const handleConfirmCancel = (pricingId: number) => {
        setSelectedPricingId(pricingId);
        setDialogOpen(true);
    };

    const handleCancelSubscription = async () => {
        if (!selectedPricingId) return;

        try {
            setCancelling(selectedPricingId);
            const response = await deletePricingUserAuth(selectedPricingId);

            if (response.success) {
                toast({
                    title: "Hủy đăng ký thành công",
                    description: "Bạn đã hủy đăng ký gói học tập này",
                });

                // Refresh subscriptions
                await fetchSubscriptions();
            } else {
                throw new Error(response.message || "Không thể hủy đăng ký");
            }
        } catch (error) {
            toast({
                title: "Lỗi",
                description: error instanceof Error ? error.message : "Đã có lỗi xảy ra khi hủy đăng ký",
                variant: "destructive",
            });
        } finally {
            setCancelling(null);
            setDialogOpen(false);
            setSelectedPricingId(null);
        }
    };


    if (isLoading) {
        return (
            <Card className="w-full">
                <CardContent className="p-8">
                    <div className="flex flex-col items-center justify-center h-64">
                        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                        <p className="text-muted-foreground">Đang tải thông tin gói đăng ký...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (subscriptions.length === 0) {
        return (
            <Card className="w-full bg-card/80 backdrop-blur-sm">
                <CardContent className="p-10">
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="relative mb-6">
                            <div className="absolute -inset-1 rounded-full bg-primary/20 blur-md"></div>
                            <AlertCircle className="relative h-16 w-16 text-primary" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-3">Bạn chưa đăng ký gói học tập nào</h3>
                        <p className="text-muted-foreground mb-8 text-center max-w-md">
                            Khám phá các gói học tập để có thể truy cập đầy đủ nội dung và tính năng trên nền tảng của chúng tôi
                        </p>
                        <Button onClick={() => router.push("/pricing")} className="gap-2 py-2.5 px-5 bg-primary/90 hover:bg-primary">
                            <Sparkles className="h-4 w-4" />
                            Khám phá các gói học tập
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-700 border-green-200";
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "expired":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "active":
                return "Đang hoạt động";
            case "pending":
                return "Chờ xác nhận";
            case "expired":
                return "Đã hết hạn";
            case "inactive":
                return "Không hoạt động";
            default:
                return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "active":
                return <CheckCircle2 className="h-4 w-4 mr-1" />;
            case "pending":
                return <Clock className="h-4 w-4 mr-1" />;
            case "expired":
                return <AlertCircle className="h-4 w-4 mr-1" />;
            default:
                return null;
        }
    };

    const formatDate = (date: Date) => {
        if (!date) return "N/A";
        return format(new Date(date), "dd MMMM yyyy", { locale: vi });
    };

    // Get the subscription name based on pricing ID
    const getSubscriptionName = (pricingId: number) => {
        const subscription = subscriptions.find(s => s.pricing_id === pricingId);
        return subscription?.pricing?.name || `Gói #${pricingId}`;
    };

    return (
        <Card className="w-full bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Gói học tập đã đăng ký
                </CardTitle>
                <CardDescription>
                    Danh sách các gói học tập bạn đã đăng ký và thời hạn sử dụng
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {subscriptions.map((subscription, index) => (
                        <div
                            key={`${subscription.pricing_id}-${index}`}
                            className="p-6 border rounded-xl bg-background/50 backdrop-blur-sm hover:shadow-md transition-all duration-300 ease-in-out"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                        <span>{subscription.pricing?.name || `Gói #${subscription.pricing_id}`}</span>
                                        {subscription.status === "active" && (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100">
                                                <CheckCircle2 className="h-3 w-3 mr-1" /> ACTIVE
                                            </Badge>
                                        )}
                                    </h3>

                                    {subscription.pricing?.description && (
                                        <div className="mb-4">
                                            <MarkdownRenderer
                                                content={subscription.pricing.description}
                                                className="text-sm !px-0 !py-0 !border-0 !shadow-none !rounded-none !bg-transparent"
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 flex-wrap mt-4">
                                        <Badge variant="outline" className={getStatusColor(subscription.status)}>
                                            <span className="flex items-center">
                                                {getStatusIcon(subscription.status)}
                                                {getStatusLabel(subscription.status)}
                                            </span>
                                        </Badge>

                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                                            <Calendar className="h-3.5 w-3.5 mr-1" />
                                            Hết hạn: {formatDate(subscription.expires_at)}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="text-right flex-shrink-0 bg-primary/5 p-4 rounded-lg border border-primary/10">
                                    <p className="text-xs text-muted-foreground mb-1">Giá gói</p>
                                    <p className="text-2xl font-bold text-primary">
                                        {subscription.pricing?.price
                                            ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subscription.pricing.price)
                                            : "N/A"}
                                    </p>

                                    {subscription.pricing?.sale && subscription.pricing.sale > 0 && (
                                        <p className="text-sm text-muted-foreground">
                                            Giảm: {subscription.pricing.sale}%
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 pt-5 border-t flex flex-wrap gap-3 justify-end">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="gap-2 bg-red-500/80 hover:bg-red-600"
                                    disabled={cancelling === subscription.pricing_id}
                                    onClick={() => handleConfirmCancel(subscription.pricing_id)}
                                >
                                    {cancelling === subscription.pricing_id ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Đang hủy...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-4 w-4" />
                                            Hủy đăng ký
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t p-6">
                <Button variant="outline" onClick={() => router.push("/pricing")} className="gap-2 hover:bg-primary/10">
                    <ExternalLink className="h-4 w-4" />
                    Xem thêm gói học tập
                </Button>
            </CardFooter>

            {/* Confirmation Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            Xác nhận hủy đăng ký
                        </DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn hủy đăng ký gói <span className="font-semibold">{selectedPricingId ? getSubscriptionName(selectedPricingId) : ''}</span>?
                            <br />
                            <br />
                            <span className="text-red-500">Hành động này không thể hoàn tác và bạn sẽ mất quyền truy cập vào nội dung của gói học tập này.</span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Hủy bỏ
                        </Button>
                        <Button
                            variant="destructive"
                            className="bg-red-500 hover:bg-red-600"
                            onClick={handleCancelSubscription}
                        >
                            Xác nhận hủy
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
} 