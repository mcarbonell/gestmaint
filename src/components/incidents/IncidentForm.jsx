import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { Upload, Save, X, Paperclip, FileText, Image as ImageIcon } from 'lucide-react';

export default function IncidentForm() {
    const { addIncident } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [formData, setFormData] = useState({
        type: 'electricidad',
        priority: 'media',
        description: '',
    });

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const uploadedFiles = [];

            // 1. Upload files to Supabase Storage
            for (const file of selectedFiles) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
                const filePath = `${user.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('incidents')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // Create a record for this file
                uploadedFiles.push({
                    name: file.name,
                    path: filePath,
                    type: file.type
                });
            }

            // 2. Add incident with file references
            await addIncident({ ...formData, files: uploadedFiles }, user);

            navigate('/incidents');
        } catch (err) {
            console.error('Error creating incident:', err);
            alert('Error al guardar la incidencia: ' + (err.message || 'Error desconocido'));
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        'Electricidad', 'Fontanería', 'Albañilería', 'Climatización',
        'Cerrajería', 'Limpieza', 'Otros'
    ];

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Nueva Incidencia</h1>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="card">
                <div style={{
                    padding: '0.75rem 1rem',
                    background: '#f0f9ff',
                    border: '1px solid #e0f2fe',
                    borderRadius: '0.75rem',
                    marginBottom: '1.5rem',
                    fontSize: '0.85rem',
                    color: '#0369a1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <div style={{ width: '8px', height: '8px', background: '#0ea5e9', borderRadius: '50%' }}></div>
                    <span>Al registrar la incidencia, se enviará una notificación automática al servicio técnico.</span>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Tipo de Incidencia</label>
                    <select
                        value={formData.type}
                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                        required
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Prioridad</label>
                    <div className="grid-3">
                        {[
                            { value: 'baja', label: 'Baja', color: '#10b981', bg: '#d1fae5' },
                            { value: 'media', label: 'Media', color: '#d97706', bg: '#fef3c7' },
                            { value: 'alta', label: 'Alta', color: '#b91c1c', bg: '#fee2e2' }
                        ].map((p) => (
                            <label
                                key={p.value}
                                style={{
                                    cursor: 'pointer',
                                    padding: '1rem',
                                    border: formData.priority === p.value ? `2px solid ${p.color}` : '1px solid #e2e8f0',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: p.bg,
                                    color: p.color,
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    opacity: formData.priority === p.value ? 1 : 0.6
                                }}
                            >
                                <input
                                    type="radio"
                                    name="priority"
                                    value={p.value}
                                    checked={formData.priority === p.value}
                                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                    style={{ display: 'none' }}
                                />
                                {p.label}
                            </label>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Descripción del Problema</label>
                    <textarea
                        rows="5"
                        placeholder="Describa el problema con detalle..."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Adjuntar Fotos / Documentos</label>

                    <div
                        onClick={() => document.getElementById('fileInput').click()}
                        style={{
                            border: '2px dashed #cbd5e1',
                            borderRadius: 'var(--radius-md)',
                            padding: '2rem',
                            textAlign: 'center',
                            backgroundColor: '#f8fafc',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            marginBottom: '1rem'
                        }}
                    >
                        <Upload size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                        <p style={{ fontWeight: 500 }}>Haga clic para subir archivos</p>
                        <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Máximo 5MB por archivo</p>
                        <input
                            id="fileInput"
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>

                    {selectedFiles.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {selectedFiles.map((file, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem',
                                    background: 'white',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '0.5rem'
                                }}>
                                    {file.type.startsWith('image/') ? <ImageIcon size={18} /> : <FileText size={18} />}
                                    <span style={{ flex: 1, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {file.name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-full"
                    disabled={loading}
                    style={{ opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? 'Enviando...' : (
                        <>
                            <Save size={20} />
                            Registrar Incidencia
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
