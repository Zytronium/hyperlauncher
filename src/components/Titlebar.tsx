"use client";
import Image from "next/image";
import { CircleX } from "lucide-react";

export default function TitleBar() {
    const handleClose = () => {
        // Use Electron IPC if available, else fall back to window.close()
        if (typeof window !== 'undefined' && (window as any).electron) {
            (window as any).electron.closeWindow();
        } else {
            window.close();
        }
    };

    return (
        <div className="flex items-center justify-between w-full px-4 py-2 bg-slate-950 border-b border-slate-900">
            <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="Hyperlauncher" width={24} height={24} />
                <span style={{ fontFamily: 'Apex' }} className="text-white text-sm font-bold tracking-widest">
                    HYPERLAUNCHER
                </span>
            </div>
            <button
                onClick={handleClose}
                className="text-slate-500 rounded-full hover:text-slate-300 hover:bg-red-700 transition-colors duration-150 w-6 h-6 flex items-center justify-center text-lg"
            >
                <CircleX />
            </button>
        </div>
    );
}
