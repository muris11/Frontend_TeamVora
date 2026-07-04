import { MediaGallery } from "@/components/media-gallery";
import { PageTitle } from "@/components/shared/page-title";

export default function AdminMediaPage() {
  return (
    <div className="p-6">
      <PageTitle title="Media Storage | TeamVora Admin" />
      <MediaGallery 
        title="Media Storage" 
        description="Kelola seluruh aset gambar dan dokumen di platform (S3)."
        role="admin"
      />
    </div>
  );
}
