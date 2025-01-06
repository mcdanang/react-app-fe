// app/keys/page.tsx

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeysTable } from "@/components/keys/KeysTable";

const queryClient = new QueryClient();

export default function KeysPage() {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="container mx-auto py-8">
				<Card>
					<CardHeader>
						<CardTitle>Lock Management System</CardTitle>
					</CardHeader>
					<CardContent>
						<KeysTable />
					</CardContent>
				</Card>
			</div>
		</QueryClientProvider>
	);
}
