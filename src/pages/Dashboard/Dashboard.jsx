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
            <div className="container">
                <WelcomeHeader />

                <div style={{ marginBottom: '2rem' }}>
                    <button
                        className="btn btn-primary btn-full"
                        style={{ padding: '1.5rem', fontSize: '1.1rem' }}
                        onClick={() => navigate('/incidents/new')}
                    >
                        <PlusCircle size={24} />
                        Reportar Nueva Incidencia
                    </button>
                </div>

                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Mis Incidencias Activas</h2>
                <div className="grid-2">
                    {incidents.filter(i => i.created_by === user.id && i.status !== 'finalized').length > 0 ? (
                        incidents
                            .filter(i => i.created_by === user.id && i.status !== 'finalized')
                            .slice(0, 4)
                            .map(inc => (
                                <div key={inc.id} className="card" onClick={() => navigate(`/incidents/${inc.id}`)} style={{ cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span className={`badge badge-${inc.priority}`}>{inc.priority.toUpperCase()}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                            {new Date(inc.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{inc.description.substring(0, 40)}...</h3>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-primary)' }}>
                                        {inc.status === 'reported' ? 'Reportada' : inc.status === 'assigned' ? 'Asignada' : 'En curso'}
                                    </div>
                                </div>
                            ))
                    ) : (
                        <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            <Package size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                            <p>No tienes incidencias activas en este momento.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Controller View
    if (user.role === 'controller') {
        return (
            <div className="container">
                <WelcomeHeader />

                <div className="grid-3" style={{ marginBottom: '2rem' }}>
                    <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pendientes</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444' }}>{stats.pending}</div>
                    </div>
                    <div className="card" style={{ borderLeft: '4px solid #3b82f6' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>En Progreso</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6' }}>{stats.active}</div>
                    </div>
                    <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Finalizadas (Mes)</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>{stats.completed}</div>
                    </div>
                </div>

                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Requieren Atención</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {incidents.filter(i => i.status === 'reported').length > 0 ? (
                        incidents
                            .filter(i => i.status === 'reported')
                            .slice(0, 5)
                            .map(inc => (
                                <div key={inc.id} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ padding: '0.5rem', background: '#fee2e2', borderRadius: '50%', color: '#991b1b' }}>
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600 }}>{inc.type.toUpperCase()} - {inc.profiles?.full_name || 'Local'}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            Reportado el {new Date(inc.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                                        onClick={() => navigate(`/incidents/${inc.id}`)}
                                    >
                                        Revisar
                                    </button>
                                </div>
                            ))
                    ) : (
                        <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            No hay incidencias pendientes de revisión.
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Admin View
    return (
        <div className="container">
            <WelcomeHeader />
            <div className="card">
                <h3>Panel de Administración</h3>
                <p>Vista general del sistema.</p>
            </div>
        </div>
    );
}
