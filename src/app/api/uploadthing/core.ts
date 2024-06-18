import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import sharp from "sharp";
import { db } from "@/db";
const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .input(
      z.object({
        configId: z.string().optional(),
      })
    )
    .middleware(async ({ input }) => {
      // This code runs on your server before upload
      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { configId } = metadata.input;
      // need it in step 2
      // trying to get the images width and height using sharp
      const res = await fetch(file.url);
      const buffer = await res.arrayBuffer();
      const imgMetaData = await sharp(buffer).metadata();
      const { width, height } = imgMetaData;
      if (!configId) {
        const configuration = await db.configuration.create({
          data: {
            imageUrl: file.url,
            height: height || 500,
            width: width || 500,
          },
        });

        return { configId: configuration.id };
      } else {
        // already in step 2 now
        const updatedConfig = await db.configuration.update({
          where: {
            id: configId,
          },
          data: {
            croppedImageUrl: file.url,
          },
        });
        return { configId: updatedConfig.id };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
