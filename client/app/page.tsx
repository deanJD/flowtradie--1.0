// client/app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Welcome to FlowTradie</h1>
      <p>Your app is up and running!</p>
      <br />
      <Link href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
        Go to the Login Page
      </Link>
    </main>
  );
}