import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [incidents, setIncidents] = useState(() => {
        const saved = localStorage.getItem('asvian_incidents');
        const parsed = saved ? JSON.parse(saved) : [];

        if (parsed.length > 0) return parsed;

        // Seed data for demo if empty
        return [
            {
                id: 'DEMO-001',
                createdAt: new Date().toISOString(),
                type: 'fontanería',
                priority: 'alta',
                status: 'reported',
                description: 'Fuga de agua en el baño principal del local de Zara. Urgente.',
                createdBy: { id: 'local1', name: 'ZARA Local 1' },
                history: [{ date: new Date().toISOString(), action: 'Reportada', user: 'ZARA Local 1', details: 'Incidencia creada' }]
            },
            {
                id: 'DEMO-002',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                type: 'electricidad',
                priority: 'media',
                status: 'in_progress',
                description: 'Fluorescentes parpadeando en el pasillo central frente a H&M.',
                createdBy: { id: 'local2', name: 'H&M' },
                history: [
                    { date: new Date(Date.now() - 86400000).toISOString(), action: 'Reportada', user: 'H&M', details: 'Incidencia creada' },
                    { date: new Date().toISOString(), action: 'Admitida', user: 'Jefe de Mantenimiento', details: 'Estado cambiado a in_progress' }
                ]
            },
            {
                id: 'DEMO-003',
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                type: 'albañilería',
                priority: 'baja',
                status: 'finalized',
                description: 'Baldosa suelta en la entrada norte.',
                createdBy: { id: 'admin', name: 'Gestoría' },
                history: [
                    { date: new Date(Date.now() - 172800000).toISOString(), action: 'Reportada', user: 'Gestoría', details: 'Incidencia creada' },
                    { date: new Date().toISOString(), action: 'Finalizada', user: 'Jefe de Mantenimiento', details: 'Reparación completada' }
                ]
            }
        ];
    });

    // Stateful contacts
    const [contacts, setContacts] = useState(() => {
        const saved = localStorage.getItem('asvian_contacts');
        if (saved) return JSON.parse(saved);
        return [
            { id: 1, name: 'Juan Fontanería', specialty: 'Fontanería', phone: '600123456' },
            { id: 2, name: 'ElecRápido S.L.', specialty: 'Electricidad', phone: '600987654' },
            { id: 3, name: 'Construcciones Paco', specialty: 'Albañilería', phone: '600555555' },
        ];
    });

    useEffect(() => {
        localStorage.setItem('asvian_contacts', JSON.stringify(contacts));
    }, [contacts]);

    const addContact = (contact) => {
        const newContact = { ...contact, id: Date.now() };
        setContacts([...contacts, newContact]);
    };

    const deleteContact = (id) => {
        setContacts(contacts.filter(c => c.id !== id));
    };

    const updateContact = (id, updates) => {
        setContacts(contacts.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    useEffect(() => {
        localStorage.setItem('asvian_incidents', JSON.stringify(incidents));
    }, [incidents]);

    const addIncident = (incidentData, user) => {
        const newIncident = {
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            status: 'reported', // reported, accepted, assigned, in_progress, completed, rejected
            createdBy: {
                id: user.id, // In real app, this ensures we track who
                name: user.name,
            },
            ...incidentData,
            history: [
                {
                    date: new Date().toISOString(),
                    action: 'Reportada',
                    user: user.name,
                    details: 'Incidencia creada'
                }
            ]
        };
        setIncidents([newIncident, ...incidents]);
        return newIncident;
    };

    const updateIncident = (id, updates, user, actionLabel) => {
        setIncidents(prev => prev.map(inc => {
            if (inc.id === id) {
                const updated = { ...inc, ...updates };
                // Add to history
                if (actionLabel) {
                    updated.history = [
                        ...inc.history,
                        {
                            date: new Date().toISOString(),
                            action: actionLabel,
                            user: user?.name || 'Sistema',
                            details: updates.status ? `Estado cambiado a ${updates.status}` : actionLabel
                        }
                    ];
                }
                return updated;
            }
            return inc;
        }));
    };

    return (
        <DataContext.Provider value={{
            incidents,
            contacts,
            addIncident,
            updateIncident,
            addContact,
            deleteContact,
            updateContact
        }}>
            {children}
        </DataContext.Provider>
    );
};
