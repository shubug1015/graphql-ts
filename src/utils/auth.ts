import * as jwt from 'jsonwebtoken';

export const APP_SECRET = '+VeB_u9v97Tf+P_k>]m[L}4+zCV5e5{;ZWFS)m*';

export interface AuthTokenPayload {
  userId: number;
}

export function decodeAuthHeader(authHeader: String): AuthTokenPayload {
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    throw new Error('No token found');
  }
  return jwt.verify(token, APP_SECRET) as AuthTokenPayload;
}
