import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Plus, Filter, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function IncidentsPage() {
    const { user } = useAuth();
    const { incidents, updateIncident } = useData();
    const navigate = useNavigate();

    const myIncidents = user.role === 'local'
        ? incidents.filter(i => i.created_by === user.id)
        : incidents;

    const getStatusColor = (status) => {
        switch (status) {
            case 'reported': return 'bg-yellow-100 text-yellow-800'; // Simplified class mapping
            case 'finalized': return '#10b981';
            case 'in_progress': return '#3b82f6';
            default: return '#64748b';
        }
    };

    const IncidentCard = ({ incident }) => (
        <div
            className="card"
            onClick={() => navigate(`/incidents/${incident.id}`)}
            style={{
                marginBottom: '1rem',
                borderLeft: `4px solid ${incident.priority === 'alta' ? '#ef4444' : '#3b82f6'}`,
                cursor: 'pointer'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge" style={{
                    backgroundColor: incident.priority === 'alta' ? '#fee2e2' : '#dbeafe',
                    color: incident.priority === 'alta' ? '#991b1b' : '#1e40af'
                }}>
                    {incident.priority.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {new Date(incident.created_at).toLocaleDateString()}
                </span>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{incident.type.toUpperCase()}</h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {incident.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {incident.status === 'reported' ? 'Pendiente' : incident.status}
                </div>
                {user.role === 'controller' && incident.status === 'reported' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className="btn btn-secondary"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                            onClick={() => updateIncident(incident.id, { status: 'in_progress' }, user, 'Admitida')}
                        >
                            Admitir
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    // Controller Kanban View
    if (user.role === 'controller') {
        const columns = {
            pending: incidents.filter(i => ['reported', 'assigned'].includes(i.status)),
            progress: incidents.filter(i => i.status === 'in_progress'),
            done: incidents.filter(i => i.status === 'finalized' || i.status === 'rejected'),
        };

        return (
            <div className="container" style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Tablero de Control</h1>
                    <button className="btn btn-secondary"><Filter size={18} /> Filtros</button>
                </div>

                <div className="grid-3 kanban-board" style={{ flex: 1, minHeight: 0, gap: '1.5rem' }}>
                    {/* Column 1: Pendientes */}
                    <div className="kanban-column" style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                            <AlertTriangle size={20} color="#f59e0b" /> Pendientes
                            <span style={{ background: '#e2e8f0', padding: '0.1rem 0.5rem', borderRadius: '1rem', fontSize: '0.8rem' }}>{columns.pending.length}</span>
                        </h3>
                        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                            {columns.pending.map(inc => <IncidentCard key={inc.id} incident={inc} />)}
                        </div>
                    </div>

                    {/* Column 2: En Progreso */}
                    <div className="kanban-column" style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                            <Clock size={20} color="#3b82f6" /> En Progreso
                            <span style={{ background: '#e2e8f0', padding: '0.1rem 0.5rem', borderRadius: '1rem', fontSize: '0.8rem' }}>{columns.progress.length}</span>
                        </h3>
                        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                            {columns.progress.map(inc => <IncidentCard key={inc.id} incident={inc} />)}
                        </div>
                    </div>

                    {/* Column 3: Finalizadas */}
                    <div className="kanban-column" style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                            <CheckCircle size={20} color="#10b981" /> Finalizadas
                            <span style={{ background: '#e2e8f0', padding: '0.1rem 0.5rem', borderRadius: '1rem', fontSize: '0.8rem' }}>{columns.done.length}</span>
                        </h3>
                        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                            {columns.done.map(inc => <IncidentCard key={inc.id} incident={inc} />)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Local View
    return (
        <div className="container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Mis Incidencias</h1>
                <button className="btn btn-primary" onClick={() => navigate('/incidents/new')}>
                    <Plus size={20} /> Nueva
                </button>
            </div>

            <div className="grid-2">
                {myIncidents.length > 0 ? (
                    myIncidents.map(inc => <IncidentCard key={inc.id} incident={inc} />)
                ) : (
                    <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                        <p style={{ color: 'var(--text-muted)' }}>No tienes incidencias reportadas.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
