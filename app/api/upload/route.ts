import { NextResponse } from "next/server";
import formidable from "formidable";
import path from "path";
import fs from "fs";

// Disable Next.js body parsing for file upload
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Ensure uploads directory exists
    fs.mkdirSync(uploadDir, { recursive: true });

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filename: (name, ext, part) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        return `${part.originalFilename?.split(".")[0]}-${uniqueSuffix}${ext}`;
      },
    });

    const data: any = await new Promise((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const fileArray = Object.values(data.files).flat();
    const filePaths = fileArray.map((file: any) =>
      `/uploads/${path.basename(file.filepath)}`
    );

    return NextResponse.json({ urls: filePaths }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
