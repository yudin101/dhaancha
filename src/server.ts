import app from "./app.js";
import env from "./config/env.config.js";
import { checkDatabaseConnection } from "./db/index.js";

const startServer = async () => {
  try {
    await checkDatabaseConnection();

    const DEFAULT_PORT = 3000;
    const PORT = env.SERVER_PORT || DEFAULT_PORT;

    app.listen(PORT, "0.0.0.0", () => {
      // TODO: remove "0.0.0.0"
      console.log(`Listening on port: ${PORT}`);
    });
  } catch (err) {
    console.error(err);
    // oxlint-disable-next-line unicorn/no-process-exit -- fail fast if server can't start
    process.exit(1);
  }
};

startServer();
