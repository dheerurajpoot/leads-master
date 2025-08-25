import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminStatsCards } from "@/components/admin/admin-stats-cards";
import { AdminUsersTable } from "@/components/admin/admin-users-table";
import { AdminLeadsOverview } from "@/components/admin/admin-leads-overview";
import { AdminRecentActivity } from "@/components/admin/admin-recent-activity";
import { MobileLayout } from "@/components/mobile/mobile-layout";
import { MobileAdminStatsCards } from "@/components/admin/mobile-admin-stats-cards";
import { MobileAdminUsersTable } from "@/components/admin/mobile-admin-users-table";
import { MobileAdminLeadsOverview } from "@/components/admin/mobile-admin-leads-overview";
import { MobileAdminQuickActions } from "@/components/admin/mobile-admin-quick-actions";
import { Button } from "@/components/ui/button";
import { Settings, Download } from "lucide-react";

export default async function AdminDashboardPage() {
	const { user } = await requireAdmin();
	const supabase = await createClient();

	// Fetch comprehensive admin data
	const [
		{ data: leads },
		{ data: profiles },
		{ data: formTypes },
		{ data: adminUsers },
	] = await Promise.all([
		supabase
			.from("leads")
			.select("*")
			.order("created_at", { ascending: false }),
		supabase
			.from("profiles")
			.select("*")
			.order("created_at", { ascending: false }),
		supabase
			.from("form_types")
			.select("*")
			.order("created_at", { ascending: false }),
		supabase
			.from("admin_users")
			.select("*, profiles(full_name, is_admin)")
			.order("last_login", { ascending: false }),
	]);

	// Calculate comprehensive stats
	const totalLeads = leads?.length || 0;
	const totalUsers = profiles?.length || 0;
	const totalAdmins = profiles?.filter((p: any) => p.is_admin).length || 0;
	const activeFormTypes =
		formTypes?.filter((f: any) => f.is_active).length || 0;

	// Lead stats by form type
	const leadsByFormType =
		formTypes?.map((formType: any) => ({
			...formType,
			leadCount:
				leads?.filter((lead: any) => lead.form_type_id === formType.id)
					.length || 0,
		})) || [];

	// Recent activity (last 7 days)
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
	const recentLeads =
		leads?.filter((lead: any) => new Date(lead.created_at) >= sevenDaysAgo)
			.length || 0;
	const recentUsers =
		profiles?.filter(
			(profile: any) => new Date(profile.created_at) >= sevenDaysAgo
		).length || 0;

	const headerActions = (
		<div className='flex items-center space-x-2'>
			<Button size='sm' variant='outline' className='p-2 bg-transparent'>
				<Download className='w-4 h-4' />
			</Button>
			<Button size='sm' variant='outline' className='p-2 bg-transparent'>
				<Settings className='w-4 h-4' />
			</Button>
		</div>
	);

	return (
		<div className='min-h-screen bg-slate-50'>
			<AdminHeader user={user} />

			<main className='container mx-auto px-4 py-8 max-w-7xl'>
				<div className='mb-8'>
					<h1 className='text-3xl font-bold text-slate-900 mb-2'>
						Admin Dashboard
					</h1>
					<p className='text-slate-600'>
						Complete system overview and management
					</p>
				</div>

				<AdminStatsCards
					totalLeads={totalLeads}
					totalUsers={totalUsers}
					totalAdmins={totalAdmins}
					activeFormTypes={activeFormTypes}
					recentLeads={recentLeads}
					recentUsers={recentUsers}
				/>

				<div className='grid lg:grid-cols-3 gap-8 mt-8'>
					<div className='lg:col-span-2 space-y-8'>
						<AdminLeadsOverview
							leads={leads || []}
							leadsByFormType={leadsByFormType}
						/>
						<AdminUsersTable users={profiles || []} />
					</div>
					<div>
						<AdminRecentActivity
							leads={leads?.slice(0, 10) || []}
							users={profiles?.slice(0, 5) || []}
							adminUsers={adminUsers || []}
						/>
					</div>
				</div>
			</main>

			{/* Mobile Layout */}
			<MobileLayout
				headerTitle='Admin Panel'
				headerActions={headerActions}
				showBottomNav={false}>
				<div className='space-y-6'>
					{/* Mobile Admin Stats */}
					<MobileAdminStatsCards
						totalLeads={totalLeads}
						totalUsers={totalUsers}
						totalAdmins={totalAdmins}
						activeFormTypes={activeFormTypes}
						recentLeads={recentLeads}
						recentUsers={recentUsers}
					/>

					{/* Quick Admin Actions */}
					<MobileAdminQuickActions />

					{/* Leads Overview */}
					<MobileAdminLeadsOverview
						leads={leads || []}
						leadsByFormType={leadsByFormType}
					/>

					{/* Users Management */}
					<MobileAdminUsersTable users={profiles || []} />
				</div>
			</MobileLayout>
		</div>
	);
}
