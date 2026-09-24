import { PlanPage, planMetadata } from "@/components/plan/plan-page";

export const generateMetadata = () => planMetadata("/drive-to-own");

export default function Page() {
  return <PlanPage path="/drive-to-own" />;
}
