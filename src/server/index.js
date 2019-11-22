import "../env";
import express from "express";
import path from "path";
import next from "next";
import favicon from "serve-favicon";
import routes from "../routes";
import { getYearLogs } from "../lib/jsonManager";

const port = parseInt(process.env.PORT, 10) || 3002;

const nextApp = next({
  dir: path.dirname(__dirname),
  dev: process.env.NODE_ENV !== "production"
});

const handler = routes.getRequestHandler(nextApp);

nextApp.prepare().then(() => {
  const server = express();

  server.use(
    favicon(path.join(path.dirname(__dirname), "static", "favicon.ico"))
  );

  server.get("/changelogs", async (req, res) => {
    return res.send(getYearLogs());
  });

  server.get("*", handler);

  server.listen(port, err => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on http://localhost:${port}`);
  });
});
