import { useState } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ReaderPage from "./pages/ReaderPage";
import ItemListPage from "./pages/ItemListPage";

function App() {
	const [currentPage, setCurrentPage] = useState("home");

	const renderPage = () => {
		switch (currentPage) {
			case "home":
				return <HomePage setCurrentPage={setCurrentPage} />;
			case "items":
				return <ItemListPage setCurrentPage={setCurrentPage} />;
			case "login":
				return <LoginPage setCurrentPage={setCurrentPage} />;
			case "register":
				return <RegisterPage setCurrentPage={setCurrentPage} />;
			case "reader":
				return <ReaderPage setCurrentPage={setCurrentPage} />;
			default:
				return <ItemListPage setCurrentPage={setCurrentPage} />;
		}
	};

	return <div>{renderPage()}</div>;
}

export default App;
