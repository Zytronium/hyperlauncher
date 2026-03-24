export {};

declare global {
    interface Window {
        electron: {
            launch: (payload: { cmd?: string; path?: string }) => void;
            getApps: () => Promise<App[]>;
            closeWindow: () => void;
            hideWindow: () => void;
        };
    }
}
