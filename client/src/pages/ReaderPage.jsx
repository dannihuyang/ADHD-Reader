import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, ChevronLeft } from 'lucide-react';
import { CATEGORY_COLORS } from '../config/constants';

export default function ReaderPage({ setCurrentPage }) {
	const [document, setDocument] = useState(null);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [editingCategory, setEditingCategory] = useState(null);
	const [highlights, setHighlights] = useState([]);
	const [isLoadingHighlights, setIsLoadingHighlights] = useState(false);
	const [processingCategory, setProcessingCategory] = useState(null);

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

	const updateCategory = async (categoryId, newColor) => {
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
					name: currentCategory.name || `Category ${currentCategory.id}`,
					color: newColor
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

	const handleCategoryClick = async (category) => {
		console.log("Category clicked:", category);
		setSelectedCategory(category.id);
		setProcessingCategory(category.id);

		try {
			const response = await fetch(
				`http://localhost:3001/api/highlights/generate/${category.id}`,
				{
					method: 'POST',
					credentials: 'include'
				}
			);
			const data = await response.json();
			console.log("Highlights generated:", data);
		} catch (error) {
			console.error("Error generating highlights:", error);
		} finally {
			setProcessingCategory(null);
		}
	};

	const removeAllHighlights = () => {
		const content = document.querySelector('#document-content');
		console.log("Content element found:", !!content); // Debug log
		if (!content) return;

		const highlights = content.querySelectorAll('.highlight-span');
		console.log("Found highlights to remove:", highlights.length); // Debug log
		highlights.forEach(highlight => {
			const text = highlight.textContent;
			highlight.replaceWith(text);
		});
	};

	const applyHighlights = (highlights, color) => {
		const content = document.querySelector('#document-content');
		console.log("Applying highlights:", highlights.length, "Color:", color); // Debug log
		if (!content) return;

		// Sort highlights by startIndex in descending order
		highlights.sort((a, b) => b.startIndex - a.startIndex);

		highlights.forEach(highlight => {
			try {
				const range = document.createRange();
				const startNode = findTextNode(content, highlight.startIndex);
				const endNode = findTextNode(content, highlight.endIndex);
				
				console.log("Found nodes:", !!startNode, !!endNode, highlight.text); // Debug log
				
				if (startNode && endNode) {
					const span = document.createElement('span');
					span.className = 'highlight-span';
					span.style.backgroundColor = `${color}40`;
					span.style.padding = '0 2px';
					span.style.borderRadius = '2px';
					
					range.setStart(startNode.node, startNode.offset);
					range.setEnd(endNode.node, endNode.offset);
					range.surroundContents(span);
				}
			} catch (error) {
				console.error("Error applying highlight:", error, highlight);
			}
		});
	};

	// Helper function to find the correct text node and offset
	const findTextNode = (root, targetIndex) => {
		let currentIndex = 0;
		
		function traverse(node) {
			if (node.nodeType === Node.TEXT_NODE) {
				const length = node.textContent.length;
				if (currentIndex <= targetIndex && targetIndex <= currentIndex + length) {
					return {
						node: node,
						offset: targetIndex - currentIndex
					};
				}
				currentIndex += length;
			} else {
				for (const child of node.childNodes) {
					const result = traverse(child);
					if (result) return result;
				}
			}
			return null;
		}
		
		return traverse(root);
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
						{categories.map((category) => (
							<div
								key={category.id}
								className="relative"
							>
								{processingCategory === category.id && (
									<div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-lg">
										<div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm">
											<div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full" />
											<span className="text-sm text-gray-500">Processing...</span>
										</div>
									</div>
								)}

								<div
									onClick={() => handleCategoryClick(category)}
									className={`relative w-full p-4 rounded-lg border-2 transition-all
										hover:shadow-md cursor-pointer
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
										<span className="text-sm font-medium text-gray-900">
											{category.name || "Untitled Category"}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
						<h3 className="text-sm font-medium text-blue-900 mb-2">How to use</h3>
						<ul className="text-sm text-blue-700 space-y-2">
							<li>• Click on a category to highlight relevant text</li>
							<li>• Hover on a category to select a new color</li>
							<li>• Double click a category to change its name</li>
						</ul>
					</div>
				</div>

				{/* Main Content */}
				<div className="flex-1 overflow-auto bg-white">
					<div className="max-w-3xl mx-auto px-8 py-12">
						<article className="prose prose-lg max-w-none">
							{document?.content ? (
								<div 
									dangerouslySetInnerHTML={{ __html: document.content }} 
									id="document-content"
								/>
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