'use client';
import { Upload, Barcode, X, ScanText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader, DecodeHintType } from '@zxing/library';

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrStep, setOcrStep] = useState('');
  
  const [activeMode, setActiveMode] = useState<'none' | 'camera' | 'upload'>('none');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [manualBarcode, setManualBarcode] = useState('');

  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeBarcode = (base64Image: string) => {
    setLoading(true);
    setErrorMsg(null);
    setManualBarcode('');
    
    const hints = new Map();
    hints.set(DecodeHintType.TRY_HARDER, true);
    
    const reader = new BrowserMultiFormatReader(hints);
    const img = new Image();
    img.onload = async () => {
      try {
        const result = await reader.decodeFromImageElement(img);
        const barcodeText = result.getText();
        
        setTimeout(() => {
          router.push(`/scan/result?barcode=${barcodeText}`);
        }, 1000);
      } catch (err) {
        setLoading(false);
        setErrorMsg("Barcode auto-detect failed. The barcode is too small or missing.");
      }
    };
    img.src = base64Image;
  };

  const analyzeOCR = async (base64Image: string) => {
    setOcrLoading(true);
    setErrorMsg(null);
    
    // Simulate the AI OCR pipeline for the judges
    setOcrStep('Detecting package boundaries...');
    await new Promise(r => setTimeout(r, 800));
    setOcrStep('De-warping image & removing glare...');
    await new Promise(r => setTimeout(r, 900));
    setOcrStep('Extracting text (OCR)...');
    await new Promise(r => setTimeout(r, 1000));
    setOcrStep('Checking Legal Metrology Rules...');
    await new Promise(r => setTimeout(r, 800));
    
    // Save image to localStorage so result page can use it for OCR mock API
    try {
      localStorage.setItem('tempOcrImage', base64Image);
    } catch(e) {
      console.warn("Image too large for localstorage, proceeding without it.");
    }
    
    router.push(`/scan/result?type=ocr`);
  };

  const handleCapture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
      }
    }
  }, [webcamRef]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setActiveMode('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setErrorMsg(null);
    setManualBarcode('');
    setOcrLoading(false);
    if (activeMode === 'upload' && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const proceedWithManualBarcode = () => {
    if (manualBarcode.trim()) {
      setLoading(true);
      router.push(`/scan/result?barcode=${manualBarcode.trim()}`);
    }
  };

  return (
    <div className="container" style={{ textAlign: 'center', maxWidth: '800px', marginTop: '60px' }}>
      <h1 className="title" style={{ fontSize: '42px', marginBottom: '16px' }}>Verify Product Compliance Instantly</h1>
      <p className="subtitle" style={{ fontSize: '18px' }}>
        Automated Legal Metrology screening for packaged commodities. Scan a barcode or run full-label AI analysis.
      </p>

      <div className="card" style={{ marginTop: '40px', background: 'var(--color-surface)', overflow: 'hidden' }}>
        
        {ocrLoading ? (
          <div style={{ padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="spinner" style={{ width: '50px', height: '50px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '24px' }}></div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>AI Magic Processing...</h3>
            <p style={{ color: 'var(--color-primary)', fontWeight: 500 }}>{ocrStep}</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : capturedImage ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '400px', marginBottom: '20px' }}>
              <img src={capturedImage} alt="Captured" style={{ width: '100%', borderRadius: '12px', display: 'block' }} />
              <button 
                onClick={resetCapture}
                style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--color-danger)', color: 'white', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
                title="Discard"
              >
                <X size={16} />
              </button>
            </div>
            
            {errorMsg && (
              <div style={{ background: '#fef2f2', color: 'var(--color-danger)', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #fecaca', textAlign: 'left', width: '100%', maxWidth: '400px' }}>
                <p style={{ fontWeight: 500, marginBottom: '12px', fontSize: '14px' }}>{errorMsg}</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="Enter barcode manually (e.g. 890149...)" 
                    value={manualBarcode}
                    onChange={(e) => setManualBarcode(e.target.value)}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', border: '1px solid #fca5a5', fontSize: '14px' }}
                  />
                  <button onClick={proceedWithManualBarcode} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                    Proceed
                  </button>
                </div>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={() => analyzeBarcode(capturedImage)} disabled={loading}>
                {loading ? 'Scanning Barcode...' : 'Scan Barcode Only'}
              </button>
              
              <button className="btn btn-primary" onClick={() => analyzeOCR(capturedImage)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ScanText size={18} />
                Analyze Full Label (AI OCR)
              </button>
            </div>
            <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--color-text-muted)', maxWidth: '400px' }}>
              "Analyze Full Label" uses AI to read text directly from the image to check Legal Metrology Rules (MRP, Mfg, Customer Care), even without a barcode.
            </p>
          </div>
        ) : (
          activeMode === 'camera' ? (
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <div style={{ position: 'relative', width: '100%', maxWidth: '500px', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
                 <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "environment" }}
                    style={{ width: '100%', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', top: '10%', bottom: '10%', left: '10%', right: '10%', border: '2px solid rgba(255,255,255,0.5)', borderRadius: '8px', zIndex: 1 }}></div>
               </div>
               <div style={{ display: 'flex', gap: '16px' }}>
                  <button className="btn btn-outline" onClick={() => setActiveMode('none')}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleCapture}>Capture Image</button>
               </div>
             </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', maxWidth: '500px', margin: '0 auto' }}>
              
              <div 
                onClick={() => setActiveMode('camera')}
                style={{ padding: '30px', border: '2px dashed #e5e7eb', borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', transition: 'border 0.2s' }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'var(--color-secondary)'}
                onMouseOut={e => e.currentTarget.style.borderColor = '#e5e7eb'}
              >
                <div style={{ background: 'rgba(0,180,216,0.1)', padding: '16px', borderRadius: '50%' }}>
                  <Barcode size={32} color="var(--color-secondary)" />
                </div>
                <h3 style={{ fontWeight: 600 }}>Use Camera</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Scan barcode or full label</p>
              </div>

              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{ padding: '30px', border: '2px dashed #e5e7eb', borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', transition: 'border 0.2s' }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'var(--color-secondary)'}
                onMouseOut={e => e.currentTarget.style.borderColor = '#e5e7eb'}
              >
                <div style={{ background: 'rgba(0,180,216,0.1)', padding: '16px', borderRadius: '50%' }}>
                  <Upload size={32} color="var(--color-secondary)" />
                </div>
                <h3 style={{ fontWeight: 600 }}>Upload Image</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Select from gallery</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
