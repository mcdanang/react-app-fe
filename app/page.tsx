"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function AuthPage() {
	const [activeTab, setActiveTab] = useState<"login" | "register">("login");
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		confirmPassword: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (activeTab === "register") {
			// Handle registration logic
			if (formData.password !== formData.confirmPassword) {
				alert("Passwords do not match");
				return;
			}
			alert(`Registered with username: ${formData.username}`);
		} else {
			// Handle login logic
			alert(`Logged in with username: ${formData.username}`);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Welcome to Lock Management System</CardTitle>
				</CardHeader>
				<CardContent>
					<Tabs
						defaultValue="login"
						onValueChange={value => setActiveTab(value as "login" | "register")}
					>
						<TabsList className="mb-4">
							<TabsTrigger value="login">Login</TabsTrigger>
							<TabsTrigger value="register">Register</TabsTrigger>
						</TabsList>
						<TabsContent value="login">
							<form onSubmit={handleSubmit}>
								<div className="space-y-4">
									<div>
										<label htmlFor="username" className="block text-sm font-medium text-gray-700">
											Username
										</label>
										<Input
											type="text"
											name="username"
											value={formData.username}
											onChange={handleChange}
											required
										/>
									</div>
									<div>
										<label htmlFor="password" className="block text-sm font-medium text-gray-700">
											Password
										</label>
										<Input
											type="password"
											name="password"
											value={formData.password}
											onChange={handleChange}
											required
										/>
									</div>
									<Button type="submit" className="w-full">
										Login
									</Button>
								</div>
							</form>
						</TabsContent>
						<TabsContent value="register">
							<form onSubmit={handleSubmit}>
								<div className="space-y-4">
									<div>
										<label htmlFor="username" className="block text-sm font-medium text-gray-700">
											Username
										</label>
										<Input
											type="text"
											name="username"
											value={formData.username}
											onChange={handleChange}
											required
										/>
									</div>
									<div>
										<label htmlFor="password" className="block text-sm font-medium text-gray-700">
											Password
										</label>
										<Input
											type="password"
											name="password"
											value={formData.password}
											onChange={handleChange}
											required
										/>
									</div>
									<div>
										<label
											htmlFor="confirmPassword"
											className="block text-sm font-medium text-gray-700"
										>
											Confirm Password
										</label>
										<Input
											type="password"
											name="confirmPassword"
											value={formData.confirmPassword}
											onChange={handleChange}
											required
										/>
									</div>
									<Button type="submit" className="w-full">
										Register
									</Button>
								</div>
							</form>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
