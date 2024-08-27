import { promises as fs } from "fs";
import { join } from "path";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const base64Data = body.canvasImage.replace(/^data:image\/png;base64,/, "");
  const fileName = `image_${Date.now()}.png`;
  const filePath = join(process.cwd(), "public/uploads", fileName);

  try {
    await fs.writeFile(filePath, base64Data, "base64");
    return { message: "Image uploaded successfully", fileName };
  } catch (error) {
    return { message: "Failed to upload image", error };
  }
});
