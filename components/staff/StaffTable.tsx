import { useState } from "react";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function StaffTable() {
	const [nameFilter, setNameFilter] = useState("");
	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery({
		queryKey: ["staff", nameFilter],
		queryFn: () => api.getStaff({ name: nameFilter }),
	});

	return (
		<div>
			<div className="flex justify-between">
				<Input
					placeholder="Filter by name..."
					value={nameFilter}
					onChange={e => setNameFilter(e.target.value)}
				/>
				<Button>Add Staff</Button>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Role</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading ? (
						<TableRow>
							<TableCell colSpan={3}>Loading...</TableCell>
						</TableRow>
					) : (
						data.map(staff => (
							<TableRow key={staff.id}>
								<TableCell>{staff.id}</TableCell>
								<TableCell>{staff.name}</TableCell>
								<TableCell>{staff.role}</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
