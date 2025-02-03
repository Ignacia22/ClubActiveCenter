import { config0 } from "./config.envs";

export const config = {
    authRequired: config0.authRequired,
    auth0Logout: config0.auth0Logout,
    secret: config0.secret,
    baseURL: config0.baseURL,
    clientID: config0.clientID,
    issuerBaseURL: config0.issuerBaseURL
};