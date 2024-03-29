import { ID, storage } from "@/appwrite";
import { File } from "openai/_shims/index.mjs"

const uploadImage = async (file: File) => {
    if (!file) return;

    const fileUploaded = await storage.createFile(process.env.NEXT_PUBLIC_IMAGES_BUCKET_ID!, ID.unique(), file)

    return fileUploaded
}

export default uploadImage