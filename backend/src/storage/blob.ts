import { BlobServiceClient } from '@azure/storage-blob';

let cachedClient: BlobServiceClient | null = null;

export function getBlobServiceClient(): BlobServiceClient | null {
  if (cachedClient) return cachedClient;

  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const account = process.env.AZURE_STORAGE_ACCOUNT;
  const key = process.env.AZURE_STORAGE_KEY;

  if (connStr && connStr.trim()) {
    try {
      cachedClient = BlobServiceClient.fromConnectionString(connStr.trim());
      return cachedClient;
    } catch (err) {
      console.warn('[AzureBlob] Failed to initialize from connection string:', err);
      return null;
    }
  }

  if (account && key && account.trim() && key.trim()) {
    try {
      const builtConn = `DefaultEndpointsProtocol=https;AccountName=${account.trim()};AccountKey=${key.trim()};EndpointSuffix=core.windows.net`;
      cachedClient = BlobServiceClient.fromConnectionString(builtConn);
      return cachedClient;
    } catch (err) {
      console.warn('[AzureBlob] Failed to initialize from account + key:', err);
      return null;
    }
  }

  return null;
}

export function isBlobStorageConfigured(): boolean {
  return getBlobServiceClient() !== null;
}

export const DEFAULT_CONTAINER = process.env.AZURE_STORAGE_CONTAINER || 'resumes';

export async function uploadFile(
  containerName: string = DEFAULT_CONTAINER,
  fileName: string,
  data: Buffer | string,
  contentType?: string
): Promise<string> {
  const client = getBlobServiceClient();
  if (!client) {
    throw new Error('Azure Blob Storage is not configured. Please set AZURE_STORAGE_CONNECTION_STRING or AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_KEY.');
  }

  const containerClient = client.getContainerClient(containerName);
  await containerClient.createIfNotExists({ access: 'blob' });

  const blockClient = containerClient.getBlockBlobClient(fileName);
  const bufferData = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf-8');

  await blockClient.uploadData(bufferData, {
    blobHTTPHeaders: {
      blobContentType: contentType || 'application/pdf',
    },
  });

  return blockClient.url;
}

export async function downloadFile(
  containerName: string = DEFAULT_CONTAINER,
  fileName: string
): Promise<Buffer> {
  const client = getBlobServiceClient();
  if (!client) {
    throw new Error('Azure Blob Storage is not configured.');
  }

  const containerClient = client.getContainerClient(containerName);
  const blockClient = containerClient.getBlockBlobClient(fileName);
  return await blockClient.downloadToBuffer();
}

export async function deleteFile(
  containerName: string = DEFAULT_CONTAINER,
  fileName: string
): Promise<void> {
  const client = getBlobServiceClient();
  if (!client) return;

  const containerClient = client.getContainerClient(containerName);
  const blockClient = containerClient.getBlockBlobClient(fileName);
  await blockClient.deleteIfExists();
}
