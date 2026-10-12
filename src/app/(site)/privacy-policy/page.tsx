import { LegalPage, legalMetadata, type LegalDoc } from "@/components/news/legal-page";
import doc from "@/content/legal/privacy-policy.json";

export const metadata = legalMetadata(doc as LegalDoc);

export default function Page() {
  return <LegalPage doc={doc as LegalDoc} />;
}
