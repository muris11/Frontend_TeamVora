import { MediaGallery } from "@/components/media-gallery";
import { PageTitle } from "@/components/shared/page-title";
import { GoogleDriveConnector } from "@/components/shared/google-drive-connector";

export default function LeadMediaPage() {
  return (
    <div className="p-6 space-y-6">
      <PageTitle title="Media Storage | TeamVora" />
      <GoogleDriveConnector />
      <MediaGallery 
        title="Media Storage" 
        description="Kelola seluruh aset gambar dan dokumen di ruang penyimpanan."
        role="lead"
        combined={true}
      />
    </div>
  );
}
