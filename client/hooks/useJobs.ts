import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { JobApplication, JobStatus } from '@/types';
import { loadApplications, saveApplications } from '@/utils/storage';

export const useJobs = () => {
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        initializeData();
    }, []);

    const initializeData = async () => {
        try {
            const loadedApplications = await loadApplications();
            setApplications(loadedApplications);
        } catch (error) {
            console.error('Error loading applications:', error);
            Alert.alert('Error', 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const addApplication = async (jobData: Omit<JobApplication, 'id' | 'createdAt'>) => {
        try {
            const newApplication: JobApplication = {
                id: Date.now().toString(),
                ...jobData,
                createdAt: new Date().toISOString()
            };

            const updatedApplications = [...applications, newApplication];
            setApplications(updatedApplications);
            await saveApplications(updatedApplications);

            Alert.alert('Success', 'Application added successfully!');
            return true;
        } catch (error) {
            console.error('Error adding application:', error);
            Alert.alert('Error', 'Failed to add application');
            return false;
        }
    };

    const updateApplicationStatus = async (id: string, newStatus: JobStatus) => {
        try {
            const updatedApplications = applications.map(app =>
                app.id === id
                    ? { ...app, status: newStatus, updatedAt: new Date().toISOString() }
                    : app
            );
            setApplications(updatedApplications);
            await saveApplications(updatedApplications);
        } catch (error) {
            console.error('Error updating application:', error);
            Alert.alert('Error', 'Failed to update application');
        }
    };

    const deleteApplication = async (id: string) => {
        try {
            const updatedApplications = applications.filter(app => app.id !== id);
            setApplications(updatedApplications);
            await saveApplications(updatedApplications);
        } catch (error) {
            console.error('Error deleting application:', error);
            Alert.alert('Error', 'Failed to delete application');
        }
    };

    const getStatusCounts = () => {
        const counts: Record<JobStatus, number> = {
            Applied: 0,
            Ghosted: 0,
            Rejected: 0,
            Interviewed: 0,
            Accepted: 0,
            Declined: 0
        };

        applications.forEach(app => {
            counts[app.status] = (counts[app.status] || 0) + 1;
        });

        return counts;
    };

    const getSuccessRate = () => {
        if (applications.length === 0) return 0;
        const acceptedCount = applications.filter(app => app.status === 'Accepted').length;
        return Math.round((acceptedCount / applications.length) * 100);
    };

    return {
        applications,
        loading,
        addApplication,
        updateApplicationStatus,
        deleteApplication,
        getStatusCounts,
        getSuccessRate,
        refresh: initializeData
    };
};
