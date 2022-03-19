import express from "express";

import sharpResize from "./api/sharpResize";

const routes = express.Router();

routes.get("/", (req, res) => {
    res.send("API entry point - please POST on /api/resize");
});

// resizing image using Sharp
routes.use("/resize", sharpResize);

export default routes;
