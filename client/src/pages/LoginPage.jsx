import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
		setIsLoading(true);
		try {
			const response = await fetch("http://localhost:3001/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ email, password }),
			});

			if (response.ok) {
				const user = await response.json();
				navigate('/items');
			} else {
				const data = await response.json();
				setError(data.error || "Login failed");
			}
		} catch (err) {
			setError("An error occurred during login.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleLogout = async () => {
		await fetch("http://localhost:3001/api/auth/logout", {
			method: "POST",
			credentials: "include",
		});
		navigate('/home');
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600">
			<div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
				<h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
					Login to ADHD Reader
				</h2>
				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
						<span>{error}</span>
					</div>
				)}
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleLogin();
					}}
				>
					<div className="mb-4">
						<label htmlFor="email" className="block text-gray-700 font-medium">
							Email
						</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full mt-2 p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
							placeholder="Enter your email"
							required
						/>
					</div>
					<div className="mb-6">
						<label
							htmlFor="password"
							className="block text-gray-700 font-medium"
						>
							Password
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full mt-2 p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
							placeholder="Enter your password"
							required
						/>
					</div>
					<div className="mt-6">
						<button
							type="submit"
							className="btn-primary w-full"
							disabled={isLoading}
						>
							{isLoading ? "Logging in..." : "Log In"}
						</button>
					</div>
				</form>
				<div className="text-center mt-4">
					<button
						onClick={() => navigate('/register')}
						className="text-gray-500 hover:underline"
					>
						Register
					</button>
				</div>
			</div>
		</div>
	);
}
