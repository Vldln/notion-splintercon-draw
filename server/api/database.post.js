import { Client } from "@notionhq/client";
const notion = new Client({ auth: process.env.VUE_APP_NOTION_API_KEY });

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, email, draw, subscribe, hatespeech } = body;

    if (!name || !email || !draw || hatespeech === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid data provided",
      });
    }

    await addDataToNotion({
      name,
      email,
      draw,
      subscribe,
      hatespeech,
    });

    return { success: true };
  } catch (error) {
    console.error("Error in API handler:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});

const addDataToNotion = async (data) => {
  const response = await notion.pages.create({
    parent: { database_id: process.env.VUE_APP_NOTION_DATABASE_ID },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: data.name,
            },
          },
        ],
      },
      Email: {
        email: data.email,
      },
      Draw: {
        files: [
          {
            name: `Draw_${Date.now()}.png`, // имя файла
            external: {
              url: data.draw,
            },
          },
        ],
      },
      Subscribe: {
        checkbox: data.subscribe,
      },
      Hatespeech: {
        checkbox: data.hatespeech,
      },
      Select: {
        select: {
          name: "Pending",
        },
      },
    },
  });

  return response;
};

export const getNotionData = async () => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  return response.results.map((page) => ({
    name: page.properties.Name.title[0]?.text?.content,
    imageUrl: page.properties.Draw.files[0]?.external?.url || "",
    email: page.properties.Email.email,
    subscribe: page.properties.Subscribe.checkbox,
    hatespeech: page.properties.Hatespeech.checkbox,
  }));
};
