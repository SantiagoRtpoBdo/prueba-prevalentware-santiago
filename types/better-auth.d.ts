// Extensión de tipos de Better Auth
declare module 'better-auth/react' {
  interface Session {
    user: {
      id: string;
      email: string;
      emailVerified: boolean;
      name: string;
      createdAt: Date;
      updatedAt: Date;
      image?: string | null;
      role?: string;
      phone?: string | null;
    };
  }
}

export {};
