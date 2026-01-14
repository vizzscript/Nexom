import admin from "../config/firebaseAdmin";



// Initialize Firebase Admin
// Expects GOOGLE_APPLICATION_CREDENTIALS environment variable to be set
// pointing to the service account key file.
// OR
// You can set FIREBASE_SERVICE_ACCOUNT environment variable with the JSON content.

if (!admin.apps.length) {
    try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } else {
            admin.initializeApp({
                credential: admin.credential.applicationDefault()
            });
        }
        console.log('Firebase Admin Initialized');
    } catch (error) {
        console.error('Firebase Admin Initialization Error:', error);
    }
}

export const auth = admin.auth();
export default admin;
