import { useState, useEffect } from "react";
import {
	Plus,
	Settings,
	LogOut,
	BookOpen,
	Trash2,
	X,
	Clock,
} from "lucide-react";
import { CATEGORY_COLORS } from "../config/constants";
import { useNavigate } from 'react-router-dom';

export default function ItemListPage() {
	const navigate = useNavigate();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [documents, setDocuments] = useState([]);
	const [showNewDocModal, setShowNewDocModal] = useState(false);
	const [newDocument, setNewDocument] = useState({ title: "", content: "" });
	const [isCreating, setIsCreating] = useState(false);
	const [documentCategories, setDocumentCategories] = useState([
		{ name: "", color: CATEGORY_COLORS.FIRST },
		{ name: "", color: CATEGORY_COLORS.SECOND },
		{ name: "", color: CATEGORY_COLORS.THIRD }
	]);
	const [isAutoGenerating, setIsAutoGenerating] = useState(true);

	useEffect(() => {
		fetch("http://localhost:3001/api/auth/me", {
			credentials: "include", // include cookies, authorization headers
		})
			.then((res) => (res.ok ? res.json() : null))
			.then((data) => {
				if (data) {
					setIsLoggedIn(true);
					setUser(data);
					fetchDocuments();
				}
			})
			.catch(() => setIsLoggedIn(false)) // if error, set isLoggedIn to false
			.finally(() => setLoading(false));
	}, []); 

	const fetchDocuments = async () => {
		try {
			const response = await fetch("http://localhost:3001/api/documents", {
				credentials: "include",
			});
			if (response.ok) { // status 200-299
				const data = await response.json();
				setDocuments(data);
			}
		} catch (error) {
			console.error("Error fetching documents:", error);
		}
	};

	const handleCreateDocument = async (e) => {
		e.preventDefault();
		setIsCreating(true);
		try {
			const response = await fetch("http://localhost:3001/api/documents", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					...newDocument,
					autoGenerateCategories: isAutoGenerating,
					categories: isAutoGenerating ? null : documentCategories
				}),
			});

			if (response.ok) {
				const data = await response.json();
				setDocuments([...documents, data.document]);
				setNewDocument({ title: "", content: "" });
				setDocumentCategories([
					{ name: "", color: CATEGORY_COLORS.FIRST },
					{ name: "", color: CATEGORY_COLORS.SECOND },
					{ name: "", color: CATEGORY_COLORS.THIRD }
				]);
				setShowNewDocModal(false);
			}
		} catch (error) {
			console.error("Error creating document:", error);
		} finally {
			setIsCreating(false);
		}
	};

	const handleLogout = async () => {
		await fetch("http://localhost:3001/api/auth/logout", {
			method: "POST",
			credentials: "include",
		});
		setIsLoggedIn(false);
		setUser(null);
		navigate('/');
	};

	const handleDeleteDocument = async (id, e) => {
		e.stopPropagation();

		try {
			if (!window.confirm("Are you sure you want to delete this document?")) {
				return; // if user clicks cancel, do nothing
			}
			const response = await fetch(
				`http://localhost:3001/api/documents/${id}`,
				{
					method: "DELETE",
					credentials: "include",
				}
			);
			const responseData = await response.json();
			if (response.ok) {
				setDocuments(documents.filter((doc) => doc.id !== id));
			} else {
				throw new Error(responseData.error || "Failed to delete document");
			}
		} catch (error) {
			console.error("Error deleting document:", error);
			alert(`Failed to delete document: ${error.message}`);
		}
	};

	const handleDocumentClick = (documentId) => {
		navigate(`/reader/${documentId}`);
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="w-8 h-8 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin" />
			</div>
		);
	}

	if (!isLoggedIn) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="bg-white shadow-md rounded-lg p-8 w-96 text-center">
					<h1 className="text-2xl font-bold mb-4">ADHD Reader</h1>
					<p className="text-gray-600 mb-6">
						Login or register to access your reading materials
					</p>
					<div className="flex gap-4">
						<button
							onClick={() => navigate('/login')}
							className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
						>
							Login
						</button>
						<button
							onClick={() => navigate('/register')}
							className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
						>
							Register
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white border-b border-gray-200">
				<div className="max-w-5xl mx-auto px-8 py-4 flex justify-between items-center">
					<h1 className="text-xl font-semibold">ADHD Reader</h1>
					<div className="flex items-center gap-6">
						<span className="text-gray-600">Welcome, {user?.name}</span>
						<button
							onClick={handleLogout}
							className="p-2 text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
							aria-label="Logout"
						>
							<LogOut size={20} />
						</button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-5xl mx-auto px-8 py-8">
				<div className="flex justify-between items-center mb-8">
					<div>
						<h2 className="text-2xl font-bold">My Documents</h2>
						<p className="text-gray-600 mt-1">Manage your reading materials</p>
					</div>
					<button
						onClick={() => setShowNewDocModal(true)}
						className="flex items-center gap-2 text-white px-4 py-2 rounded-lg btn-gradient"
					>
						<Plus size={20} />
						New Document
					</button>
				</div>

				{/* Documents Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{documents.map((doc) => (
						<div
							key={doc.id}
							className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all group"
						>
							<div className="flex justify-between items-start mb-4">
								<h3 className="text-lg font-medium truncate">
									{doc.title || "Untitled Document"}
								</h3>
								<button
									onClick={(e) => handleDeleteDocument(doc.id, e)}
									className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-gray-100"
									aria-label="Delete document"
								>
									<Trash2 size={18} />
								</button>
							</div>
							<p className="text-gray-600 text-sm line-clamp-2 mb-4">
								{doc.content}
							</p>
							<div className="flex justify-between items-center">
								<div className="flex items-center text-gray-500 text-sm">
									<Clock size={14} className="mr-1" />
									{new Date(doc.createdAt).toLocaleDateString()}
								</div>
								<button
									onClick={() => handleDocumentClick(doc.id)}
									className="flex items-center gap-1.5 text-white px-3 py-1.5 rounded-lg btn-gradient text-sm"
								>
									<BookOpen size={16} />
									Read
								</button>
							</div>
						</div>
					))}
				</div>
			</main>

			{/* New Document Modal */}
			{showNewDocModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
					<div className="bg-white rounded-xl shadow-xl w-full max-w-xl animate-in">
						<div className="p-6">
							<div className="flex justify-between items-center mb-6">
								<h3 className="text-xl font-semibold">Create New Document</h3>
								<button
									onClick={() => setShowNewDocModal(false)}
									disabled={isCreating}
									className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
								>
									<X size={20} />
								</button>
							</div>

							<form onSubmit={handleCreateDocument}>
								<div className="mb-4">
									<input
										type="text"
										value={newDocument.title}
										onChange={(e) =>
											setNewDocument({ ...newDocument, title: e.target.value })
										}
										placeholder="Enter a title or let AI generate one"
										className="w-full px-4 py-2 text-lg border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
										disabled={isCreating}
										autoFocus
									/>
								</div>

								<div className="mb-6">
									<textarea
										value={newDocument.content}
										onChange={(e) =>
											setNewDocument({
												...newDocument,
												content: e.target.value,
											})
										}
										placeholder="Start typing or paste your content here..."
										className="w-full px-4 py-3 h-64 text-gray-700 border border-gray-200 rounded-lg resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
										disabled={isCreating}
									/>
								</div>
								    {/* Add Categories Selection */}
								<div className="mb-4">
									<div className="flex justify-between items-center mb-2">
										<label className="block text-sm font-medium text-gray-700">
											Categories
										</label>
										<button
											type="button"
											onClick={() => setIsAutoGenerating(!isAutoGenerating)}
											className="text-sm text-blue-600 hover:text-blue-700"
										>
											{isAutoGenerating ? "Enter manually" : "Auto-generate"}
										</button>
									</div>
									<div className="flex gap-2">
										{documentCategories.map((category, index) => (
											<div 
												key={index}
												className="flex-1 p-3 rounded-lg border transition-all"
												style={{
													backgroundColor: category.color + '20',
													borderColor: category.color,
													borderWidth: '2px'
												}}
											>
												{isAutoGenerating ? (
													// Read-only preview
													<div className="flex items-center gap-2">
														<div 
															className="w-3 h-3 rounded-full"
															style={{ backgroundColor: category.color }}
														/>
														<span className="text-sm font-medium text-gray-700">
															{category.name || `Generated ${index + 1}`}
														</span>
													</div>
												) : (
													// Editable input
													<input
														type="text"
														value={category.name}
														onChange={(e) => {
															const newCategories = [...documentCategories];
															newCategories[index].name = e.target.value;
															setDocumentCategories(newCategories);
														}}
														placeholder={`Category ${index + 1}`}
														className="w-full bg-transparent border-none p-0 text-sm font-medium text-gray-700 focus:ring-0"
													/>
												)}
											</div>
										))}
									</div>
									<p className="mt-1 text-sm text-gray-500">
										{isAutoGenerating 
											? "Categories will be automatically generated based on your content" 
											: "Enter custom categories or switch to auto-generate"}
									</p>
								</div>
								<div className="flex justify-end gap-3">
									<button
										type="button"
										onClick={() => setShowNewDocModal(false)}
										className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
										disabled={isCreating}
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={isCreating}
										className={`px-4 py-2 rounded-lg btn-gradient flex items-center gap-2 text-white ${
											isCreating ? "opacity-70 cursor-not-allowed" : ""
										}`}
									>
										{isCreating ? (
											<>
												<div className="w-4 h-4 border-2 border-t-white border-white/20 rounded-full animate-spin" />
												Processing...
											</>
										) : (
											"Create Document"
										)}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
