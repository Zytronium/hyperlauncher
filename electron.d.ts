export {};

declare global {
    interface Window {
        electron: {
            launch: (payload: { cmd?: string; path?: string }) => void;
        };
    }
}
