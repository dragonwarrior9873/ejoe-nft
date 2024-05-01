import path from "path";
import fs from "fs";
export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const imageName = searchParams.get("imageName");
    console.log(imageName);
    const imagePath = path.join(
      process.cwd(),
      "src/app/api",
      "uploads",
      imageName
    );
    console.log(imagePath);
    const image = await fs.promises.readFile(imagePath);
    const headers = new Headers();
    headers.set("Content-Type", "image/jpeg");
    console.log(image);
    return new Response(image, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error(error);
    return new Response({ error: "Failed to fetch image" }, { status: 500 });
  }
};
