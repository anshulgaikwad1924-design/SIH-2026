import { redirect } from "next/navigation";
import { Package, ShieldAlert, History } from "lucide-react";

export default async function CustomerDashboard() {
  // Mock session for GitHub Pages static export
  const session = { user: { name: "Demo User", email: "demo@example.com", role: "CUSTOMER" } };

  if (!session || (session.user as any).role !== 'CUSTOMER') {
    redirect('/login');
  }

  // Mock Data for Customer History
  const history = [
    { id: '1', date: '2026-09-14', product: 'ABC Rice - 1 kg', score: 78, status: 'Needs Review' },
    { id: '2', date: '2026-09-10', product: 'XYZ Atta - 5 kg', score: 100, status: 'Likely Compliant' },
  ];

  return (
    <div className="container">
      <h1 className="title">Customer Portal</h1>
      <p className="subtitle">Welcome back, {session.user?.name}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%' }}>
            <History color="var(--color-info)" size={24} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>24</div>
            <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Total Scans</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%' }}>
            <ShieldAlert color="var(--color-danger)" size={24} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>1</div>
            <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Active Complaints</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Recent Scans</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Date</th>
                <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Product</th>
                <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Score</th>
                <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px' }}>{item.date}</td>
                  <td style={{ padding: '16px', fontWeight: 500 }}>{item.product}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ fontWeight: 600, color: item.score >= 90 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                      {item.score}/100
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span className={`badge ${item.score >= 90 ? 'badge-success' : 'badge-warning'}`}>{item.status}</span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <a href={`/scan/result?barcode=123456789012`} style={{ color: 'var(--color-secondary)', fontWeight: 500, fontSize: '14px' }}>View Report</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
