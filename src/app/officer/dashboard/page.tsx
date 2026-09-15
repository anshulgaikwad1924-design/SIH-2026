import { redirect } from "next/navigation";
import { Activity, CheckCircle, FileWarning } from "lucide-react";

export default async function OfficerDashboard() {
  // Mock session for GitHub Pages static export
  const session = { user: { name: "Demo Officer", email: "officer@example.com", role: "OFFICER" } };

  if (!session || (session.user as any).role !== 'OFFICER') {
    redirect('/login');
  }

  // Mock Data for Officer Queue
  const queue = [
    { id: '101', date: '2026-09-14 10:30', product: 'ABC Rice - 1 kg', type: 'System Flag', score: 78, status: 'Requires Verification' },
    { id: '102', date: '2026-09-14 09:15', product: 'XYZ Atta - 5 kg', type: 'Customer Complaint', score: null, status: 'New Complaint' },
  ];

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="title" style={{ marginBottom: '8px' }}>Officer Workspace</h1>
          <p className="subtitle" style={{ marginBottom: 0 }}>Authorized Portal for Legal Metrology Verification</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-success)' }}></div>
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-muted)' }}>Inspector: {session.user?.name}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--color-warning)' }}>
          <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '50%' }}>
            <Activity color="var(--color-warning)" size={24} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>12</div>
            <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Pending Verifications</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--color-danger)' }}>
          <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%' }}>
            <FileWarning color="var(--color-danger)" size={24} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>3</div>
            <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>New Complaints</div>
          </div>
        </div>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--color-success)' }}>
          <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%' }}>
            <CheckCircle color="var(--color-success)" size={24} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>145</div>
            <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Resolved This Month</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Action Queue</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Time</th>
                <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Product</th>
                <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Trigger Type</th>
                <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {queue.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px' }}>{item.date}</td>
                  <td style={{ padding: '16px', fontWeight: 500 }}>{item.product}</td>
                  <td style={{ padding: '16px' }}>{item.type}</td>
                  <td style={{ padding: '16px' }}>
                    <span className="badge badge-warning">{item.status}</span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <a href={`/scan/result?barcode=123456789012`} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>Inspect</a>
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
