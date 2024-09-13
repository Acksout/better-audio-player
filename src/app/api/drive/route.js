import { google } from "googleapis";
import { NextResponse } from "next/server";

async function listFilesAndFolders(drive, folderId) {
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "files(id, name, mimeType, size, modifiedTime)",
      pageSize: 1000,
    });

    const items = await Promise.all(
      response.data.files.map(async (file) => {
        const isFolder = file.mimeType === "application/vnd.google-apps.folder";
        const item = {
          id: file.id,
          fileName: file.name,
          fileType: isFolder
            ? "Folder"
            : file.name.split(".").pop() || "Unknown",
          fileSize: formatFileSize(parseInt(file.size) || 0),
          modifiedDate: new Date(file.modifiedTime).toLocaleString(),
          src: isFolder ? null : `/api/audio/${file.id}`,
        };

        if (isFolder) {
          item.children = await listFilesAndFolders(drive, file.id);
        }

        return item;
      })
    );

    return items;
  } catch (error) {
    console.error("Error listing files and folders:", error);
    throw error;
  }
}

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    const drive = google.drive({ version: "v3", auth });

    const filesDetails = await listFilesAndFolders(
      drive,
      process.env.GOOGLE_DRIVE_DIRECTORY_ID
    );

    return NextResponse.json(filesDetails);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Error fetching directory contents" },
      { status: 500 }
    );
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
