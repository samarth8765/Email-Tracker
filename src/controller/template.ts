import type { Context } from "hono"

const GetSingleTemplate = (c: Context) => {
    const id = c.req.param("id");
    return c.json({Hello: "id"});
}


const CreateNewTemplate = (c: Context) => {
    return c.json({Hello: "World"});
}

export const TemplateController = {
    GetSingleTemplate,
    CreateNewTemplate
}