'use client';
import { useEffect, useState } from 'react';
import { Database, Clock, ChevronRight, Search, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('smartpack_history') || '[]');
      setHistory(data);
    } catch(e) {
      console.error(e);
    }
  }, []);

  const clearHistory = () => {
    if(confirm('Are you sure you want to clear all local scan history?')) {
      localStorage.removeItem('smartpack_history');
      setHistory([]);
    }
  };

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="title" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Database size={28} color="var(--color-primary)" />
            Scan Database History
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>View all past product scans and compliance reports.</p>
        </div>
        
        {history.length > 0 && (
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }} onClick={clearHistory}>
            <Trash2 size={16} /> Clear History
          </button>
        )}
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input 
              type="text" 
              placeholder="Search past scans by product name..." 
              style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px' }}
            />
          </div>
        </div>

        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-muted)' }}>
            <Clock size={48} opacity={0.2} style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text)' }}>No Scans Yet</h3>
            <p>Your database history is empty. Go scan some products!</p>
            <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => router.push('/')}>
              Start Scanning
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {history.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', transition: 'background 0.2s', cursor: 'pointer' }} onClick={() => { if(item.scanType === 'ocr') { router.push('/scan/result?type=ocr'); } else if(item.barcode) { router.push(`/scan/result?barcode=${item.barcode}`); } else { alert('Barcode missing from old history item. Please clear history.'); } }} onMouseOver={(e) => e.currentTarget.style.background = '#f3f4f6'} onMouseOut={(e) => e.currentTarget.style.background = '#f9fafb'}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `conic-gradient(var(--color-${item.status === 'VERIFIED' ? 'success' : item.status === 'NON_COMPLIANT' ? 'danger' : 'warning'}) ${item.score}%, #e5e7eb ${item.score}%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--color-text)' }}>
                      {item.score}
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{item.productName}</h4>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--color-text-muted)', alignItems: 'center' }}>
                      <span>{item.date}</span>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#d1d5db' }}></span>
                      <span style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px' }}>{item.scanType} Scan</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span className={`badge badge-${item.status === 'VERIFIED' ? 'success' : item.status === 'NON_COMPLIANT' ? 'danger' : 'warning'}`}>
                    {item.status}
                  </span>
                  <ChevronRight size={20} color="var(--color-text-muted)" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
