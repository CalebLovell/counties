import { DataPanel } from "~/components/DataPanel";
import { EventList } from "~/components/EventList";
import { Header } from "~/components/Header";
import { Key } from "~/components/Key";
import { NewMap } from "~/components/NewMap";
import { Sidebar } from "~/components/Sidebar";

export default function App() {
	return (
		<div className="flex h-screen flex-col items-center bg-radial-at-br from-green-50 to-blue-50">
			<Header />
			<main className="flex h-full w-full max-w-3xl flex-1 flex-col items-center justify-center">
				<div className="relative h-content w-full">
					<NewMap />
					<DataPanel />
					<Key />
				</div>
			</main>
			<EventList />
			<Sidebar />
		</div>
	);
}
