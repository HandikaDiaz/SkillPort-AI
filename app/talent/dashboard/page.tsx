import { WelcomeHeader } from '@/components/talent-dashboard/WelcomeHeader';
import { StatCards } from '@/components/talent-dashboard/StatCards';
import { UrgentMilestones } from '@/components/talent-dashboard/UrgentMilestones';
import { EscrowStatus } from '@/components/talent-dashboard/EscrowStatus';
import { ProjectOpportunities } from '@/components/talent-dashboard/ProjectOpportunities';
import { RecentActivity } from '@/components/talent-dashboard/RecentActivity';
import { BYOCBanner } from '@/components/talent-dashboard/BYOCBanner';

export default function TalentDashboardPage() {
    return (
        <div className="space-y-8">
            <WelcomeHeader />
            <StatCards />

            <div className="grid lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <UrgentMilestones />
                </div>
                <div className="lg:col-span-2">
                    <EscrowStatus />
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <ProjectOpportunities />
                <RecentActivity />
            </div>

            <BYOCBanner />
        </div>
    );
}