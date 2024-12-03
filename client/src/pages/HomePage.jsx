export default function Homepage({ setCurrentPage }) {
	// Add some sample documents/previews
	const sampleDocuments = [
		{
			title: "Understanding ADHD",
			excerpt: "ADHD affects millions worldwide. Learn about common symptoms and coping strategies...",
			readTime: "5 min read",
			category: "Health"
		},
		{
			title: "Study Techniques",
			excerpt: "Effective study methods for students with attention difficulties...",
			readTime: "3 min read",
			category: "Education"
		}
	];

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
			{/* Enhanced Hero Section */}
			<div className="min-h-[80vh] relative flex flex-col items-center justify-center p-8">
				{/* Animated background grid */}
				<div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />
				
				{/* Floating shapes decoration */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
					<div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl animate-float-delayed" />
				</div>

				<div className="animate-fadeIn max-w-4xl text-center relative z-10">
					{/* Main heading with gradient text */}
					<h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
						Focus Better with ADHD Reader
					</h1>
					
					{/* Enhanced subheading */}
					<p className="text-2xl text-white/90 mb-8 leading-relaxed">
						Transform your reading experience with AI-powered highlighting
						and smart organization. Perfect for students, professionals,
						and anyone who wants to read more effectively.
					</p>
					
					{/* CTA buttons with enhanced styling */}
					<div className="flex gap-6 justify-center">
						<button 
							onClick={() => setCurrentPage("login")} 
							className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold 
									hover:bg-blue-50 transform hover:scale-105 transition-all
									shadow-lg hover:shadow-xl"
						>
							Login
						</button>
						<button 
							onClick={() => setCurrentPage("register")} 
							className="px-8 py-4 bg-transparent text-white border-2 border-white 
									rounded-xl font-semibold hover:bg-white/10 
									transform hover:scale-105 transition-all"
						>
							Register
						</button>
					</div>

					{/* Key features pills */}
					<div className="flex flex-wrap gap-4 justify-center mt-12">
						{['AI-Powered', 'Easy to Use', 'Customizable'].map((feature, index) => (
							<span 
								key={index}
								className="px-4 py-2 bg-white/20 rounded-full text-white 
										 text-sm font-medium backdrop-blur-sm"
							>
								{feature}
							</span>
						))}
					</div>
				</div>

				{/* Scroll indicator */}
				<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
					<svg 
						className="w-6 h-6 text-white"
						fill="none" 
						strokeLinecap="round" 
						strokeLinejoin="round" 
						strokeWidth="2" 
						viewBox="0 0 24 24" 
						stroke="currentColor"
					>
						<path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
					</svg>
				</div>
			</div>

			{/* Features Section */}
			<div className="bg-white py-16">
				<div className="max-w-6xl mx-auto px-8">
					<h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
					<div className="grid md:grid-cols-3 gap-8">
						<FeatureCard 
							icon="📚"
							title="Create Documents"
							description="Paste any text that might be difficult to parse"
						/>
						<FeatureCard 
							icon="🎨"
							title="Smart Categories"
							description="Intelligent categories organize your content using AI analysis"
						/>
						<FeatureCard 
							icon="✨"
							title="Automatic Highlights"
							description="Automatic highlights reveal key concepts through AI detection"
						/>
					</div>
				</div>
			</div>

			{/* Sample Documents Section */}
			<div className="bg-gray-50 py-16">
				<div className="max-w-6xl mx-auto px-8">
					<h2 className="text-3xl font-bold text-center mb-12">Sample Documents</h2>
					<div className="grid md:grid-cols-2 gap-8">
						{sampleDocuments.map((doc, index) => (
							<div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
								<div className="flex justify-between items-start mb-4">
									<h3 className="text-xl font-semibold">{doc.title}</h3>
									<span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
										{doc.category}
									</span>
								</div>
								<p className="text-gray-600 mb-4">{doc.excerpt}</p>
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-500">{doc.readTime}</span>
									<button 
										onClick={() => setCurrentPage("login")}
										className="text-blue-600 hover:text-blue-800"
									>
										Login to read more →
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Testimonials Section */}
			<div className="bg-white py-16">
				<div className="max-w-6xl mx-auto px-8">
					<h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
					<div className="grid md:grid-cols-3 gap-8">
						<TestimonialCard 
							quote="This tool has completely changed how I read and study!"
							author="Sarah K."
							role="Student"
						/>
						<TestimonialCard 
							quote="The AI categorization saves me hours of organization time."
							author="Michael R."
							role="Professional"
						/>
						<TestimonialCard 
							quote="Finally, a reading tool that understands ADHD needs."
							author="David M."
							role="Teacher"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

// Helper Components
function FeatureCard({ icon, title, description }) {
	return (
		<div className="text-center p-6">
			<div className="text-4xl mb-4">{icon}</div>
			<h3 className="text-xl font-semibold mb-2">{title}</h3>
			<p className="text-gray-600">{description}</p>
		</div>
	);
}

function TestimonialCard({ quote, author, role }) {
	return (
		<div className="bg-gray-50 p-6 rounded-lg">
			<p className="text-gray-700 mb-4">"{quote}"</p>
			<div className="text-sm">
				<p className="font-semibold">{author}</p>
				<p className="text-gray-500">{role}</p>
			</div>
		</div>
	);
}

// Add these animations to your CSS file
const styles = `
@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
}

@keyframes float-delayed {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
    animation: float-delayed 7s ease-in-out infinite;
}
`;
