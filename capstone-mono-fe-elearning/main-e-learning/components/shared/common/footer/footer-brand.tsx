import { MY_INFO } from "@/constants";
import Image from "next/image";
import { Building2, GraduationCap } from "lucide-react";

export function FooterBrand() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Image 
                    src={MY_INFO.logo} 
                    alt={MY_INFO.company}
                    width={40}
                    height={40}
                    className="rounded-lg"
                />
                <div>
                    <h3 className="font-bold">{MY_INFO.company}</h3>
                    <p className="text-sm text-muted-foreground">{MY_INFO.major}</p>
                </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{MY_INFO.name}</span>
                </div>
                <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>{MY_INFO.description}</span>
                </div>
            </div>
        </div>
    );
} 