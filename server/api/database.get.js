import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.VUE_APP_NOTION_API_KEY });
const image_database_id = process.env.VUE_APP_NOTION_DATABASE_ID;

async function getImages() {
  const data = await notion.databases.query({
    database_id: image_database_id,
  });
  return data.results;
}

export default defineEventHandler(async () => {
  try {
    const images = await getImages();
    return images;
  } catch (error) {
    console.error('Error fetching images from Notion:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch images from Notion',
    });
  }
});
