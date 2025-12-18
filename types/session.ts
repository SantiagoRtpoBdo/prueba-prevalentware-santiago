// Tipos extendidos para Better Auth con campos adicionales
export interface ExtendedUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  role?: string;
  phone?: string | null;
}

export interface ExtendedSession {
  user: ExtendedUser;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string;
    userAgent?: string;
  };
}
