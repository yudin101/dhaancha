declare namespace NodeJS {
  interface ProcessEnv {
    // Server Config
    FRONTEND_URL: string;
    SERVER_PORT: string;
    DATABASE_URL: string;
  }
}
