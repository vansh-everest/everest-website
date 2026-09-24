import { PlanPage, planMetadata } from "@/components/plan/plan-page";

export const generateMetadata = () => planMetadata("/revenue-share");

export default function Page() {
  return <PlanPage path="/revenue-share" />;
}
