import { MY_INFO } from "@/constants";
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FooterContact() {
    return (
        <div className="space-y-4">
            <h4 className="font-semibold">Liên hệ</h4>
            <div className="space-y-2">
                <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-2"
                    asChild
                >
                    <a href={`mailto:${MY_INFO.email}`}>
                        <Mail className="h-4 w-4" />
                        {MY_INFO.email}
                    </a>
                </Button>
                <Button 
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    asChild
                >
                    <a href={`tel:${MY_INFO.contact}`}>
                        <Phone className="h-4 w-4" />
                        {MY_INFO.contact}
                    </a>
                </Button>
            </div>
        </div>
    );
} 