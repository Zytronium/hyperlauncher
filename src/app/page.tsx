"use client";
import { useEffect, useState } from "react";

type App = {
    "id": number;
    "name": string;
    "description": string | undefined;
    "image": string | undefined;
    "exec_path": string | undefined; // must exist if no exec_cmd
    "exec_cmd": string | undefined;  // must exist if no exec_path. Preferred over exec_cmd if both exist.
}

function launchApp(app: App) {
    if (app.exec_cmd) {
        window.electron.launch({ cmd: app.exec_cmd });
    } else if (app.exec_path) {
        window.electron.launch({ path: app.exec_path });
    }
    window.electron.hideWindow();
}

// TODO: Allow user to create folders
// TODO: Allow user to add custom apps
// TODO: Allow user to edit app icons
// TODO: Show widget for app meta info somehow (i.e. on hover, right click, or other method)

export default function Home() {
    const [apps, setApps] = useState<App[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.electron.getApps().then((result: App[]) => {
            setApps(result);
            setLoading(false);
        });
    }, []);

    return (
        <main className="flex flex-1 flex-col w-full items-center justify-between py-8 px-4">
            <svg width="0" height="0" className="absolute">
                <defs>
                    <clipPath id="squircle" clipPathUnits="objectBoundingBox">
                        <path d="M0.5,0 C0.9,0 1,0.1 1,0.5 C1,0.9 0.9,1 0.5,1 C0.1,1 0,0.9 0,0.5 C0,0.1 0.1,0 0.5,0 Z"/>
                    </clipPath>
                </defs>
            </svg>

            {/* Apps Grid */}
            {loading ? (
                <div className="text-zinc-400 text-lg mt-16">Scanning apps...</div>
            ) : (
                <div className="flex flex-wrap gap-4 w-full content-start">
                    {apps.map(app => (
                        <div
                            key={app.id}
                            className="aspect-square w-32 cursor-pointer"
                            onClick={() => launchApp(app)}
                        >
                            <div style={{ filter: 'drop-shadow(0 0 20px rgb(6 182 212 / 0.6))' }}
                                 className="w-full h-full"
                                 title={app.name}
                            >
                                <div
                                    style={{
                                        clipPath: !app.image ? 'url(#squircle)' : undefined,
                                        backgroundImage: app.image ? `url(file://${app.image})` : undefined,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                    className={`flex w-full h-full p-4 text-3xl ${!app.image && 'bg-zinc-800'} items-center justify-center hover:scale-110 transition-all`}
                                >
                                    {!app.image && app.name[0]}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
