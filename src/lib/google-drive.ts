export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  webViewLink?: string;
  thumbnailLink?: string;
}

export interface DriveStorageInfo {
  limit: number;
  usage: number;
}

/**
 * Get Google Drive storage quota info.
 */
export const getGoogleDriveStorageInfo = async (accessToken: string): Promise<DriveStorageInfo> => {
  const res = await fetch("https://www.googleapis.com/drive/v3/about?fields=storageQuota", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error("Google Drive API Error (storageInfo):", res.status, errText);
    throw new Error("Failed to fetch storage info");
  }
  const data = JSON.parse(await res.text());
  
  return {
    limit: parseInt(data.storageQuota?.limit || "16106127360", 10),
    usage: parseInt(data.storageQuota?.usage || "0", 10)
  };
};

/**
 * Fetch files from Google Drive (only those created by this app due to drive.file scope)
 */
export const fetchGoogleDriveFiles = async (accessToken: string): Promise<GoogleDriveFile[]> => {
  const query = "trashed = false";
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,size,webViewLink,thumbnailLink)&pageSize=100`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch files");
  const data = await res.json();
  return data.files || [];
};

/**
 * Upload a file to Google Drive using multipart upload
 */
export const uploadToGoogleDrive = async (accessToken: string, file: File): Promise<GoogleDriveFile> => {
  const metadata = {
    name: file.name,
    mimeType: file.type,
  };
  
  const formData = new FormData();
  formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  formData.append("file", file);

  const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink,thumbnailLink", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });
  
  if (!res.ok) throw new Error("Failed to upload file");
  return await res.json();
};

/**
 * Delete a file from Google Drive
 */
export const deleteGoogleDriveFile = async (accessToken: string, fileId: string): Promise<void> => {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to delete file");
};
