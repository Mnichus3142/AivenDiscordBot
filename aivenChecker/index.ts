import { config } from "dotenv";
config({ path: "../.env" });

import { payload } from "../types/payload";

import postgres from "postgres";

let state = true;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not defined in environment variables");
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL);

setInterval(async () => {
  try {
    const test = await sql`SELECT 1`;
    console.log("Database connection successful:", test);

    if (!state) {
      const port = process.env.PORT || 3000;

      const payload: payload = {
        application: "Aiven",
        type: "Info",
        message: "Database connection successful",
        timestamp: new Date().toISOString(),
      };

      try {
        await fetch(`http://localhost:${port}/health`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error(
          "Health check failed at: http://localhost:${port}/health at",
          new Date().toISOString()
        );
        return;
      }

      const response = await fetch(`http://localhost:${port}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: payload }),
      });

      state = true;
    }
  } catch (error) {
    if (state) {
      const port = process.env.PORT || 3000;

      const payload: payload = {
        application: "Aiven",
        type: "Error",
        message: "Database connection failed",
        timestamp: new Date().toISOString(),
      };

      try {
        await fetch(`http://localhost:${port}/health`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error(
          "Health check failed at: http://localhost:${port}/health at",
          new Date().toISOString()
        );
        return;
      }

      const response = await fetch(`http://localhost:${port}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: payload }),
      });
    }
  }
}, 60000);
