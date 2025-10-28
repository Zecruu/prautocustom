import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';

// Initialize S3 client for AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || '';
const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL || ''; // Your CloudFront distribution URL

/**
 * Upload image to S3/R2 with optimization
 */
export async function uploadImage(
  file: Buffer,
  fileName: string,
  folder: string = 'products'
): Promise<string> {
  try {
    // Optimize image with sharp
    const optimizedImage = await sharp(file)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();

    const key = `${folder}/${Date.now()}-${fileName.replace(/\.[^/.]+$/, '')}.webp`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: optimizedImage,
      ContentType: 'image/webp',
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
    const thumbnail = await sharp(file)
      .resize(300, 300, {
        fit: 'cover',
      })
      .webp({ quality: 80 })
      .toBuffer();

    const key = `${folder}/${Date.now()}-${fileName.replace(/\.[^/.]+$/, '')}-thumb.webp`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: thumbnail,
      ContentType: 'image/webp',
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

