// StaffFormDialog.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Staff } from "@/types";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email address"),
	role: z.string().min(1, "Role is required"),
});

type StaffFormData = z.infer<typeof formSchema>;

interface StaffFormDialogProps {
	staffData?: Staff;
	onSuccess: () => void;
}

export function StaffFormDialog({ staffData, onSuccess }: StaffFormDialogProps) {
	const [open, setOpen] = useState(false);
	const { toast } = useToast();
	const isEditing = !!staffData;

	const form = useForm<StaffFormData>({
		resolver: zodResolver(formSchema),
		defaultValues: staffData || {
			name: "",
			email: "",
			role: "",
		},
	});

	const onSubmit = async (data: StaffFormData) => {
		try {
			if (isEditing && staffData) {
				await api.updateStaff(staffData.id, data);
				toast({
					title: "Staff Updated",
					description: "The staff member has been successfully updated.",
				});
			} else {
				await api.createStaff(data);
				toast({
					title: "Staff Created",
					description: "A new staff member has been successfully created.",
				});
			}
			setOpen(false);
			onSuccess();
			form.reset();
		} catch (error) {
			console.error("Error saving staff:", error);
			toast({
				variant: "destructive",
				title: "Error",
				description: "An error occurred while saving the staff member. Please try again.",
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={isEditing ? "outline" : "default"}>
					{isEditing ? "Edit" : "Add New Staff"}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isEditing ? "Edit Staff" : "Add New Staff"}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Role</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end space-x-2">
							<Button type="button" variant="outline" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button type="submit">Save</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
