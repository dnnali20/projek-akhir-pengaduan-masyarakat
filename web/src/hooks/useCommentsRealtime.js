import { useEffect } from "react";
import socket from "../socket";

export default function useCommentsRealtime({ onCommentsUpdated } = {}) {
    useEffect(() => {
        if (!socket) return;

        const handler = () => {
            onCommentsUpdated?.();
        };

        socket.on("commentsUpdated", handler);

        return () => {
            socket.off("commentsUpdated", handler);
        };
    }, [onCommentsUpdated]);
}

