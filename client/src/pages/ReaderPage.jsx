import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { CATEGORY_COLORS } from '../config/constants';

export default function ReaderPage({ setCurrentPage }) {
  const contentRef = useRef(null);
	const [document, setDocument] = useState(null);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [editingCategory, setEditingCategory] = useState(null);
	const [highlights, setHighlights] = useState([]);
	const [isLoadingHighlights, setIsLoadingHighlights] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState(new Set());
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
    console.log("Category clicked:", category.name);
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
        console.log("Received highlight data:", data);

        if (data.highlights && Array.isArray(data.highlights)) {
            // Check for existing highlights using window.document
            const content = window.document.getElementById('document-content');
            if (!content) {
                console.error("Content element not found");
                return;
            }

            const existingHighlights = content.querySelectorAll(`.category-${category.id}`);
            console.log("Existing highlights found:", existingHighlights.length);

            toggleCategoryVisibility(category.id);
            
            if (existingHighlights.length === 0) {
                applyHighlights(data.highlights, category.color, category.id);
            }
        }
    } catch (error) {
        console.error("Error in handleCategoryClick:", error);
    } finally {
        setProcessingCategory(null);
    }
};

const toggleCategoryVisibility = (categoryId) => {
    const content = window.document.querySelector('#document-content');
    if (!content) {
        console.log("Content element not found");
        return;
    }

    const newVisibleCategories = new Set(visibleCategories);
    if (newVisibleCategories.has(categoryId)) {
        newVisibleCategories.delete(categoryId);
    } else {
        newVisibleCategories.add(categoryId);
    }
    setVisibleCategories(newVisibleCategories);

    const categoryHighlights = content.querySelectorAll(`.category-${categoryId}`);
    categoryHighlights.forEach(highlight => {
        if (newVisibleCategories.has(categoryId)) {
            highlight.style.backgroundColor = highlight.dataset.color;
        } else {
            highlight.style.backgroundColor = 'transparent';
        }
    });
};

const applyHighlights = (highlights, color, categoryId) => {
    const content = window.document.getElementById('document-content');
    if (!content) {
        console.error("Content element not found");
        return;
    }

    highlights.forEach(highlight => {
        try {
            const range = window.document.createRange();
            const walker = window.document.createTreeWalker(
                content,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            let currentPos = 0;
            let startNode = null;
            let endNode = null;
            let startOffset = 0;
            let endOffset = 0;

            let node;
            while ((node = walker.nextNode())) {
                const nodeLength = node.textContent.length;

                if (!startNode && currentPos + nodeLength > highlight.startIndex) {
                    startNode = node;
                    startOffset = highlight.startIndex - currentPos;
                }

                if (!endNode && currentPos + nodeLength >= highlight.endIndex) {
                    endNode = node;
                    endOffset = highlight.endIndex - currentPos;
                    break;
                }

                currentPos += nodeLength;
            }

            if (startNode && endNode) {
                range.setStart(startNode, startOffset);
                range.setEnd(endNode, endOffset);

                const highlightSpan = window.document.createElement('span');
                highlightSpan.className = `highlight-span category-${categoryId}`;
                highlightSpan.dataset.color = `${color}40`;
                highlightSpan.style.backgroundColor = `${color}40`;
                highlightSpan.style.transition = 'background-color 0.2s ease';
                
                range.surroundContents(highlightSpan);
            }
        } catch (error) {
            console.error("Error applying highlight:", error);
        }
    });
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
		<div className="h-screen flex flex-col bg-gray-50">
			{/* Header */}
			<header className="bg-white border-b border-gray-200 sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
					<div className="flex items-center gap-6">
						<button
							onClick={() => setCurrentPage("items")}
							className="text-gray-600 hover:text-gray-800 p-2"
						>
							<ArrowLeft className="h-5 w-5" />
						</button>
						<h1 className="text-xl font-bold text-gray-900 pl-2">
							{document?.title || "Untitled Document"}
						</h1>
					</div>
				</div>
			</header>

			<div className="flex flex-1 overflow-hidden">
				{/* Left Sidebar */}
				<div className="w-72 bg-white border-r border-gray-200 p-6 overflow-y-auto">
					<h3 className="text-lg font-semibold mb-2">Categories</h3>
					
					{/* Categories list */}
					<div className="space-y-3 mt-6">
						{categories.map((category) => (
							<div key={category.id} className="relative group">
								{/* Main category button */}
								<div
									onClick={() => handleCategoryClick(category)}
									className={`cursor-pointer rounded-lg p-4 transition-all relative
										${visibleCategories.has(category.id) 
											? 'ring-2 ring-offset-2 font-medium shadow-md transform scale-105'
											: 'border-2 hover:shadow-sm hover:scale-[1.02] transition-transform'
										}
									`}
									style={{
										backgroundColor: visibleCategories.has(category.id) 
											? `${category.color}30`
											: `${category.color}10`,
										borderColor: category.color,
										'--tw-ring-color': category.color,
										transform: visibleCategories.has(category.id) ? 'translateX(4px)' : 'none',
										transition: 'all 0.2s ease-in-out'
									}}
								>
									{/* Category content */}
									<div className="flex items-center gap-3">
										{/* Color dot with processing animation */}
										<div className="relative">
											<div 
												className={`w-4 h-4 rounded-full flex-shrink-0 transition-transform
													${visibleCategories.has(category.id) ? 'scale-110' : ''}
													${processingCategory === category.id ? 'opacity-50' : ''}
												`}
												style={{ 
													backgroundColor: category.color,
													boxShadow: visibleCategories.has(category.id) 
														? `0 0 0 2px white, 0 0 0 4px ${category.color}40` 
														: 'none'
												}}
											/>
											{/* Processing spinner overlay */}
											{processingCategory === category.id && (
												<div className="absolute inset-0 flex items-center justify-center">
													<div 
														className="w-6 h-6 border-2 border-transparent rounded-full animate-spin"
														style={{ 
															borderTopColor: category.color,
															borderRightColor: category.color
														}}
													/>
												</div>
											)}
										</div>

										{/* Category name */}
										<span className={`text-sm text-gray-900 transition-all
											${visibleCategories.has(category.id) 
												? 'font-semibold transform translate-x-0.5' 
												: 'font-normal'
											}
											${processingCategory === category.id ? 'opacity-50' : ''}
										`}>
											{category.name}
										</span>
									</div>

									{/* Active indicator */}
									{visibleCategories.has(category.id) && (
										<div 
											className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full"
											style={{ backgroundColor: category.color }}
										/>
									)}
								</div>

								{/* Action buttons container */}
								<div className="absolute right-2 top-0 bottom-0 flex items-center gap-2">
									{/* Edit button */}
									{!processingCategory && (
										<button
											className="p-1.5 rounded-full bg-white shadow-sm hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200"
											onClick={(e) => {
												e.stopPropagation();
												setEditingCategory(category.id);
											}}
											title="Edit category name"
										>
											<Edit2 className="h-4 w-4 text-gray-600" />
										</button>
									)}

									{/* Color Palette */}
									<div 
										className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center"
										onClick={(e) => e.stopPropagation()}
									>
										{Object.entries(CATEGORY_COLORS).map(([key, color]) => (
											<button
												key={key}
												onClick={(e) => {
													e.stopPropagation();
													updateCategory(category.id, color);
												}}
												className="w-6 h-6 mx-0.5 rounded-full border-2 border-white hover:scale-110 transition-transform shadow-sm"
												style={{ backgroundColor: color }}
											/>
										))}
									</div>
								</div>
							</div>
						))}
					</div>

          {/* Instructions */}
					<div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
						<h3 className="text-sm font-medium text-blue-900 mb-2">How to use</h3>
						<ul className="text-sm text-blue-700 space-y-2">
							<li>• Click on a category to highlight relevant text</li>
							<li>• Hover on a category to select a new color</li>
							<li>• Click the edit icon to change category name</li>
						</ul>
					</div>
				</div>
          
				{/* Main Content */}
				<div className="flex-1 overflow-auto bg-white">
					<div className="max-w-3xl mx-auto px-8 py-12">
						<article className="prose prose-lg max-w-none">
							{document?.content ? (
								<div 
									ref={contentRef}
									dangerouslySetInnerHTML={{ __html: document.content }} 
									id="document-content"
									className="relative"
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