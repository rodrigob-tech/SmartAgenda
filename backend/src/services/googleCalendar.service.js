import { google } from "googleapis";
import prisma from "../prisma/client.js";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

export function createOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

export function getGoogleAuthUrl(userId) {
  const oauth2Client = createOAuthClient();

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state: userId
  });
}

export async function exchangeCodeForTokens(code) {
  const oauth2Client = createOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export async function saveGoogleTokensToUser(userId, tokens) {
  const expiryDate = tokens.expiry_date
    ? new Date(tokens.expiry_date)
    : null;

  const existingUser = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!existingUser) {
    throw new Error("Usuário não encontrado para salvar tokens Google");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      googleAccessToken: tokens.access_token ?? existingUser.googleAccessToken,
      googleRefreshToken: tokens.refresh_token ?? existingUser.googleRefreshToken,
      googleTokenExpiry: expiryDate,
      googleConnected: true
    }
  });
}
export async function getOAuthClientForUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user || !user.googleConnected) {
    throw new Error("Usuário não conectado ao Google Calendar");
  }

  const oauth2Client = createOAuthClient();

  oauth2Client.setCredentials({
    access_token: user.googleAccessToken || undefined,
    refresh_token: user.googleRefreshToken || undefined,
    expiry_date: user.googleTokenExpiry
      ? new Date(user.googleTokenExpiry).getTime()
      : undefined
  });

  return oauth2Client;
}