"use client";

import { Loader2 } from "lucide-react";

export default function FullPageLoader({ message = "Loading..." }: { message?: string }) {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-purple-500" />
            <p className="text-lg font-medium text-white">{message}</p>
        </div>
    );
}
