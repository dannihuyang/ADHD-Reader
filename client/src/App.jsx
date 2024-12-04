import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ItemListPage from './pages/ItemListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReaderPage from './pages/ReaderPage';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/items" element={<ItemListPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/reader/:documentId" element={<ReaderPage />} />
				<Route path="*" element={<Navigate to="/items" replace />} />
			</Routes>
		</Router>
	);
}

export default App;
