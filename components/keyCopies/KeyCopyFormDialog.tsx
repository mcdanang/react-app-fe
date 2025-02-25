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
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { KeyCopy } from "@/types";

const formSchema = z.object({
	key_id: z.number().optional(),
	staff_id: z.number().optional(),
});

type KeyCopyFormData = z.infer<typeof formSchema>;

interface KeyCopyFormDialogProps {
	keyCopyData?: KeyCopy;
	onSuccess: () => void;
}

export function KeyCopyFormDialog({ keyCopyData, onSuccess }: KeyCopyFormDialogProps) {
	const [open, setOpen] = useState(false);
	const { toast } = useToast();
	const isEditing = !!keyCopyData;

	const form = useForm<KeyCopyFormData>({
		resolver: zodResolver(formSchema),
		defaultValues: keyCopyData || {},
	});

	const onSubmit = async (data: KeyCopyFormData) => {
		try {
			if (isEditing && keyCopyData) {
				await api.updateKeyCopy(keyCopyData.id, data);
				toast({
					title: "Key Copy Updated",
					description: "The key copy has been successfully updated.",
				});
			} else {
				await api.createKeyCopy(data);
				toast({
					title: "Key Copy Created",
					description: "A new key copy has been successfully created.",
				});
			}
			setOpen(false);
			onSuccess();
			form.reset();
		} catch (error) {
			console.error("Error saving key:", error);

			// Show a toast notification on error
			toast({
				variant: "destructive",
				title: "Error",
				description: "An error occurred while saving the key copy. Please try again.",
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={isEditing ? "outline" : "default"}>
					{isEditing ? "Edit" : "Add New Key Copy"}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isEditing ? "Edit Key Copy" : "Add New Key Copy"}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="key_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Key ID</FormLabel>
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
