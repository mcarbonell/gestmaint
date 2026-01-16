import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Upload, Save, X } from 'lucide-react';

export default function IncidentForm() {
    const { addIncident } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: 'electricidad',
        priority: 'media',
        description: '',
        files: []
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            addIncident(formData, user);
            setLoading(false);
            navigate('/incidents'); // Or dashboard
        }, 800);
    };

    const categories = [
        'Electricidad', 'Fontanería', 'Albañilería', 'Climatización',
        'Cerrajería', 'Limpieza', 'Otros'
    ];

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Nueva Incidencia</h1>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="card">
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
                        style={{
                            border: '2px dashed #cbd5e1',
                            borderRadius: 'var(--radius-md)',
                            padding: '2rem',
                            textAlign: 'center',
                            backgroundColor: '#f8fafc',
                            color: 'var(--text-muted)',
                            cursor: 'pointer'
                        }}
                    >
                        <Upload size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                        <p>Haga clic para subir archivos</p>
                        <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>(Simulación)</p>
                    </div>
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
