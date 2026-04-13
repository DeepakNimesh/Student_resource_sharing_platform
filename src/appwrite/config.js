import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client();

// Replace with your actual Appwrite Project ID and Endpoint
client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) 
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const APPWRITE_CONFIG = {
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID ,
    collectionId: import.meta.env.VITE_APPWRITE_COLLECTION_ID ,
    bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID
};

export default client;
