'use client';

import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from 'next/navigation';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export function ChatExpire({ expireDate }: { expireDate: string }) {
    const router = useRouter();

    useEffect(() => {
        const checkExpiration = () => {
            const now = new Date();
            const end = new Date(expireDate);
            if (now >= end) {
                router.push('/expire'); // Chuyển về trang chủ khi hết hạn
            }
        };

        // Kiểm tra ngay khi component mount
        checkExpiration();

        // Kiểm tra mỗi giây
        const interval = setInterval(checkExpiration, 1000);
        return () => clearInterval(interval);
    }, [expireDate, router]);

    return (
        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-4 rounded-lg">
            <div className="mx-auto flex w-full items-center bg-white rounded-lg">
                <CountdownItem unit="Day" text="ngày" expireDate={expireDate} />
                <CountdownItem unit="Hour" text="giờ" expireDate={expireDate} />
                <CountdownItem unit="Minute" text="phút" expireDate={expireDate} />
                <CountdownItem unit="Second" text="giây" expireDate={expireDate} />
            </div>
        </div>
    );
}

const CountdownItem = ({ unit, text, expireDate }: {
    unit: "Day" | "Hour" | "Minute" | "Second",
    text: string,
    expireDate: string
}) => {
    const { ref, time } = useTimer(unit, expireDate);

    return (
        <div className="flex h-16 w-1/4 flex-col items-center justify-center gap-1 border-r-[1px] border-slate-200 font-mono last:border-r-0">
            <div className="relative w-full overflow-hidden text-center">
                <span
                    ref={ref}
                    className="block text-xl font-medium text-black"
                >
                    {time}
                </span>
            </div>
            <span className="text-xs font-light text-slate-500">
                {text}
            </span>
        </div>
    );
};

const useTimer = (unit: "Day" | "Hour" | "Minute" | "Second", expireDate: string) => {
    const [ref, animate] = useAnimate();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeRef = useRef(0);
    const [time, setTime] = useState(0);

    const calculateTime = useMemo(() => {
        return (distance: number) => {
            if (unit === "Day") return Math.floor(distance / DAY);
            if (unit === "Hour") return Math.floor((distance % DAY) / HOUR);
            if (unit === "Minute") return Math.floor((distance % HOUR) / MINUTE);
            return Math.floor((distance % MINUTE) / SECOND);
        };
    }, [unit]);

    useEffect(() => {
        const handleCountdown = async () => {
            const end = new Date(expireDate);
            const now = new Date();
            const distance = +end - +now;

            const newTime = calculateTime(distance);

            if (newTime !== timeRef.current) {
                await animate(
                    ref.current,
                    { y: ["0%", "-50%"], opacity: [1, 0] },
                    { duration: 0.35 }
                );

                timeRef.current = newTime;
                setTime(newTime);

                await animate(
                    ref.current,
                    { y: ["50%", "0%"], opacity: [0, 1] },
                    { duration: 0.35 }
                );
            }
        };

        intervalRef.current = setInterval(handleCountdown, 1000);
        return () => clearInterval(intervalRef.current || undefined);
    }, [animate, calculateTime, expireDate, ref]);

    return { ref, time };
};