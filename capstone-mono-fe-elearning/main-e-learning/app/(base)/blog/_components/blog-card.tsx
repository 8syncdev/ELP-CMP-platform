import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { BlogDto } from "@/lib/actions/blog";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface BlogCardProps {
    blog: BlogDto;
}

export function BlogCard({ blog }: BlogCardProps) {
    const { metadata, slug } = blog;

    const formattedDate = formatDistanceToNow(new Date(metadata.publishedTime), {
        addSuffix: true,
        locale: vi
    });

    return (
        <Link href={`/blog/${slug}`}>
            <Card className="h-full overflow-hidden hover:shadow-md transition-all group">
                <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                        src={metadata.thumbnail || '/images/placeholder.jpg'}
                        alt={metadata.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {metadata.privilege === "registered" && (
                        <Badge className="absolute top-2 right-2 bg-primary/90">Premium</Badge>
                    )}
                </div>

                <CardHeader className="p-4 pb-2">
                    <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                        {metadata.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                        {metadata.description}
                    </CardDescription>
                </CardHeader>

                <CardFooter className="p-4 pt-0 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{metadata.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2 w-full">
                        {metadata.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[10px]">
                                {tag}
                            </Badge>
                        ))}
                        {metadata.tags.length > 3 && (
                            <Badge variant="outline" className="text-[10px]">
                                +{metadata.tags.length - 3}
                            </Badge>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
} 