// these are the backend server code and this file is the index
import express from "express";
import userRouter from "./src/controllers/users.controllers.js";
import authRouter from "./src/controllers/auth.controllers.js";
import imageRouter from "./src/controllers/image.controller.js";
import stripeRouter from "./src/controllers/stripe.controller.js";
import cors from "cors";
import morgan from "morgan";
import * as Sentry from "@sentry/node";

const app = express();

Sentry.init({
  dsn: "https://2e8f8e0563144a928e6d72aabccdc196@o4505447362068480.ingest.sentry.io/4505447365017600",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    // Automatically instrument Node.js libraries and frameworks
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(morgan("combined"));
app.use(express.json());
app.use(cors());

app.use("/create-checkout-session", stripeRouter);
app.use("/image", imageRouter); // verify users token before they can upload image
app.use("/users", userRouter);
app.use("/auth", authRouter);

app.use(Sentry.Handlers.errorHandler());

export default app;
