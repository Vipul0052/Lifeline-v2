"use client";
import { useEffect, useState } from 'react';
import { getUser, signOut } from 'shared/authService';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [name, setName] = useState<string>('');
	const [email, setEmail] = useState<string>('');

	useEffect(() => {
		(async () => {
			const user = await getUser();
			if (!user) {
				router.replace('/login');
				return;
			}
			setName((user.user_metadata as any)?.name || 'User');
			setEmail(user.email || '');
			setLoading(false);
		})();
	}, [router]);

	if (loading) return <p style={{ padding: 24 }}>Loading...</p>;

	return (
		<div style={{ maxWidth: 720, margin: '40px auto', fontFamily: 'system-ui' }}>
			<h1>Welcome, {name}</h1>
			<p>{email}</p>
			<button onClick={async () => { await signOut(); router.replace('/login'); }}>Logout</button>
		</div>
	);
}

