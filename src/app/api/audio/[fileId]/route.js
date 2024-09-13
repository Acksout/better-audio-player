import { google } from "googleapis";
import { NextResponse } from "next/server";

async function refreshAccessToken() {
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

    const client = await auth.getClient();
    const { credentials } = await client.refreshAccessToken();
    return credentials;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw new Error("Failed to refresh access token");
  }
}

export async function GET(request, { params }) {
  try {
    const credentials = await refreshAccessToken();
    const auth = new google.auth.OAuth2();
    auth.setCredentials(credentials);

    const drive = google.drive({ version: "v3", auth });

    const response = await drive.files.get(
      {
        fileId: params.fileId,
        alt: "media",
      },
      { responseType: "stream" }
    );

    const headers = new Headers({
      "Content-Type": response.headers["content-type"],
      "Content-Length": response.headers["content-length"],
      "Content-Disposition": `inline; filename="${response.headers["content-disposition"]}"`,
    });

    return new NextResponse(response.data, { headers });
  } catch (error) {
    console.error("Error streaming audio file:", error);
    return NextResponse.json(
      { error: "Error streaming audio file" },
      { status: 500 }
    );
  }
}
