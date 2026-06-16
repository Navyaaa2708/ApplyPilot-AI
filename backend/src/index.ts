import dotenv from "dotenv";
import { app } from "./app.js";
import { initializeTelemetry } from "./utils/telemetry.js";

dotenv.config();

const port = Number(process.env.PORT || 4000);

initializeTelemetry().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Telemetry initialization failed", error);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`ApplyPilot backend listening on port ${port}`);
});
