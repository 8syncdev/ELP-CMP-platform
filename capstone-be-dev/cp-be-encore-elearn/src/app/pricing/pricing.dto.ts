import { DataResponse, Paginated } from "../../utils";
import {
    MinLen,
    MaxLen,
    Min,
} from "encore.dev/validate"

export interface PricingDto {
    id: number & (Min<1>);
    name: string & (MinLen<1>) & (MaxLen<255>);
    description: string & (MinLen<1>);
    price: number & (Min<0>);
    created_at: Date;
    updated_at: Date;
    type_payment: string & (MinLen<1>) & (MaxLen<255>);
    sale: number & (Min<0>);
}

export interface CreatePricingDto extends Omit<PricingDto, "id" | "created_at" | "updated_at"> { }

export interface UpdatePricingDto extends Partial<PricingDto> { }

export interface PricingResponse extends Omit<DataResponse, "result"> {
    result?: PricingDto[] | PricingDto;
    pagination?: Paginated;
}

export interface PricingUserDto {
    pricing_id: number & (Min<1>);
    user_id: number & (Min<1>);
    expires_at: Date;
    status: string & (MinLen<1>) & (MaxLen<255>) | "active" | "inactive" | "expired" | "pending";
    created_at: Date;
    updated_at: Date;
}

export interface CreatePricingUserDto extends Omit<PricingUserDto, "created_at" | "updated_at" | "expires_at" | "status" | "user_id"> { }

export interface UpdatePricingUserDto extends Partial<PricingUserDto> { }

export interface PricingUserResponse extends Omit<DataResponse, "result"> {
    result?: PricingUserDto[] | PricingUserDto;
    pagination?: Paginated;
}

export interface CheckPricingUserResponse extends Omit<DataResponse, "result"> {
    result?: boolean;
}
