import React, { createContext, useContext, useState } from 'react';

export type Application = {
    company: string;
    role: string;
    status: string;
    notes: string;
    date: string;
};

type ApplicationsContextType = {
    applications: Application[];
    addApplication: (app: Application) => void;
};

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined);

export function ApplicationsProvider({ children }: { children: React.ReactNode }) {
    const [applications, setApplications] = useState<Application[]>([]);

    const addApplication = (app: Application) => setApplications(prev => [app, ...prev]);

    return (
        <ApplicationsContext.Provider value={{ applications, addApplication }}>
            {children}
        </ApplicationsContext.Provider>
    );
}

export function useApplications() {
    const ctx = useContext(ApplicationsContext);
    if (!ctx) throw new Error('useApplications must be used within ApplicationsProvider');
    return ctx;
}