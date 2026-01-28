import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PlusCircle, AlertTriangle, Clock, CheckCircle, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { user } = useAuth();
    const { incidents } = useData();
    const navigate = useNavigate();

    // Dynamic stats
    const stats = {
        pending: incidents.filter(i => ['reported', 'assigned'].includes(i.status)).length,
        active: incidents.filter(i => i.status === 'in_progress').length,
        completed: incidents.filter(i => i.status === 'finalized').length
    };

    if (!user) return null;

    const WelcomeHeader = () => (
        <div style={{ marginBottom: '2rem' }}>
            <div style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                Parque Comercial Albán
            </div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Hola, {user?.full_name?.split(' ')[0] || 'Usuario'}
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </div>
    );

    // Local View
    if (user.role === 'local') {
        return (
            <div className="container animate-in">
                <WelcomeHeader />

                <div style={{ marginBottom: '3rem' }}>
                    <button
                        className="btn btn-primary"
                        style={{ padding: '2rem', fontSize: '1.25rem', width: '100%', borderRadius: 'var(--radius-lg)' }}
                        onClick={() => navigate('/incidents/new')}
                    >
                        <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            padding: '0.75rem',
                            borderRadius: '12px',
                            marginRight: '0.5rem',
                            display: 'flex'
                        }}>
                            <PlusCircle size={28} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 800 }}>Reportar Nueva Incidencia</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.9 }}>Aviso inmediato al equipo técnico</div>
                        </div>
                    </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Mis Incidencias Activas</h2>
                    <button className="btn btn-secondary" onClick={() => navigate('/incidents')} style={{ padding: '0.5rem 1rem' }}>Historial</button>
                </div>

                <div className="grid-2">
                    {incidents.filter(i => i.created_by === user.id && i.status !== 'finalized').length > 0 ? (
                        incidents
                            .filter(i => i.created_by === user.id && i.status !== 'finalized')
                            .slice(0, 4)
                            .map(inc => (
                                <div key={inc.id} className="card card-glow" onClick={() => navigate(`/incidents/${inc.id}`)} style={{ cursor: 'pointer', padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                                        <span className={`badge badge-${inc.priority === 'alta' ? 'high' : inc.priority === 'media' ? 'media' : 'baja'}`}>
                                            {inc.priority}
                                        </span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Clock size={14} /> {new Date(inc.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                                        {inc.description.length > 60 ? inc.description.substring(0, 60) + '...' : inc.description}
                                    </h3>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        color: 'var(--color-primary)',
                                        background: 'var(--color-primary-soft)',
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '8px',
                                        width: 'fit-content'
                                    }}>
                                        <div style={{ width: '6px', height: '6px', background: 'var(--color-primary)', borderRadius: '50%' }}></div>
                                        {inc.status === 'reported' ? 'REPORTADA' : inc.status === 'assigned' ? 'ASIGNADA' : 'EN CURSO'}
                                    </div>
                                </div>
                            ))
                    ) : (
                        <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)', background: '#f8fafc', border: '2px dashed #e2e8f0', boxShadow: 'none' }}>
                            <Package size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.15 }} />
                            <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '0.5rem' }}>Todo bajo control</h3>
                            <p>No tienes incidencias activas en este momento.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="container animate-in">
            <WelcomeHeader />

            <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
                <div className="stat-tile" style={{ borderLeft: '4px solid var(--color-danger)' }}>
                    <div className="stat-label">Pendientes</div>
                    <div className="stat-value" style={{ color: 'var(--color-danger)' }}>{stats.pending}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Acción requerida inmediata
                    </div>
                </div>
                <div className="stat-tile" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                    <div className="stat-label">En Progreso</div>
                    <div className="stat-value" style={{ color: 'var(--color-primary)' }}>{stats.active}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Técnicos trabajando
                    </div>
                </div>
                <div className="stat-tile" style={{ borderLeft: '4px solid var(--color-success)' }}>
                    <div className="stat-label">Finalizadas</div>
                    <div className="stat-value" style={{ color: 'var(--color-success)' }}>{stats.completed}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Este mes actual
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Requieren Atención</h2>
                <button className="btn btn-secondary" onClick={() => navigate('/incidents')} style={{ padding: '0.5rem 1rem' }}>Ver todas</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {incidents.filter(i => i.status === 'reported').length > 0 ? (
                    incidents
                        .filter(i => i.status === 'reported')
                        .slice(0, 5)
                        .map(inc => (
                            <div key={inc.id} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderLeft: '4px solid var(--color-danger)' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: '#fee2e2',
                                    borderRadius: '12px',
                                    color: '#b91c1c',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <AlertTriangle size={24} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b', marginBottom: '0.25rem' }}>
                                        {inc.type.toUpperCase()}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                        Reportado por <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{inc.profiles?.full_name || 'Local'}</span> • {new Date(inc.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span className={`badge badge-${inc.priority === 'alta' ? 'high' : inc.priority === 'media' ? 'media' : 'baja'}`}>
                                        {inc.priority}
                                    </span>
                                    <button
                                        className="btn btn-primary"
                                        style={{ fontSize: '0.85rem', padding: '0.625rem 1.25rem' }}
                                        onClick={() => navigate(`/incidents/${inc.id}`)}
                                    >
                                        Gestionar
                                    </button>
                                </div>
                            </div>
                        ))
                ) : (
                    <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', background: '#f8fafc', border: '2px dashed #e2e8f0', boxShadow: 'none' }}>
                        <div style={{ marginBottom: '1rem', opacity: 0.3 }}>
                            <CheckCircle size={48} style={{ margin: '0 auto' }} />
                        </div>
                        <p style={{ fontWeight: 600 }}>Todas las incidencias están siendo gestionadas.</p>
                        <p style={{ fontSize: '0.85rem' }}>Buen trabajo, equipo de mantenimiento.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
