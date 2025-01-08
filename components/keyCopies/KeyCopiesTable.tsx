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
import { KeyCopy } from "@/types";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { KeyCopyFormDialog } from "./KeyCopyFormDialog";

export function KeyCopiesTable() {
	const [page, setPage] = useState(1);
	const [nameFilter, setNameFilter] = useState("");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedKeyCopyId, setSelectedKeyCopyId] = useState<number | null>(null);

	const queryClient = useQueryClient();
	const { toast } = useToast();
	const pageSize = 3;

	// Fetch keys with pagination and filter
	const { data, isLoading } = useQuery({
		queryKey: ["keyCopies", page, nameFilter],
		queryFn: () => api.getKeyCopies({ page, pageSize, name: nameFilter }),
	});

	const handleDelete = async () => {
		if (selectedKeyCopyId !== null) {
			try {
				await api.deleteKeyCopy(selectedKeyCopyId);
				queryClient.invalidateQueries({ queryKey: ["keyCopies"] });
				toast({ title: "Success", description: "Key copy deleted successfully." });
			} catch (error) {
				console.error(error);
				toast({
					variant: "destructive",
					title: "Error",
					description: "Failed to delete the key copy.",
				});
			} finally {
				setDeleteDialogOpen(false);
				setSelectedKeyCopyId(null);
			}
		}
	};

	const openDeleteDialog = (id: number) => {
		setSelectedKeyCopyId(id);
		setDeleteDialogOpen(true);
	};

	// Reset page to 1 when nameFilter changes
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
					<KeyCopyFormDialog
						onSuccess={() => queryClient.invalidateQueries({ queryKey: ["keyCopies"] })}
					/>
				</div>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>Key Name</TableHead>
							<TableHead>Key ID</TableHead>
							<TableHead>Staff Name</TableHead>
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
							data?.data?.map((keyCopy: KeyCopy) => (
								<TableRow key={keyCopy.id}>
									<TableCell>{keyCopy.id}</TableCell>
									<TableCell>{keyCopy.key_name}</TableCell>
									<TableCell>{keyCopy.key_id}</TableCell>
									<TableCell>{keyCopy.staff_name || "None"}</TableCell>
									<TableCell className="space-x-2">
										<KeyCopyFormDialog
											keyCopyData={keyCopy}
											onSuccess={() => queryClient.invalidateQueries({ queryKey: ["keyCopies"] })}
										/>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => openDeleteDialog(keyCopy.id)}
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
			</div>

			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Deletion</DialogTitle>
					</DialogHeader>
					<p>Are you sure you want to delete this key copy? This action cannot be undone.</p>
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
		</QueryClientProvider>
	);
}
