declare namespace NodeJS {
  interface ProcessEnv {
    OPENAI_KEY: string
    API_URL: string
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}
