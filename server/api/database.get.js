import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.VUE_APP_NOTION_API_KEY });
const image_database_id = process.env.VUE_APP_NOTION_DATABASE_ID;

async function getData() {
  const data = await notion.databases.query({
    database_id: image_database_id,
  });
  return data.results;
}

export default defineEventHandler(async () => {
  try {
    const data = await getData();
    return data;
  } catch (error) {
    console.error("Error fetching data from Notion:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch data from Notion",
    });
  }
});
