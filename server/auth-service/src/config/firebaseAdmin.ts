import admin from "firebase-admin";
import serviceAccount from "../config/firebase-service-account.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    projectId: serviceAccount.project_id, // 🔥 IMPORTANT
  });
}

export default admin;
