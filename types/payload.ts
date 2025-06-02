type payload = {
    application: string;
    type: "info" | "error";
    message: string;
    timestamp: string;
}

export type { payload };