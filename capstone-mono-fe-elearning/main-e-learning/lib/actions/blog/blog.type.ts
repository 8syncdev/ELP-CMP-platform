import { DataResponse, Paginated, Min, MinLen, MaxLen } from '../base.dto';

export interface BlogDto {
    id: number & (Min<1>);
    slug: string & (MinLen<1> & MaxLen<100>);
    content: string & (MinLen<1>);
    metadata: {
        title: string;
        description: string;
        author: string;
        publishedTime: Date;
        updatedTime: Date;
        tags: string[];
        privilege: "free" | "registered";
        isPublished: boolean;
        imageAuthor: string;
        thumbnail: string;
    };
}

export interface CreateBlogDto extends Omit<BlogDto, "id"> { }

export interface UpdateBlogDto extends Partial<BlogDto> { }

export interface BlogResponse extends Omit<DataResponse, "result"> {
    result?: BlogDto[] | BlogDto;
    pagination?: Paginated;
}
