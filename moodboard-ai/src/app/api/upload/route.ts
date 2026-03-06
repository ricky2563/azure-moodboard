import { NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. Conectar ao Azure
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) return NextResponse.json({ error: "Azure config missing" }, { status: 500 });

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient("images-node");

    // 2. Preparar o ficheiro (converter para Buffer)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Gerar nome único e fazer upload
    const uniqueName = `${uuidv4()}-${file.name}`;
    const blockBlobClient = containerClient.getBlockBlobClient(uniqueName);

    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: file.type }
    });

    // 4. Retornar a URL da imagem
    return NextResponse.json({ url: blockBlobClient.url });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}