import express from "express";
import routes from "./routes/index";

const app = express();
const port = 3000;

app.get("/", (req: express.Request, res: express.Response): void => {
    res.status(200).send("Server is Working Proberly");
});

// Main Application Entrypoint
app.use("/api", routes);

app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`);
});

// for testing
export default {
    app,
};
