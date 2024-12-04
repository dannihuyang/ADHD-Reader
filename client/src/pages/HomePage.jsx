import React, { useState } from 'react';
import { CATEGORY_COLORS } from '../config/constants';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaBrain, FaHighlighter } from 'react-icons/fa';

// Helper function to format highlighted text
const formatHighlightedText = (text) => {
	if (!text) return '';
	return text.charAt(0).toUpperCase() + text.slice(1);
};

export default function Homepage() {
	const navigate = useNavigate();

	// State to track the active highlight category
	const [activeHighlight, setActiveHighlight] = useState(null);

	// Function to toggle the highlight
	const toggleHighlight = (category) => {
		if (activeHighlight === category) {
			setActiveHighlight(null); // Turn off if clicking the active category
		} else {
			setActiveHighlight(category); // Turn on if clicking a new category
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
			{/* Hero Section */}
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
					
					{/* Subheading */}
					<div className="max-w-3xl mx-auto mb-12">
						<p className="text-2xl text-white/90 mb-8 leading-relaxed">
							Transform your reading experience with AI-powered highlighting
							and smart organization.
							<span className="block mt-2 text-lg">
								<span className="relative inline-block">
									Click the categories
									<span className="absolute inset-0 bg-white/20 transform -skew-x-12 animate-highlight"></span>
								</span>
								<span className="text-white/80">↓</span>
							</span>
						</p>

						<div className="bg-white rounded-xl p-6 shadow-xl relative">
							{/* Sample Text with Interactive Highlights */}
							<div className="prose prose-lg max-w-none">
								<p className="mb-4">
									<span 
										className="relative cursor-pointer group transition-all duration-200"
										style={{
											backgroundColor: activeHighlight === 'research' 
												? `${CATEGORY_COLORS.FIRST}30` 
												: 'transparent',
											fontSize: activeHighlight === 'research' ? '1.1em' : '1em'
										}}
										onClick={() => toggleHighlight('research')}
									>
										{activeHighlight === 'research' ? (
											<><span className="font-bold">R</span>ecent</>
										) : (
											'Recent'
										)} research suggests that ADHD affects approximately 5% of adults worldwide.
										{activeHighlight === 'research' && (
											<span className="absolute -top-12 left-0 text-white px-3 py-1 rounded text-sm"
												  style={{ backgroundColor: CATEGORY_COLORS.FIRST }}>
												Category: Research Data
											</span>
										)}
									</span>
									{' '}
									<span 
										className="relative cursor-pointer group transition-all duration-200"
										style={{
											backgroundColor: activeHighlight === 'symptoms' 
												? `${CATEGORY_COLORS.SECOND}30` 
												: 'transparent',
											fontSize: activeHighlight === 'symptoms' ? '1.1em' : '1em'
										}}
										onClick={() => toggleHighlight('symptoms')}
									>
										{activeHighlight === 'symptoms' ? (
											<><span className="font-bold">C</span>ommon</>
										) : (
											'Common'
										)} symptoms include difficulty maintaining focus, hyperactivity, and impulsive behavior.
										{activeHighlight === 'symptoms' && (
											<span className="absolute -top-12 left-0 text-white px-3 py-1 rounded text-sm"
												  style={{ backgroundColor: CATEGORY_COLORS.SECOND }}>
												Category: Symptoms
											</span>
										)}
									</span>
									{' '}
									<span 
										className="relative cursor-pointer group transition-all duration-200"
										style={{
											backgroundColor: activeHighlight === 'treatment' 
												? `${CATEGORY_COLORS.THIRD}30` 
												: 'transparent',
											fontSize: activeHighlight === 'treatment' ? '1.1em' : '1em'
										}}
										onClick={() => toggleHighlight('treatment')}
									>
										{activeHighlight === 'treatment' ? (
											<><span className="font-bold">T</span>reatment</>
										) : (
											'Treatment'
										)} options often include a combination of medication, therapy, and lifestyle adjustments.
										{activeHighlight === 'treatment' && (
											<span className="absolute -top-12 left-0 text-white px-3 py-1 rounded text-sm"
												  style={{ backgroundColor: CATEGORY_COLORS.THIRD }}>
												Category: Treatment
											</span>
										)}
									</span>
								</p>
							</div>

							{/* Category Pills */}
							<div className="flex gap-2 mb-6">
								<button 
									onClick={() => toggleHighlight('research')}
									className="px-3 py-1.5 rounded-full text-sm transition-all hover:shadow-sm"
									style={{
										backgroundColor: activeHighlight === 'research' 
											? CATEGORY_COLORS.FIRST 
											: `${CATEGORY_COLORS.FIRST}20`,
										color: activeHighlight === 'research' 
											? 'white' 
											: CATEGORY_COLORS.FIRST
									}}
								>
									Research Data
								</button>
								<button 
									onClick={() => toggleHighlight('symptoms')}
									className="px-3 py-1 rounded-full text-sm transition-all"
									style={{
										backgroundColor: activeHighlight === 'symptoms' 
											? CATEGORY_COLORS.SECOND 
											: `${CATEGORY_COLORS.SECOND}20`,
										color: activeHighlight === 'symptoms' 
											? 'white' 
											: CATEGORY_COLORS.SECOND
									}}
								>
									Symptoms
								</button>
								<button 
									onClick={() => toggleHighlight('treatment')}
									className="px-3 py-1 rounded-full text-sm transition-all"
									style={{
										backgroundColor: activeHighlight === 'treatment' 
											? CATEGORY_COLORS.THIRD 
											: `${CATEGORY_COLORS.THIRD}20`,
										color: activeHighlight === 'treatment' 
											? 'white' 
											: CATEGORY_COLORS.THIRD
									}}
								>
									Treatment
								</button>
							</div>

							{/* Instructions */}
							<div className="mt-4 text-sm text-gray-500">
								Click on text or categories to see how our AI highlighting works
							</div>
						</div>
					</div>

					{/* CTA buttons with styling */}
					<div className="flex gap-6 justify-center">
						<button 
							onClick={() => navigate('/login')} 
							className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold 
									hover:bg-blue-50 transform hover:scale-105 transition-all
									shadow-lg hover:shadow-xl"
						>
							Login
						</button>
						<button 
							onClick={() => navigate('/register')} 
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
			</div>

			{/* Features Section */}
			<div className="bg-white py-16">
				<div className="max-w-6xl mx-auto px-8">
					<h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
					<div className="grid md:grid-cols-3 gap-8">
						<FeatureCard 
							icon={FaBook}
							title="Create Documents"
							description="Paste any text that might be difficult to parse"
							/>
						<FeatureCard 
							icon={FaBrain}
							title="Smart Categories"
							description="Intelligent categories organize your content using AI analysis"
						/>
						<FeatureCard 
							icon={FaHighlighter}
							title="Automatic Highlights"
							description="Automatic highlights reveal key concepts through AI detection"
							/>
					</div>
				</div>
			</div>

			{/* Separator */}
			<div className="w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px max-w-4xl mx-auto" />

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
function FeatureCard({ icon: Icon, title, description }) {
	return (
		<div className="flex flex-col items-center p-6">
			<div className="mb-6 p-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-white">
				<Icon size={24} />
			</div>
			<div className="text-center">
				<h3 className="text-xl font-semibold mb-2">{title}</h3>
				<p className="text-gray-600">{description}</p>
			</div>
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

@keyframes highlight {
    0% {
        opacity: 0;
        transform: translateX(-100%) skewX(-12deg);
    }
    100% {
        opacity: 0.2;
        transform: translateX(100%) skewX(-12deg);
    }
}

.animate-highlight {
    animation: highlight 2s ease-in-out infinite;
}
`;
