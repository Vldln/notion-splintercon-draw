import axios from "axios";

const codaApiKey = process.env.VUE_APP_CODA_API_KEY;
const codaDocId = process.env.VUE_APP_CODA_DOC_ID;
const codaTableId = process.env.VUE_APP_CODA_TABLE_ID;

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

    await addDataToCoda({
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

const addDataToCoda = async (data) => {
  const response = await axios.post(
    `https://coda.io/apis/v1/docs/${codaDocId}/tables/${codaTableId}/rows`,
    {
      rows: [
        {
          cells: [
            {
              column: "Name", // replace with your actual column ID or name
              value: data.name,
            },
            {
              column: "Draw", // replace with your actual column ID or name
              value: data.draw,
            },
            {
              column: "Email", // replace with your actual column ID or name
              value: data.email,
            },
            {
              column: "Subscribe", // replace with your actual column ID or name
              value: data.subscribe,
            },
            {
              column: "Hatespeech", // replace with your actual column ID or name
              value: data.hatespeech,
            },
          ],
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${codaApiKey}`,
      },
    }
  );

  return response.data;
};

export const getCodaData = async () => {
  const response = await axios.get(
    `https://coda.io/apis/v1/docs/${codaDocId}/tables/${codaTableId}/rows`,
    {
      headers: {
        Authorization: `Bearer ${codaApiKey}`,
      },
    }
  );

  return response.data.items.map((item) => ({
    name: item.values.find((cell) => cell.column === "Name")?.value || "",
    imageUrl: item.values.find((cell) => cell.column === "Draw")?.value || "",
    email: item.values.find((cell) => cell.column === "Email")?.value || "",
    subscribe:
      item.values.find((cell) => cell.column === "Subscribe")?.value || false,
    hatespeech:
      item.values.find((cell) => cell.column === "Hatespeech")?.value || false,
  }));
};
