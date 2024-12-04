import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleRegister = async () => {
		setIsLoading(true);
		if (password !== confirmPassword) {
			setError("Passwords do not match");
			setIsLoading(false);
			return;
		}

		try {
			const response = await fetch("http://localhost:3001/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
			});

			if (response.ok) {
				setSuccess("Registration successful! Redirecting to login...");
				setError("");
				navigate('/login');
			} else {
				const data = await response.json();
				setError(data.error || "Registration failed");
				setSuccess("");
			}
		} catch (err) {
			setError("An error occurred during registration.");
			setSuccess("");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-500 via-teal-600 to-blue-600">
			<div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
				<h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
					Register
				</h2>
				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
						<span>{error}</span>
					</div>
				)}
				{success && (
					<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
						<span>{success}</span>
					</div>
				)}
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleRegister();
					}}
				>
					<div className="mb-4">
						<label htmlFor="name" className="block text-gray-700 font-medium">
							Name
						</label>
						<input
							type="text"
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full mt-2 p-3 border rounded focus:ring-2 focus:ring-green-500 outline-none"
							placeholder="Enter your name"
							required
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="email" className="block text-gray-700 font-medium">
							Email
						</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full mt-2 p-3 border rounded focus:ring-2 focus:ring-green-500 outline-none"
							placeholder="Enter your email"
							required
						/>
					</div>
					<div className="mb-4">
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
							className="w-full mt-2 p-3 border rounded focus:ring-2 focus:ring-green-500 outline-none"
							placeholder="Enter your password"
							required
						/>
					</div>
					<div className="mb-6">
						<label
							htmlFor="confirmPassword"
							className="block text-gray-700 font-medium"
						>
							Confirm Password
						</label>
						<input
							type="password"
							id="confirmPassword"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="w-full mt-2 p-3 border rounded focus:ring-2 focus:ring-green-500 outline-none"
							placeholder="Confirm your password"
							required
						/>
					</div>
					<button
						type="submit"
						className="btn-primary w-full"
						disabled={isLoading}
					>
						{isLoading ? "Registering..." : "Register"}
					</button>
				</form>
				<p className="text-center text-gray-600 mt-4">
					Already have an account?{" "}
					<button
						onClick={() => navigate('/login')}
						className="text-green-600 hover:underline"
					>
						Login
					</button>
				</p>
				<p className="text-center text-gray-600 mt-2">
					<button
						onClick={() => navigate('/home')}
						className="text-gray-500 hover:underline"
					>
						Back to Homepage
					</button>
				</p>
			</div>
		</div>
	);
}
