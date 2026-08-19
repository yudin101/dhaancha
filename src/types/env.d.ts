declare namespace NodeJS {
  interface ProcessEnv {
    // Server Config
    FRONTEND_URL: string;
    SERVER_PORT: string;
    SERVER_URL: string;
    DATABASE_URL: string;
  }
}
