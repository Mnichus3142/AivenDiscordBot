type payload = {
    application: string;
    type: "Info" | "Error";
    message: string;
    timestamp: string;
}

export type { payload };