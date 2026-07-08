/**
 * Google Drive Frontend-Only Wrapper
 * For production, this should be handled in the backend (Laravel) with proper server-to-server OAuth.
 * Since we are doing a frontend-only implementation, we will mock the connection flow
 * and store the mock state in localStorage.
 */

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  iconLink: string;
  thumbnailLink?: string;
  size?: string;
}

// Mock function to simulate OAuth popup and connection
export const connectGoogleDrive = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate OAuth delay
    setTimeout(() => {
      localStorage.setItem("gdrive_connected", "true");
      localStorage.setItem("gdrive_email", "lead@teamvora.web.id");
      resolve(true);
    }, 1500);
  });
};

export const disconnectGoogleDrive = () => {
  localStorage.removeItem("gdrive_connected");
  localStorage.removeItem("gdrive_email");
};

export const isGoogleDriveConnected = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("gdrive_connected") === "true";
};

export const getConnectedEmail = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("gdrive_email");
};

// Mock fetch files from Drive
export const fetchDriveFiles = async (): Promise<GoogleDriveFile[]> => {
  if (!isGoogleDriveConnected()) throw new Error("Google Drive not connected");
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          name: "Q3_Marketing_Report.pdf",
          mimeType: "application/pdf",
          webViewLink: "#",
          iconLink: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg",
          size: "2500000"
        },
        {
          id: "2",
          name: "Campaign_Assets.zip",
          mimeType: "application/zip",
          webViewLink: "#",
          iconLink: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Zip-icon.svg/1024px-Zip-icon.svg.png",
          size: "15000000"
        },
        {
          id: "3",
          name: "Team_Photo_2026.jpg",
          mimeType: "image/jpeg",
          webViewLink: "#",
          iconLink: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/File_Icon_-_JPG.svg/1024px-File_Icon_-_JPG.svg.png",
          thumbnailLink: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop",
          size: "3400000"
        }
      ]);
    }, 1000);
  });
};
