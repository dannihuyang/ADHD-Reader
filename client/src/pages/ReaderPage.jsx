import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, ChevronLeft } from 'lucide-react';
import { CATEGORY_COLORS } from '../config/constants';

export default function ReaderPage({ setCurrentPage }) {
	const [document, setDocument] = useState(null);
	const [categories, setCategories] = useState([
		{ name: "", color: CATEGORY_COLORS.FIRST, id: 1 },
		{ name: "", color: CATEGORY_COLORS.SECOND, id: 2 },
		{ name: "", color: CATEGORY_COLORS.THIRD, id: 3 }
	]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [editingCategory, setEditingCategory] = useState(null);

	useEffect(() => {
		const documentId = localStorage.getItem("currentDocumentId");
		if (documentId) {
			fetchDocumentAndCategories(documentId);
		} else {
			setError("No document selected");
			setLoading(false);
		}
	}, []);

	const fetchDocumentAndCategories = async (documentId) => {
		try {
			const [documentResponse, categoriesResponse] = await Promise.all([
				fetch(`http://localhost:3001/api/documents/${documentId}`, {
					credentials: "include",
				}),
				fetch(`http://localhost:3001/api/categories/${documentId}`, {
					credentials: "include",
				})
			]);
			
			if (!documentResponse.ok) throw new Error("Failed to fetch document");
			if (!categoriesResponse.ok) throw new Error("Failed to fetch categories");
			
			const documentData = await documentResponse.json();
			const categoriesData = await categoriesResponse.json();
			
			setDocument(documentData);
			setCategories(categoriesData);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching data:", error);
			setError(error.message);
			setLoading(false);
		}
	};

	const updateCategory = async (categoryId) => {
		try {
			const currentCategory = categories.find(cat => cat.id === categoryId);
			if (!currentCategory) return;

			// Find current color in CATEGORY_COLORS
			const currentColorKey = Object.entries(CATEGORY_COLORS)
				.find(([_, value]) => value === currentCategory.color)?.[0];

			if (!currentColorKey) return;

			// Get next color in sequence
			const colorKeys = Object.keys(CATEGORY_COLORS);
			const currentIndex = colorKeys.indexOf(currentColorKey);
			const nextColorKey = colorKeys[(currentIndex + 1) % colorKeys.length];
			const nextColor = CATEGORY_COLORS[nextColorKey];

			const response = await fetch(`http://localhost:3001/api/categories/${categoryId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					name: currentCategory.name || `Category ${currentCategory.id}`,
					color: nextColor
				})
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.details || 'Failed to update category');
			}

			const updatedCategory = await response.json();
			setCategories(prevCategories => 
				prevCategories.map(cat => 
					cat.id === categoryId ? updatedCategory : cat
				)
			);
			setSelectedCategory(categoryId);
		} catch (error) {
			console.error('Error updating category:', error);
		}
	};

	const handleCategoryNameUpdate = async (categoryId, newName) => {
		try {
			const currentCategory = categories.find(cat => cat.id === categoryId);
			if (!currentCategory) return;

			const response = await fetch(`http://localhost:3001/api/categories/${categoryId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					name: newName,
					color: currentCategory.color
				})
			});

			if (!response.ok) throw new Error('Failed to update category name');

			const updatedCategory = await response.json();
			setCategories(prevCategories => 
				prevCategories.map(cat => 
					cat.id === categoryId ? updatedCategory : cat
				)
			);
			setEditingCategory(null);
		} catch (error) {
			console.error('Error updating category name:', error);
		}
	};

	if (loading) return <div className="min-h-screen flex items-center justify-center">
		<div className="w-8 h-8 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin" />
	</div>;

	if (error) return <div className="min-h-screen flex flex-col items-center justify-center">
		<div className="text-red-600 mb-4">Error: {error}</div>
		<button onClick={() => setCurrentPage("items")} className="text-blue-600 hover:text-blue-800">
			← Back to Documents
		</button>
	</div>;

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
				<div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
					<div className="flex items-center gap-4">
						<button
							onClick={() => setCurrentPage("items")}
							className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
						>
							<ArrowLeft size={20} />
							Back
						</button>
						<h1 className="text-xl font-bold text-gray-900">
							{document?.title || "Loading..."}
						</h1>
					</div>
				</div>
			</header>

			<div className="pt-16 flex h-[calc(100vh-4rem)]">
				{/* Left Sidebar */}
				<div className="w-72 bg-white border-r border-gray-200 p-6 overflow-y-auto">
					<div className="mb-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-2">Categories</h2>
						<p className="text-sm text-gray-500">Click a category to highlight relevant text</p>
					</div>
					
					<div className="space-y-3">
						{categories.map((category, index) => (
							<div key={category.id} className="relative">
								<button
									onClick={() => updateCategory(category.id)}
									className={`w-full p-4 rounded-lg border-2 transition-all
										hover:shadow-md hover:-translate-y-0.5
										focus:outline-none focus:ring-2 focus:ring-offset-2
										${selectedCategory === category.id ? 'ring-2 ring-offset-2' : ''}
									`}
									style={{
										backgroundColor: `${category.color}15`,
										borderColor: category.color,
										'--tw-ring-color': category.color
									}}
								>
									<div className="flex items-center gap-3">
										<div 
											className="w-4 h-4 rounded-full"
											style={{ backgroundColor: category.color }}
										/>
										{editingCategory === category.id ? (
											<input
												autoFocus
												className="text-sm font-medium text-gray-900 bg-transparent border-none focus:ring-0 w-full"
												value={category.name}
												onClick={(e) => e.stopPropagation()}
												onChange={(e) => {
													const newCategories = [...categories];
													newCategories[index] = { ...category, name: e.target.value };
													setCategories(newCategories);
												}}
												onBlur={() => {
													handleCategoryNameUpdate(category.id, category.name);
													setEditingCategory(null);
												}}
												onKeyDown={(e) => {
													if (e.key === 'Enter') {
														handleCategoryNameUpdate(category.id, category.name);
														setEditingCategory(null);
													}
												}}
											/>
										) : (
											<span 
												className="text-sm font-medium text-gray-900 w-full"
												onDoubleClick={(e) => {
													e.stopPropagation();
													setEditingCategory(category.id);
												}}
											>
												{category.name || `Category ${index + 1}`}
											</span>
										)}
									</div>
								</button>
							</div>
						))}
					</div>

					<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
						<h3 className="text-sm font-medium text-blue-900 mb-2">How to use</h3>
						<ul className="text-sm text-blue-700 space-y-2">
							<li>• Select a category to highlight relevant text</li>
							<li>• Click highlighted text to remove highlighting</li>
							<li>• Categories are generated based on your document's content</li>
						</ul>
					</div>
				</div>

				{/* Main Content */}
				<div className="flex-1 overflow-auto bg-white">
					<div className="max-w-3xl mx-auto px-8 py-12">
						<article className="prose prose-lg max-w-none">
							{document?.content ? (
								<div dangerouslySetInnerHTML={{ __html: document.content }} />
							) : (
								<div className="text-gray-500 italic">
									Loading document content...
								</div>
							)}
						</article>
					</div>
				</div>
			</div>
		</div>
	);
}