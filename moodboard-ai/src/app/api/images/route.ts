import { NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';

export async function GET() {
  try {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
      return NextResponse.json({ error: "Azure config missing" }, { status: 500 });
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient("images-node");

    // Array para guardar as URLs
    const imageUrls = [];

    // Listar todos os blobs (ficheiros) dentro do container
    for await (const blob of containerClient.listBlobsFlat()) {
      // Construir o URL público da imagem
      // Formato: https://<nome-conta>.blob.core.windows.net/images/<nome-ficheiro>
      const url = `${containerClient.url}/${blob.name}`;
      imageUrls.push(url);
    }

    return NextResponse.json({ images: imageUrls });

  } catch (error) {
    console.error("Erro ao listar imagens:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}