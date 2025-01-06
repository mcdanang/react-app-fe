// components/keys/KeyFormDialog.tsx

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
import { Key } from "@/types";
import { api } from "@/lib/api";

const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string(),
	staff_id: z.number().nullable(),
});

type KeyFormData = z.infer<typeof formSchema>;

interface KeyFormDialogProps {
	key?: Key;
	onSuccess: () => void;
}

export function KeyFormDialog({ key, onSuccess }: KeyFormDialogProps) {
	const [open, setOpen] = useState(false);
	const isEditing = !!key;

	const form = useForm<KeyFormData>({
		resolver: zodResolver(formSchema),
		defaultValues: key || {
			name: "",
			description: "",
			staff_id: null,
		},
	});

	const onSubmit = async (data: KeyFormData) => {
		try {
			if (isEditing && key) {
				await api.updateKey(key.id, data);
			} else {
				await api.createKey(data);
			}
			setOpen(false);
			onSuccess();
			form.reset();
		} catch (error) {
			console.error("Error saving key:", error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={isEditing ? "outline" : "default"}>
					{isEditing ? "Edit" : "Add New Key"}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isEditing ? "Edit Key" : "Add New Key"}</DialogTitle>
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
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="staff_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Staff ID</FormLabel>
									<FormControl>
										<Input
											type="number"
											{...field}
											onChange={e => field.onChange(e.target.value ? Number(e.target.value) : "")}
											value={field.value !== null ? field.value : ""}
										/>
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
