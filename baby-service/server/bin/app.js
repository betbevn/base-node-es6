#!/usr/bin/env node

/**
 * Module dependencies.
 */

import routes from "../controllers";
import debugLib from "debug";
import logger from "morgan";
import cookieParser from "cookie-parser";
import express from "express";
import https from "https";
import session from "express-session";
import passport from "passport";
import fs from "fs";
import * as dotenv from "dotenv";

const saml = require("@node-saml/passport-saml");
const debug = debugLib("node-training-es6:server");

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();

/** SAML Configurations attributes
 * callbackurl : apps url for IDP to response post authetication
 * signout: apps url for IDP to notify app post signout
 * entrypoint: IDP url to redirect for authentication
 * entityId : Apps Id
 */
const samlConfig = {
  issuer: "c2-sso",
  entityId: "https://localhost:8843/realms/c2-applications",
  callbackUrl: "https://localhost:5858/api/baby/callback",
  signOut: "https://localhost:5858/api/baby/signout/callback",
  entryPoint: "https://localhost:8843/realms/c2-applications/protocol/saml",
};

// For running apps on https mode
// load the public certificate

const idpPubKey = "../app/server/certs/idp-pub.key.pem";
const spPubCert = "../app/server/certs/sp-pub-cert.pem";
const spPvtKey = "../app/server/certs/sp-pvt-key.pem";

const sp_pub_cert = fs.readFileSync(spPubCert, "utf8");

//load the private key
const sp_pvk_key = fs.readFileSync(spPvtKey, "utf8");

//Idp's certificate from metadata
const idp_cert = fs.readFileSync(idpPubKey, "utf8");

passport.serializeUser(function (user, done) {
  //Serialize user, console.log if needed
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  //Deserialize user, console.log if needed
  done(null, user);
});

// configure SAML strategy for SSO
const samlStrategy = new saml.Strategy(
  {
    callbackUrl: samlConfig.callbackUrl,
    entryPoint: samlConfig.entryPoint,
    issuer: samlConfig.issuer,
    identifierFormat: null,
    decryptionPvk: sp_pvk_key,
    cert: [idp_cert, idp_cert],
    privateCert: fs.readFileSync(spPvtKey, "utf8"),
    validateInResponseTo: true,
    disableRequestedAuthnContext: true,
  },
  (profile, done) => {
    console.log("passport.use() profile: %s \n", JSON.stringify(profile));
    return done(null, profile);
  }
);
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// configure session management
// Note: Always configure session before passport initialization & passport session, else error will be encounter
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

passport.use("samlStrategy", samlStrategy);
app.use(passport.initialize({}));
app.use(passport.session({}));

routes.baby(app);

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.NODE_DOCKER_PORT || 8080);
app.set("port", port);

/**
 * Create HTTPS server.
 */

const server = https.createServer(
  {
    key: sp_pvk_key,
    cert: sp_pub_cert,
  },
  app
);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;

  console.log("Listening on " + bind);

  debug("Listening on " + bind);
}
