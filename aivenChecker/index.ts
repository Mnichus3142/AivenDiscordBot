import { config } from "dotenv";
config({ path: "../.env" });

import { payload } from "../types/payload";

(async () => {
    const port = process.env.PORT || 3000;

    const payload: payload = {
        application: "Aiven",
        type: "info",
        message: "This is a test message",
        timestamp: new Date().toISOString(),
    }

    try {
        await fetch(`http://localhost:${port}/health`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    catch (error) {
        console.error("Health check failed at: http://localhost:${port}/health at", new Date().toISOString());
        return;
    }

    const response = await fetch(`http://localhost:${port}/send`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: payload }),
    });

    const data = await response.text();
    console.log(data);
})();