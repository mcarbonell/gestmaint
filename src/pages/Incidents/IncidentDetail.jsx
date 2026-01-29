import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { supabase } from '../../lib/supabaseClient';
import { ArrowLeft, Send, Calendar, User, Clock, FileText, Image as ImageIcon, Download } from 'lucide-react';

export default function IncidentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { incidents, updateIncident } = useData();
    const { user } = useAuth();

    const incident = incidents.find(i => i.id === id);
    const [comment, setComment] = useState('');

    if (!incident) return <div className="container">Incidencia no encontrada</div>;

    const handleAddComment = (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        updateIncident(incident.id, {}, user, comment); // Using the generic update to add history
        setComment('');
    };

    const handleStatusChange = (newStatus) => {
        updateIncident(incident.id, { status: newStatus }, user, `Cambio de estado a ${newStatus}`);
    };

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <button
                onClick={() => navigate(-1)}
                className="btn btn-secondary"
                style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}
            >
                <ArrowLeft size={16} /> Volver
            </button>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                        <span className="badge" style={{ marginBottom: '0.5rem', display: 'inline-block', backgroundColor: '#e2e8f0', color: '#475569' }}>
                            #{incident.id}
                        </span>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{incident.type.toUpperCase()}</h1>
                    </div>
                    <span className="badge" style={{
                        fontSize: '1rem',
                        backgroundColor: incident.status === 'reported' ? '#fef3c7' : '#dbeafe',
                        color: incident.status === 'reported' ? '#92400e' : '#1e40af'
                    }}>
                        {incident.status.toUpperCase()}
                    </span>
                </div>

                {/* Share Action */}
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <a
                        href={`https://wa.me/?text=${encodeURIComponent(`Hola, hay una incidencia: ${incident.type} - ${incident.description}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{ color: '#25D366', borderColor: '#25D366', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Send size={16} /> Compartir por WhatsApp
                    </a>
                </div>

                <div className="grid-2 incident-meta-grid" style={{ marginBottom: '1.5rem', gap: '2rem' }}>
                    <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Reportado por</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                            <User size={16} /> {incident.profiles?.full_name || 'Desconocido'}
                        </div>
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Fecha</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                            <ArrowLeft size={16} /> {new Date(incident.created_at).toLocaleString()}
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Descripción</h3>
                    <p style={{ lineHeight: 1.6, color: '#444' }}>{incident.description}</p>
                </div>

                {incident.files && incident.files.length > 0 && (
                    <div style={{ marginBottom: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={18} /> Adjuntos ({incident.files.length})
                        </h3>
                        <div className="file-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                            {incident.files.map((file, index) => {
                                const { data: { publicUrl } } = supabase.storage.from('incidents').getPublicUrl(file.path);
                                const isImage = file.type?.startsWith('image/');

                                return (
                                    <div key={index} style={{
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '0.5rem',
                                        overflow: 'hidden',
                                        background: '#f8fafc'
                                    }}>
                                        {isImage ? (
                                            <div style={{ height: '120px', overflow: 'hidden' }}>
                                                <img
                                                    src={publicUrl}
                                                    alt={file.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </div>
                                        ) : (
                                            <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', color: '#64748b' }}>
                                                <FileText size={40} />
                                            </div>
                                        )}
                                        <div style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '0.5rem' }}>
                                                {file.name}
                                            </span>
                                            <a
                                                href={publicUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-secondary"
                                                style={{ padding: '0.25rem', borderRadius: '4px' }}
                                                title="Descargar"
                                            >
                                                <Download size={14} />
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Controller Actions */}
                {user.role === 'controller' && (
                    <div className="status-actions" style={{ borderTop: '1px solid #eee', paddingTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, alignSelf: 'center' }}>Cambiar Estado:</span>
                        <button className="btn btn-secondary" onClick={() => handleStatusChange('in_progress')}>En Progreso</button>
                        <button className="btn btn-secondary" onClick={() => handleStatusChange('finalized')}>Finalizar</button>
                        <button className="btn btn-secondary" style={{ color: '#ef4444', borderColor: '#fee2e2' }} onClick={() => handleStatusChange('rejected')}>Descartar</button>
                    </div>
                )}
            </div>

            <div className="card">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={20} /> Historial y Comentarios
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                    {incident.history?.map((log, index) => (
                        <div key={index} className="history-item" style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.8rem', fontWeight: 700, color: '#64748b',
                                flexShrink: 0
                            }}>
                                {log.user?.charAt(0) || 'S'}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', flexWrap: 'wrap', gap: '0.25rem' }}>
                                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{log.user}</span>
                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{new Date(log.date).toLocaleString()}</span>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.95rem', wordBreak: 'break-word' }}>
                                    {log.details || log.action}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleAddComment} className="comment-form" style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Añadir comentario o actualización..."
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <button type="submit" className="btn btn-primary" disabled={!comment.trim()}>
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}
