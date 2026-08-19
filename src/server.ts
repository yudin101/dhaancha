import app from "./app.js";
import env from "./config/env.config.js";
import { checkDatabaseConnection } from "./db/index.js";

const startServer = async () => {
  try {
    await checkDatabaseConnection();

    const PORT = env.SERVER_PORT || 3000;

    app.listen(PORT, "0.0.0.0", () => {
      // TODO: remove "0.0.0.0"
      console.log(`Listening on port: ${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
