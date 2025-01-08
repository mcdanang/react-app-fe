"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeysTable } from "@/components/keys/KeysTable";
import { KeyCopiesTable } from "@/components/keyCopies/KeyCopiesTable";
import { StaffTable } from "@/components/staffs/StaffTable";

const queryClient = new QueryClient();

export default function DashboardPage() {
	const [activeMenu, setActiveMenu] = useState<"keys" | "keyCopies" | "staffs">("keys");

	return (
		<QueryClientProvider client={queryClient}>
			<div className="flex h-screen">
				{/* Sidebar */}
				<div className="w-64 bg-gray-800 text-white flex flex-col">
					<div className="p-4 text-lg font-bold border-b border-gray-700">Dashboard</div>
					<nav className="flex-1 p-4 space-y-2">
						<button
							onClick={() => setActiveMenu("keys")}
							className={`w-full text-left px-4 py-2 rounded ${
								activeMenu === "keys" ? "bg-gray-700" : "hover:bg-gray-700"
							}`}
						>
							Keys
						</button>
						<button
							onClick={() => setActiveMenu("keyCopies")}
							className={`w-full text-left px-4 py-2 rounded ${
								activeMenu === "keyCopies" ? "bg-gray-700" : "hover:bg-gray-700"
							}`}
						>
							Key Copies
						</button>
						<button
							onClick={() => setActiveMenu("staffs")}
							className={`w-full text-left px-4 py-2 rounded ${
								activeMenu === "staffs" ? "bg-gray-700" : "hover:bg-gray-700"
							}`}
						>
							Staff
						</button>
					</nav>
				</div>

				{/* Main Content */}
				<div className="flex-1 p-8 bg-gray-100">
					{activeMenu === "keys" && (
						<Card>
							<CardHeader>
								<CardTitle>Key Management</CardTitle>
							</CardHeader>
							<CardContent>
								<KeysTable />
							</CardContent>
						</Card>
					)}
					{activeMenu === "keyCopies" && (
						<Card>
							<CardHeader>
								<CardTitle>Key Copy Management</CardTitle>
							</CardHeader>
							<CardContent>
								<KeyCopiesTable />
							</CardContent>
						</Card>
					)}
					{activeMenu === "staffs" && (
						<Card>
							<CardHeader>
								<CardTitle>Staff Management</CardTitle>
							</CardHeader>
							<CardContent>
								<StaffTable />
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</QueryClientProvider>
	);
}
