const { google } = require("googleapis");
const config = require("./config");

function parseServiceAccount(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    try {
      const decoded = Buffer.from(raw, "base64").toString("utf-8");
      return JSON.parse(decoded);
    } catch (err) {
      return null;
    }
  }
}

async function getSheetsClient() {
  const credentials = parseServiceAccount(config.serviceAccountJson);
  if (!credentials) {
    throw new Error("Service account credentials are missing or invalid.");
  }
  const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
  await auth.authorize();
  return google.sheets({ version: "v4", auth });
}

async function getAllRows() {
  if (!config.sheetId) {
    throw new Error("Spreadsheet ID is missing.");
  }
  const sheets = await getSheetsClient();
  const range = `${config.sheetName}!A:D`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.sheetId,
    range,
  });
  return response.data.values || [];
}

async function findUserByPhone(phone) {
  const rows = await getAllRows();
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const storedPhone = (row[0] || "").trim();
    if (storedPhone === phone) {
      return {
        exists: true,
        user: {
          phone: storedPhone,
          city: (row[1] || "").trim(),
          firstName: (row[2] || "").trim(),
          lastName: (row[3] || "").trim(),
        },
      };
    }
  }
  return { exists: false, user: null };
}

async function appendUser({ phone, city, firstName, lastName }) {
  if (!config.sheetId) {
    throw new Error("Spreadsheet ID is missing.");
  }
  const sheets = await getSheetsClient();
  const range = `${config.sheetName}!A:D`;
  await sheets.spreadsheets.values.append({
    spreadsheetId: config.sheetId,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values: [[phone, city, firstName, lastName]],
    },
  });
}

module.exports = {
  findUserByPhone,
  appendUser,
};
