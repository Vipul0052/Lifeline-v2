"use client";
import { useState } from 'react';
import { signIn } from 'shared/authService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | undefined>();
	const [loading, setLoading] = useState(false);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const { error } = await signIn(email, password);
		setLoading(false);
		if (error) {
			setError(error);
			return;
		}
		router.push('/dashboard');
	};

	return (
		<div style={{ maxWidth: 360, margin: '80px auto', fontFamily: 'system-ui' }}>
			<h1>Login</h1>
			<form onSubmit={onSubmit}>
				<div style={{ marginBottom: 12 }}>
					<label>Email</label>
					<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%' }} />
				</div>
				<div style={{ marginBottom: 12 }}>
					<label>Password</label>
					<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%' }} />
				</div>
				{error && <p style={{ color: 'red' }}>{error}</p>}
				<button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
			</form>
			<p style={{ marginTop: 12 }}>No account? <Link href="/signup">Sign up</Link></p>
		</div>
	);
}

