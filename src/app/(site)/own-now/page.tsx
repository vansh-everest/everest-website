import { PlanPage, planMetadata } from "@/components/plan/plan-page";

export const generateMetadata = () => planMetadata("/own-now");

export default function Page() {
  return <PlanPage path="/own-now" />;
}
