import { useEffect } from "react";
import socket from "../socket";

export default function useLaporanRealtime({ onLaporkanUpdated }) {
    useEffect(() => {
        if (!socket) return;

        const handler = () => {
            onLaporkanUpdated?.();
        };

        socket.on("laporanUpdated", handler);

        return () => {
            socket.off("laporanUpdated", handler);
        };
    }, [onLaporkanUpdated]);
}

