import axios from "axios";

const codaApiKey = process.env.VUE_APP_CODA_API_KEY;
const codaDocId = process.env.VUE_APP_CODA_DOC_ID;
const codaTableId = process.env.VUE_APP_CODA_TABLE_ID;

async function getData() {
  const response = await axios.get(
    `https://coda.io/apis/v1/docs/${codaDocId}/tables/${codaTableId}/rows?valueFormat=rich`,
    {
      headers: {
        Authorization: `Bearer ${codaApiKey}`,
      },
    }
  );
  return response.data.items;
}

export default defineEventHandler(async () => {
  try {
    const data = await getData();
    return data;
  } catch (error) {
    console.error("Error fetching data from Coda:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch data from Coda",
    });
  }
});
