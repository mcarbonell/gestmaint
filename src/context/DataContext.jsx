import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [incidents, setIncidents] = useState(() => {
        const saved = localStorage.getItem('asvian_incidents');
        return saved ? JSON.parse(saved) : [];
    });

    // Mock contacts/specialists
    const contacts = [
        { id: 1, name: 'Juan Fontanería', specialty: 'Fontanería', phone: '600123456' },
        { id: 2, name: 'ElecRápido S.L.', specialty: 'Electricidad', phone: '600987654' },
        { id: 3, name: 'Construcciones Paco', specialty: 'Albañilería', phone: '600555555' },
    ];

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
        <DataContext.Provider value={{ incidents, contacts, addIncident, updateIncident }}>
            {children}
        </DataContext.Provider>
    );
};
