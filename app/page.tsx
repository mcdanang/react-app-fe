// app/keys/page.tsx

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeysTable } from "@/components/keys/KeysTable";
import { KeyCopiesTable } from "@/components/keyCopies/KeyCopiesTable";

const queryClient = new QueryClient();

export default function KeysPage() {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="container mx-auto py-8 space-y-4">
				<Card>
					<CardHeader>
						<CardTitle>Key Management</CardTitle>
					</CardHeader>
					<CardContent>
						<KeysTable />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Key Copy Management</CardTitle>
					</CardHeader>
					<CardContent>
						<KeyCopiesTable />
					</CardContent>
				</Card>
				{/* <Card>
					<CardHeader>
						<CardTitle>Staff Management</CardTitle>
					</CardHeader>
					<CardContent>
						<KeysTable />
					</CardContent>
				</Card> */}
			</div>
		</QueryClientProvider>
	);
}
