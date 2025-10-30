import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Dynamically import sharp to handle platform-specific builds
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sharp: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  sharp = require('sharp');
} catch {
  console.warn('Sharp module not available, image optimization will be skipped');
}

// Initialize S3 client for AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'prautocustom-products';
const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL || 'https://d1jq7wgb95mzy3.cloudfront.net';

/**
 * Upload image to S3/R2 with optimization
 */
export async function uploadImage(
  file: Buffer,
  fileName: string,
  folder: string = 'products'
): Promise<string> {
  try {
    let imageBuffer = file;
    let contentType = 'image/jpeg';

    // Optimize image with sharp if available
    if (sharp) {
      try {
        imageBuffer = await sharp(file)
          .resize(1200, 1200, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: 85 })
          .toBuffer();
        contentType = 'image/webp';
      } catch (sharpError) {
        console.warn('Sharp optimization failed, uploading original image:', sharpError);
        imageBuffer = file;
      }
    } else {
      console.log('Sharp not available, uploading original image');
    }

    const fileExtension = contentType === 'image/webp' ? '.webp' : '.jpg';
    const key = `${folder}/${Date.now()}-${fileName.replace(/\.[^/.]+$/, '')}${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: imageBuffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000', // 1 year cache
    });

    await s3Client.send(command);

    // Return CloudFront URL if available, otherwise S3 URL
    if (CLOUDFRONT_URL) {
      return `${CLOUDFRONT_URL}/${key}`;
    }

    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Generate thumbnail from image
 */
export async function uploadThumbnail(
  file: Buffer,
  fileName: string,
  folder: string = 'products/thumbnails'
): Promise<string> {
  try {
    let thumbnailBuffer = file;
    let contentType = 'image/jpeg';

    // Generate thumbnail with sharp if available
    if (sharp) {
      try {
        thumbnailBuffer = await sharp(file)
          .resize(300, 300, {
            fit: 'cover',
          })
          .webp({ quality: 80 })
          .toBuffer();
        contentType = 'image/webp';
      } catch (sharpError) {
        console.warn('Sharp thumbnail generation failed, using original:', sharpError);
        thumbnailBuffer = file;
      }
    }

    const fileExtension = contentType === 'image/webp' ? '-thumb.webp' : '-thumb.jpg';
    const key = `${folder}/${Date.now()}-${fileName.replace(/\.[^/.]+$/, '')}${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: thumbnailBuffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000',
    });

    await s3Client.send(command);

    if (CLOUDFRONT_URL) {
      return `${CLOUDFRONT_URL}/${key}`;
    }

    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    throw new Error('Failed to upload thumbnail');
  }
}

/**
 * Delete image from S3/R2
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extract key from URL
    const url = new URL(imageUrl);
    const key = url.pathname.substring(1); // Remove leading slash

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
}

/**
 * Generate presigned URL for temporary access
 */
export async function getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate presigned URL');
  }
}

/**
 * Upload multiple images
 */
export async function uploadMultipleImages(
  files: Buffer[],
  fileNames: string[],
  folder: string = 'products'
): Promise<string[]> {
  const uploadPromises = files.map((file, index) =>
    uploadImage(file, fileNames[index], folder)
  );

  return Promise.all(uploadPromises);
}

