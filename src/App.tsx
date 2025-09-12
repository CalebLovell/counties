import { DataPanel } from '~/components/DataPanel';
import { Header } from '~/components/Header';
import { Key } from '~/components/Key';
import { NewMap } from '~/components/NewMap';
import { Sidebar } from '~/components/Sidebar';

export default function App() {
	return (
		<div className='flex h-screen flex-col items-center bg-radial-at-br from-red-100 via-orange-100 to-blue-100'>
			<Header />
			<main className='flex h-full w-full max-w-3xl flex-1 flex-col items-center justify-center'>
				<div className='relative h-content w-full'>
					<NewMap />
					<DataPanel />
					<Key />
				</div>
			</main>
			<Sidebar />
		</div>
	);
}
