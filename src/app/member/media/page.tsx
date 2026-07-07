import { MediaGallery } from "@/components/media-gallery";
import { PageTitle } from "@/components/shared/page-title";

export default function MemberMediaPage() {
  return (
    <div className="p-6">
      <PageTitle title="Media Storage | TeamVora" />
      <MediaGallery 
        title="Media Storage" 
        description="Kelola seluruh aset gambar dan dokumen di ruang penyimpanan."
        role="member"
        combined={true}
      />
    </div>
  );
}
