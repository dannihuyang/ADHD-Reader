// src/pages/SettingsPage.jsx
import { useState } from "react";

export default function SettingsPage() {
	const [timerDuration, setTimerDuration] = useState(25);
	const [breakDuration, setBreakDuration] = useState(5);
	const [autoplay, setAutoplay] = useState(false);
	const [speechRate, setSpeechRate] = useState(1.0);

	const handleSaveSettings = (e) => {
		e.preventDefault();
		// Will implement API call later
		console.log("Settings saved:", {
			timerDuration,
			breakDuration,
			autoplay,
			speechRate,
		});
	};

	return (
		<div className="min-h-screen p-6 bg-gray-50">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-2xl font-bold mb-6">Settings</h1>

				<form onSubmit={handleSaveSettings} className="space-y-6">
					{/* Timer Settings */}
					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Timer Preferences</h2>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Focus Duration (minutes)
								</label>
								<input
									type="number"
									value={timerDuration}
									onChange={(e) => setTimerDuration(Number(e.target.value))}
									className="mt-1 block w-full rounded-md border p-2"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Break Duration (minutes)
								</label>
								<input
									type="number"
									value={breakDuration}
									onChange={(e) => setBreakDuration(Number(e.target.value))}
									className="mt-1 block w-full rounded-md border p-2"
								/>
							</div>
						</div>
					</div>

					{/* Audio Settings */}
					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Audio Settings</h2>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Speech Rate
								</label>
								<select
									value={speechRate}
									onChange={(e) => setSpeechRate(Number(e.target.value))}
									className="mt-1 block w-full rounded-md border p-2"
								>
									<option value={0.5}>0.5x</option>
									<option value={1.0}>1.0x</option>
									<option value={1.5}>1.5x</option>
									<option value={2.0}>2.0x</option>
								</select>
							</div>
							<div className="flex items-center">
								<input
									type="checkbox"
									id="autoplay"
									checked={autoplay}
									onChange={(e) => setAutoplay(e.target.checked)}
									className="h-4 w-4 rounded border-gray-300"
								/>
								<label
									htmlFor="autoplay"
									className="ml-2 block text-sm text-gray-900"
								>
									Auto-play audio on highlight
								</label>
							</div>
						</div>
					</div>

					{/* Save Button */}
					<button
						type="submit"
						className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700"
					>
						Save Settings
					</button>
				</form>
			</div>
		</div>
	);
}
