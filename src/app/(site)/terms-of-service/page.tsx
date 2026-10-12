import { LegalPage, legalMetadata, type LegalDoc } from "@/components/news/legal-page";
import doc from "@/content/legal/terms-of-service.json";

export const metadata = legalMetadata(doc as LegalDoc);

export default function Page() {
  return <LegalPage doc={doc as LegalDoc} />;
}
