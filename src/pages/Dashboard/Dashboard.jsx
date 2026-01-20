import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PlusCircle, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
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
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Hola, {user.name.split(' ')[0]}
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
                    {/* Mock Cards - We'll replace with real component later */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span className="badge badge-high">Alta</span>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Hace 2h</span>
                        </div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Fuga de agua en almacén</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            Se ha detectado una gotera importante en el techo del almacén...
                        </p>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-primary)' }}>
                            En revisión
                        </div>
                    </div>

                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span className="badge badge-medium">Media</span>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Ayer</span>
                        </div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Luz parpadeante</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            El fluorescente de la entrada parpadea constantmente.
                        </p>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-success)' }}>
                            Asignada a Electricista
                        </div>
                    </div>
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
                    {/* List items */}
                    <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.5rem', background: '#fee2e2', borderRadius: '50%', color: '#991b1b' }}>
                            <AlertTriangle size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600 }}>Tubería rota - Local 4</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Reportado hace 10 min por Zara</div>
                        </div>
                        <button
                            className="btn btn-secondary"
                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                            onClick={() => navigate('/incidents/DEMO-001')}
                        >
                            Revisar
                        </button>
                    </div>

                    <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.5rem', background: '#fef3c7', borderRadius: '50%', color: '#92400e' }}>
                            <Clock size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600 }}>Aire acondicionado ruidoso</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pendiente de asignación</div>
                        </div>
                        <button
                            className="btn btn-secondary"
                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                            onClick={() => navigate('/incidents/DEMO-002')}
                        >
                            Asignar
                        </button>
                    </div>
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
