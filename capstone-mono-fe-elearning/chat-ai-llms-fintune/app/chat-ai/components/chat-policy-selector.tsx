'use client';

import { useChat } from '../contexts/chat-context';
import { CHAT_POLICIES } from '../constants/policies';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function ChatPolicySelector() {
    const { policy, setPolicy } = useChat();

    return (
        <Select value={policy} onValueChange={setPolicy}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn gói dịch vụ" />
            </SelectTrigger>
            <SelectContent>
                {Object.entries(CHAT_POLICIES).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                        {value.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
} 