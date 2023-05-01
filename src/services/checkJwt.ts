import { auth } from 'express-oauth2-jwt-bearer';

// initialize oath2 authentication
export const checkJwt = auth({
    audience: process.env.AUDIENCE,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    tokenSigningAlg: 'RS256'
});
