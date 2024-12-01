export default function Homepage({ setCurrentPage }) {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient relative overflow-hidden">
			<div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />
			<div className="animate-fadeIn max-w-lg px-6 py-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
				<h1 className="text-4xl font-bold mb-6 text-blue-600">
					Welcome to ADHD Reader
				</h1>
				<p className="text-lg text-gray-600 mb-8 text-center">
					ADHD Reader is a platform designed to help you manage and enhance your
					reading experience. With features like document upload, highlighting,
					and topic categorization, ADHD Reader makes it easier to focus and
					engage with your reading material.
				</p>
				<div className="flex gap-4 justify-center">
					<button
						onClick={() => setCurrentPage("login")}
						className="btn-primary"
					>
						Login
					</button>
					<button
						onClick={() => setCurrentPage("register")}
						className="btn-gray"
					>
						Register
					</button>
				</div>
			</div>
		</div>
	);
}
