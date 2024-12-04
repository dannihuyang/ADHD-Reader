import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { CATEGORY_COLORS } from '../config/constants';
import '../styles/ReaderPage.css';
import { useNavigate, useParams } from 'react-router-dom';

export default function ReaderPage() {
	const navigate = useNavigate();
	const { documentId } = useParams(); // Get documentId from URL
	const contentRef = useRef(null);
	const [document, setDocument] = useState(null);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [editingCategory, setEditingCategory] = useState(null);
	const [visibleCategories, setVisibleCategories] = useState(new Set());
	const [processingCategory, setProcessingCategory] = useState(null);

	useEffect(() => {
		fetchDocumentAndCategories(documentId);
	}, [documentId]);

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

			// Update existing highlights with new color
			const content = window.document.getElementById('document-content');
			if (content) {
				const existingHighlights = content.querySelectorAll(`.category-${categoryId}`);
				existingHighlights.forEach(highlight => {
					// Update the stored color in dataset
					highlight.dataset.color = `${newColor}40`;
					// If the category is currently visible, update the displayed color
					if (visibleCategories.has(categoryId)) {
						highlight.style.backgroundColor = `${newColor}40`;
					}
				});
			}
		} catch (error) {
			console.error('Error updating category:', error);
		}
	};

	const handleCategoryNameUpdate = async (categoryId, newName) => {
		setProcessingCategory(categoryId);

		try {
			const currentCategory = categories.find(cat => cat.id === categoryId);
			if (!currentCategory) return;

			// Update category name in database
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

			// Update local state
			setCategories(prevCategories => 
				prevCategories.map(cat => 
					cat.id === categoryId ? updatedCategory : cat
				)
			);

			// Generate new highlights for updated category
			const highlightsResponse = await fetch(
				`http://localhost:3001/api/highlights/generate/${categoryId}`,
				{
					method: 'POST',
					credentials: 'include'
				}
			);

			if (!highlightsResponse.ok) throw new Error('Failed to generate new highlights');
			const data = await highlightsResponse.json();

			// Safely remove old highlights while preserving text
			const content = window.document.getElementById('document-content');
			if (content) {
				const oldHighlights = content.querySelectorAll(`.category-${categoryId}`);
				oldHighlights.forEach(highlight => {
					// Create a text node with the highlight's content
					const textNode = window.document.createTextNode(highlight.textContent);
					// Insert the text node before the highlight
					highlight.parentNode.insertBefore(textNode, highlight);
					// Then remove the highlight span
					highlight.parentNode.removeChild(highlight);
				});

				// Apply new highlights after removing old ones
				if (data.highlights && Array.isArray(data.highlights)) {
					applyHighlights(data.highlights, updatedCategory.color, categoryId);
					
					// Make sure the category is visible
					const newVisibleCategories = new Set(visibleCategories);
					newVisibleCategories.add(categoryId);
					setVisibleCategories(newVisibleCategories);
				}
			}

		} catch (error) {
			console.error('Error updating category:', error);
		} finally {
			setProcessingCategory(null);
			setEditingCategory(null);
		}
	};

  const handleCategoryClick = async (category) => {
    
    const content = window.document.getElementById('document-content');
    if (!content) return;

    const existingHighlights = content.querySelectorAll(`.category-${category.id}`);

    if (existingHighlights.length > 0) {
        const isCurrentlyVisible = visibleCategories.has(category.id);
        
        // Update visibility state
        const newVisibleCategories = new Set(visibleCategories);
        if (isCurrentlyVisible) {
            newVisibleCategories.delete(category.id);
        } else {
            newVisibleCategories.add(category.id);
        }
        setVisibleCategories(newVisibleCategories);

        // Toggle all visual enhancements
        existingHighlights.forEach(highlight => {
            if (isCurrentlyVisible) {
                // Hide highlight and reset all styling
                highlight.style.backgroundColor = 'transparent';
                highlight.style.fontSize = 'inherit';
                // Reset first character styling
                const firstCharSpan = highlight.querySelector('span');
                if (firstCharSpan) {
                    firstCharSpan.style.fontWeight = 'normal';
                    firstCharSpan.style.textTransform = 'none';
                    firstCharSpan.style.fontSize = 'inherit';
                }
            } else {
                // Show highlight and apply styling
                highlight.style.backgroundColor = highlight.dataset.color;
                highlight.style.fontSize = '1.1em';
                // Restore first character styling
                const firstCharSpan = highlight.querySelector('span');
                if (firstCharSpan) {
                    firstCharSpan.style.fontWeight = 'bold';
                    firstCharSpan.style.textTransform = 'uppercase';
                    firstCharSpan.style.fontSize = '1.05em';
                }
            }
        });

        return;
    }

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

        if (data.highlights && Array.isArray(data.highlights)) {
            applyHighlights(data.highlights, category.color, category.id);
            
            // Make new highlights visible
            const newVisibleCategories = new Set(visibleCategories);
            newVisibleCategories.add(category.id);
            setVisibleCategories(newVisibleCategories);
        }
    } catch (error) {
        console.error("Error in handleCategoryClick:", error);
    } finally {
        setProcessingCategory(null);
    }
};


const applyHighlights = (highlights, color, categoryId) => {
    const content = window.document.getElementById('document-content');
    if (!content) return;

    highlights.forEach(highlight => {
        try {
            const walker = window.document.createTreeWalker(
                content,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            let node;
            while (node = walker.nextNode()) {
                const index = node.textContent.indexOf(highlight.text);
                if (index !== -1) {
                    const range = window.document.createRange();
                    range.setStart(node, index);
                    range.setEnd(node, index + highlight.text.length);

                    // Create wrapper span for the highlight
                    const highlightSpan = window.document.createElement('span');
                    highlightSpan.style.cssText = `
                        background-color: ${color}40;
                        display: inline;
                        padding: 2px 0;
                        transition: all 0.2s ease;
                        line-height: 1.6;
                        vertical-align: baseline;
                        font-size: 1.1em;  // Increased font size for entire highlight
                    `;
                    highlightSpan.classList.add(`category-${categoryId}`);
                    highlightSpan.dataset.color = `${color}40`;

                    try {
                        range.surroundContents(highlightSpan);
                        
                        // Get the text content
                        const text = highlightSpan.textContent;
                        if (text.length > 0) {
                            // Clear existing content
                            highlightSpan.textContent = '';
                            
                            // Create first character span
                            const firstCharSpan = window.document.createElement('span');
                            firstCharSpan.style.cssText = `
                                font-weight: bold;
                                text-transform: uppercase;
                                font-size: 1.05em;
                            `;
                            firstCharSpan.textContent = text.charAt(0);
                            
                            // Add first character and rest of text
                            highlightSpan.appendChild(firstCharSpan);
                            highlightSpan.appendChild(
                                window.document.createTextNode(text.slice(1))
                            );
                        }
                    } catch (e) {
                        console.log("Failed to surround contents, trying alternative method");
                        const fragment = range.extractContents();
                        const text = fragment.textContent;
                        
                        if (text.length > 0) {
                            // Create first character span
                            const firstCharSpan = window.document.createElement('span');
                            firstCharSpan.style.cssText = `
                                font-weight: bold;
                                text-transform: uppercase;
                                font-size: 1.05em;
                            `;
                            firstCharSpan.textContent = text.charAt(0);
                            
                            // Add first character and rest of text
                            highlightSpan.appendChild(firstCharSpan);
                            highlightSpan.appendChild(
                                window.document.createTextNode(text.slice(1))
                            );
                        }
                        
                        range.insertNode(highlightSpan);
                    }
                    break;  // Exit loop after highlighting
                }
            }
        } catch (error) {
            console.warn("Error applying highlight:", error);
        }
    });
};

	if (loading) return <div className="min-h-screen flex items-center justify-center">
		<div className="w-8 h-8 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin" />
	</div>;

	if (error) return <div className="min-h-screen flex flex-col items-center justify-center">
		<div className="text-red-600 mb-4">Error: {error}</div>
		<button onClick={() => navigate('/items')} className="text-blue-600 hover:text-blue-800">
			← Back to Documents
		</button>
	</div>;

	return (
		<div className="h-screen flex flex-col">
			{/* Header */}
			<div className="bg-white border-b p-4">
				<button 
					onClick={() => navigate('/items')} 
					className="flex items-center text-gray-600 hover:text-gray-900"
				>
					<ArrowLeft className="w-5 h-5 mr-2" />
					Back to Documents
				</button>
			</div>

			{/* Main content area with reversed order on mobile */}
			<div className="flex flex-col-reverse md:flex-row flex-1 overflow-hidden">
				{/* Sidebar - moves to bottom on mobile */}
				<div className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-r bg-gray-50 overflow-y-auto">
					<div className="p-4">
						<h2 className="text-xl font-semibold mb-4">Categories</h2>
						{/* Categories list */}
						<div className="space-y-2">
							{categories.map(category => (
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
												{editingCategory === category.id ? (
													<input
														autoFocus
														className="text-sm font-medium text-gray-900 bg-transparent border-none focus:ring-0 flex-1"
														value={category.name}
														onClick={(e) => e.stopPropagation()}
														onChange={(e) => {
															const newCategories = [...categories];
															const index = newCategories.findIndex(c => c.id === category.id);
															newCategories[index] = { ...category, name: e.target.value };
															setCategories(newCategories);
														}}
														onBlur={() => {
															if (category.name.trim()) {
																handleCategoryNameUpdate(category.id, category.name);
															}
														}}
														onKeyDown={(e) => {
															if (e.key === 'Enter' && category.name.trim()) {
																handleCategoryNameUpdate(category.id, category.name);
															}
														}}
													/>
												) : (
													category.name
												)}
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

						{/* Instructions panel - hidden on mobile */}
						<div className="hidden md:block mt-6 p-4 bg-blue-50 rounded-lg">
							<h3 className="font-medium mb-2">How to use</h3>
							<ul className="text-sm text-gray-600 space-y-2">
								<li>• Click on a category to highlight relevant text</li>
								<li>• Hover on a category to select a new color</li>
								<li>• Click the edit icon to change category name</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Main content */}
				<div className="flex-1 overflow-auto bg-white">
					<div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
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