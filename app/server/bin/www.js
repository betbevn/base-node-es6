#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from "../app";
import debugLib from "debug";
const debug = debugLib("node-training-es6:server");
const https = require("https");
const session = require("express-session");
const passport = require("passport");
const saml = require("passport-saml");
const fs = require("fs");

/** SAML Configurations attributes
 * callbackurl : apps url for IDP to response post authetication
 * signout: apps url for IDP to notify app post signout
 * entrypoint: IDP url to redirect for authentication
 * entityId : Apps Id
 */
const samlConfig = {
  issuer: "c2-sso",
  entityId: "Saml-SSO-App",
  callbackUrl: "https://localhost:6868/api/auth/login/callback",
  signOut: "https://localhost:6868/api/auth/signout/callback",
  entryPoint: "https://localhost:8843/realms/c2-applications/protocol/saml",
};

// For running apps on https mode
// load the public certificate
const sp_pub_cert = fs.readFileSync(
  "../app/server/certs/sp-pub.cert.pem",
  "utf8"
);

//load the private key
const sp_pvk_key = fs.readFileSync(
  "../app/server/certs/sp-pvt.key.pem",
  "utf8"
);

//Idp's certificate from metadata
const idp_cert = fs.readFileSync("../app/server/certs/idp-pub.key.pem", "utf8");

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
    privateCert: fs.readFileSync("../app/server/certs/sp-pvt.key.pem", "utf8"),
    validateInResponseTo: true,
    disableRequestedAuthnContext: true,
  },
  (profile, done) => {
    console.log("passport.use() profile: %s \n", JSON.stringify(profile));
    return done(null, profile);
  }
);

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
