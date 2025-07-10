import { useJobs } from '@/hooks/useJobs';
import { JobStatus } from '@/types';
import { useState } from 'react';

export const useAddJobViewModel = () => {
    const { addApplication } = useJobs();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        position: '',
        status: 'Applied' as JobStatus,
        dateApplied: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const [errors, setErrors] = useState({ companyName: '', position: '' });

    const validateForm = () => {
        const newErrors = { companyName: '', position: '' };
        if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required.';
        if (!formData.position.trim()) newErrors.position = 'Position is required.';
        setErrors(newErrors);
        return !newErrors.companyName && !newErrors.position;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setLoading(true);
        try {
            await addApplication(formData);
            setFormData({
                companyName: '',
                position: '',
                status: 'Applied',
                dateApplied: new Date().toISOString().split('T')[0],
                notes: ''
            });
        } catch (error) {
            console.error('Error adding application:', error);
        } finally {
            setLoading(false);
        }
    };

    return { formData, setFormData, errors, loading, handleSubmit };
};
