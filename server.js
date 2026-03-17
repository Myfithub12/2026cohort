import express from "express";

const app = express();
const port = 2025;

app.listen(port, () => {
    console.log('Server is running os http://localhost:${port}');
    console.log("Press Ctrl+C to end this process.");
});