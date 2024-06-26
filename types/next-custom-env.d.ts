declare namespace NodeJS {
  export interface ProcessEnv {
    NEXTAUTH_URL: string;

    NEXTAUTH_SECRET: string;

    GITHUB_ID: string;
    GITHUB_SECRET: string;

    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;

    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
    NEXT_PUBLIC_CLOUDINARY_PRESEST_NAME: string;
  }
}
