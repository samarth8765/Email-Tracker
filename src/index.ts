import { Hono } from "hono";
import { TemplateRouter } from "./api";
const PORT = 8080;
const app = new Hono();

app.route("/template", TemplateRouter);

export default { 
    port: PORT, 
    fetch: app.fetch, 
} 

console.log(`Listening on PORT ${PORT}`);