import { useState } from 'react';
import './App.css'

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [analysis, setAnalysis] = useState<{ tempo?: number; chords?: string[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('Uploading and analyzing...');
    setAnalysis(null);

    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setAnalysis({
        tempo: data.tempo,
        chords: data.chords,
      });
      setStatus('Analysis complete!');
    } catch {
      setStatus('Error uploading or analyzing file.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">AI Band: Upload & Analyze Your Song</h1>
      <input
        type="file"
        accept="audio/mp3"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={!file}
      >
        Upload & Analyze
      </button>
      <div className="mt-4 text-gray-700">{status}</div>
      {analysis && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Analysis Result</h2>
          <div>Tempo: <span className="font-mono">{analysis.tempo ?? 'N/A'} BPM</span></div>
          <div>
            First Chords:{" "}
            <span className="font-mono">
              {analysis.chords && analysis.chords.length > 0
                ? analysis.chords.join(', ')
                : 'N/A'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
