import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { Providers } from './providers';
import Chatbot from '@/components/Chatbot';

export const metadata: Metadata = {
  title: 'SmartPack - Legal Metrology Compliance',
  description: 'Automated Screening and Compliance for Packaged Commodities',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <nav style={{ background: 'var(--color-primary)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
              <span style={{ color: 'var(--color-secondary)' }}>Smart</span>Pack
            </Link>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <Link href="/" style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>Scan</Link>
              <Link href="/history" style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>History</Link>
              <Link href="/customer/dashboard" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 500 }}>Customer Portal</Link>
              <Link href="/officer/dashboard" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 500 }}>Officer Portal</Link>
              <Link href="/customer/dashboard" className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>Login (Mock)</Link>
            </div>
          </nav>
          <main className="main-content">
            {children}
          </main>
          <Chatbot />
        </Providers>
      </body>
    </html>
  );
}
