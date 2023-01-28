#!/usr/bin/env node

/**
 * Module dependencies.
 */

import cookieParser from "cookie-parser";
import cors from "cors";
import debugLib from "debug";
import * as dotenv from "dotenv";
import express from "express";
import logger from "morgan";
import routes from "../controllers";
import { connectDB } from "../models";

const debug = debugLib("node-training-es6:server");
const http = require("http");

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5500", "http://localhost:8181"],
    credentials: true, // Enable cookie HTTP via CORS
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

routes.auth(app);
routes.users(app);

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.NODE_DOCKER_PORT || 8080);
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

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
  debug("Listening on " + bind);

  connectDB()
    .then(() => {
      console.log("Connected to the database!");
    })
    .catch((err) => {
      console.log("Cannot connect to the database!", err);
      process.exit();
    });
}
