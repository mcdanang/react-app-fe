// StaffTable.tsx
import { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Staff } from "@/types";
import { StaffFormDialog } from "@/components/staffs/StaffFormDialog";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export function StaffTable() {
	const [page, setPage] = useState(1);
	const [nameFilter, setNameFilter] = useState("");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);

	const queryClient = useQueryClient();
	const { toast } = useToast();
	const pageSize = 3;

	const { data, isLoading } = useQuery({
		queryKey: ["staffs", page, nameFilter],
		queryFn: () => api.getStaff({ page, pageSize, name: nameFilter }),
	});

	const handleDelete = async () => {
		if (selectedStaffId !== null) {
			try {
				await api.deleteStaff(selectedStaffId);
				queryClient.invalidateQueries({ queryKey: ["staffs"] });
				toast({ title: "Success", description: "Staff member deleted successfully." });
			} catch (error) {
				console.error(error);
				toast({
					variant: "destructive",
					title: "Error",
					description: "Failed to delete the staff member.",
				});
			} finally {
				setDeleteDialogOpen(false);
				setSelectedStaffId(null);
			}
		}
	};

	const openDeleteDialog = (id: number) => {
		setSelectedStaffId(id);
		setDeleteDialogOpen(true);
	};

	useEffect(() => {
		setPage(1);
	}, [nameFilter]);

	return (
		<QueryClientProvider client={queryClient}>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<Input
						placeholder="Filter by name..."
						value={nameFilter}
						onChange={e => setNameFilter(e.target.value)}
						className="max-w-sm"
					/>
					<StaffFormDialog
						onSuccess={() => queryClient.invalidateQueries({ queryKey: ["staffs"] })}
					/>
				</div>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={5} className="text-center text-gray-500">
									Loading...
								</TableCell>
							</TableRow>
						) : data?.data?.length ? (
							data.data.map((staff: Staff) => (
								<TableRow key={staff.id}>
									<TableCell>{staff.id}</TableCell>
									<TableCell>{staff.name}</TableCell>
									<TableCell>{staff.role}</TableCell>
									<TableCell className="space-x-2">
										<StaffFormDialog
											staffData={staff}
											onSuccess={() => queryClient.invalidateQueries({ queryKey: ["staffs"] })}
										/>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => openDeleteDialog(staff.id)}
										>
											Delete
										</Button>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={5} className="text-center text-gray-500">
									No data found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				<div className="flex items-center justify-between">
					<div className="text-sm text-gray-500">
						Page {page} of {data?.totalPages || 1}
					</div>
					<div className="space-x-2">
						<Button
							variant="outline"
							onClick={() => setPage(p => Math.max(1, p - 1))}
							disabled={page === 1}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							onClick={() => setPage(p => p + 1)}
							disabled={!data || page >= data.totalPages}
						>
							Next
						</Button>
					</div>
				</div>

				<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Confirm Delete</DialogTitle>
						</DialogHeader>
						<p>Are you sure you want to delete this staff member? This action cannot be undone.</p>
						<DialogFooter>
							<Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
								Cancel
							</Button>
							<Button variant="destructive" onClick={handleDelete}>
								Delete
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</QueryClientProvider>
	);
}
