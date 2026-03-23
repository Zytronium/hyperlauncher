"use client";
import Image from "next/image";

type App = {
    "id": number;
    "name": string;
    "description": string | undefined;
    "image": string | undefined;
    "exec_path": string | undefined; // must exist if no exec_cmd
    "exec_cmd": string | undefined;  // must exist if no exec_path. Preferred over exec_cmd if both exist.
}

// placeholder apps array
const apps: App[] = [
    {
        "id": 0,
        "name": "Astroneer",
        "description": "A space game from Steam where you're an astronaut and an engineer stranded on an exoplanet.",
        "image": "/home/null/Pictures/Icons/astroneer.png",
        "exec_cmd": "steam steam://rungameid/361420",
        exec_path: undefined
    },
    {
        "id": 1,
        "name": "Coepylot",
        "description": "Michealsoft Coe-Pylot Artificial Unintelligence",
        "exec_cmd": "konsole -e copilot",
        image: undefined,
        exec_path: undefined
    },
    {
        "id": 2,
        "name": "Dolphin",
        "description": "A file manager for Linux",
        "exec_cmd": "dolphin",
        image: undefined,
        exec_path: undefined
    },
    {
        "id": 3,
        "name": "Starscape: Text Adventure",
        "exec_path": "/home/null/.local/share/starscape/app/starscape_text_adventure",
        description: undefined,
        image: undefined,
        exec_cmd: undefined
    },
    {
        "id": 4,
        "name": "Steam",
        "description": "A platform for managing and playing games",
        "exec_path": "/usr/bin/steam",
        image: undefined,
        exec_cmd: undefined
    },
    {
        "id": 5,
        "name": "Hyperlauncher",
        "image": "favicon.ico",
        "description": "This app",
        "exec_path": "/bin/hyperlauncher",
        exec_cmd: undefined
    }
];

function launchApp(app: App) {
    if (app.exec_cmd) {
        window.electron.launch({ cmd: app.exec_cmd });
    } else if (app.exec_path) {
        window.electron.launch({ path: app.exec_path });
    }
}

// TODO: Scan file system and locate apps
// TODO: Allow user to create folders and add custom apps
export default function Home() {
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
            <div className="flex flex-wrap gap-4 w-full content-start">
                {apps.map(app => (
                    <div
                        key={app.id}
                        className="aspect-square w-32 cursor-pointer"
                        onClick={() => launchApp(app)}
                    >
                        <div style={{ filter: 'drop-shadow(0 0 20px rgb(6 182 212 / 0.6))' }} className="w-full h-full">
                            <div
                                style={{
                                    clipPath: 'url(#squircle)',
                                    backgroundImage: app.image ? `url(${app.image})` : undefined,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                                className={`flex w-full h-full p-4 text-3xl ${app.image == undefined && 'bg-zinc-800'} items-center justify-center`}
                            >
                                {app.image == undefined && app.name[0]}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
