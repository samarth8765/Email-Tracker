import {Hono} from "hono";
import { TemplateController } from "../controller";

export const TemplateRouter = new Hono();


TemplateRouter.get("/:id/get-single-template", TemplateController.GetSingleTemplate);

TemplateRouter.post("/create-new-template", TemplateController.CreateNewTemplate);