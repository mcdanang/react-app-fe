import { useState } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Key } from "@/types";
import { Label } from "../ui/label";
import { FormLabel } from "../ui/form";

const queryClient = new QueryClient();

export function KeysTable() {
	const [page, setPage] = useState(1);
	const [nameFilter, setNameFilter] = useState("");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingKey, setEditingKey] = useState<Key | null>(null);
	const [formData, setFormData] = useState({ name: "", description: "", staff_id: "" });

	const pageSize = 3;

	const { data, isLoading } = useQuery({
		queryKey: ["keys", page, nameFilter],
		queryFn: () => api.getKeys({ page, pageSize, name: nameFilter }),
	});

	const handleDelete = async (id: number) => {
		if (confirm("Are you sure you want to delete this key?")) {
			await api.deleteKey(id);
			queryClient.invalidateQueries({ queryKey: ["keys"] });
		}
	};

	const handleOpenDialog = (key: Key | null = null) => {
		setEditingKey(key);
		setFormData(
			key
				? { name: key.name, description: key.description, staff_id: key.staff_id?.toString() || "" }
				: { name: "", description: "", staff_id: "" }
		);
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
		setEditingKey(null);
	};

	const handleSubmit = async () => {
		if (editingKey) {
			await api.updateKey(editingKey.id, { ...formData, staff_id: Number(formData.staff_id) });
		} else {
			await api.createKey({ ...formData, staff_id: Number(formData.staff_id) });
		}

		queryClient.invalidateQueries({ queryKey: ["keys"] });
		handleCloseDialog();
	};

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
					<Button onClick={() => handleOpenDialog()}>Add New Key</Button>
				</div>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Staff ID</TableHead>
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
						) : data?.data?.length && data?.data?.length > 0 ? (
							data?.data?.map(key => (
								<TableRow key={key.id}>
									<TableCell>{key.id}</TableCell>
									<TableCell>{key.name}</TableCell>
									<TableCell>{key.description}</TableCell>
									<TableCell>{key.staff_id || "None"}</TableCell>
									<TableCell className="space-x-2">
										<Button variant="outline" size="sm" onClick={() => handleOpenDialog(key)}>
											Edit
										</Button>
										<Button variant="destructive" size="sm" onClick={() => handleDelete(key.id)}>
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
					<div className="text-sm text-gray-500">Total: {data?.total || 0} items</div>
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

				<Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{editingKey ? "Edit Key" : "Add New Key"}</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<div>
								<Label className="pb-0">Name</Label>
								<Input
									placeholder="e.g. Danang"
									value={formData.name}
									onChange={e => setFormData({ ...formData, name: e.target.value })}
								/>
							</div>
							<div>
								<Label className="pb-0">Description</Label>
								<Input
									placeholder="e.g. Master Key"
									value={formData.description}
									onChange={e => setFormData({ ...formData, description: e.target.value })}
								/>
							</div>
							<div>
								<Label className="pb-0">Staff ID</Label>
								<Input
									placeholder="e.g. 3"
									value={formData.staff_id}
									onChange={e => setFormData({ ...formData, staff_id: e.target.value })}
								/>
							</div>
							<div className="flex justify-end space-x-2">
								<Button variant="outline" onClick={handleCloseDialog}>
									Cancel
								</Button>
								<Button onClick={handleSubmit}>{editingKey ? "Save" : "Create"}</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</QueryClientProvider>
	);
}
