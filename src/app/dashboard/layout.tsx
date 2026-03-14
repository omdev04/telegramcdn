import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Setting from '@/models/Setting';
import MaintenanceScreen from '@/components/MaintenanceScreen';
import DashboardLayoutClient from './DashboardLayoutClient';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Check maintenance mode server-side
    let maintenanceMode = false;
    const hasMongoUri = Boolean(process.env.MONGODB_URI);

    if (hasMongoUri) {
        try {
            await dbConnect();
            const setting = await Setting.findOne({ key: 'maintenanceMode' });
            maintenanceMode = setting?.value === true;
        } catch (error) {
            console.error('Failed to check maintenance mode in dashboard:', error);
        }
    }

    if (maintenanceMode) {
        const session = await getServerSession(authOptions);
        // @ts-ignore
        const role = session?.user?.role;
        const isAdmin = role === 'admin' || role === 'superadmin';

        if (!isAdmin) {
            return <MaintenanceScreen />;
        }
    }

    return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
