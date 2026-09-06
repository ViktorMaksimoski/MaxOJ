import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "../../");
const serviceAccountPath = path.join(backendRoot, "serviceAccountKey.json");

let firebaseConfig;

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccountRaw = fs.readFileSync(serviceAccountPath, "utf-8");
  const serviceAccount = JSON.parse(serviceAccountRaw);

  firebaseConfig = {
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
  };
} else {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey,
  };
}

const hasServiceAccount =
  firebaseConfig.projectId &&
  firebaseConfig.clientEmail &&
  firebaseConfig.privateKey;

if (!hasServiceAccount) {
  throw new Error(
    "Missing Firebase Admin credentials. Add backend/serviceAccountKey.json or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
  );
}

const app =
  getApps()[0] ??
  initializeApp({
    credential: cert(firebaseConfig),
  });

export const db = getFirestore(app);
export const auth = getAuth(app);
