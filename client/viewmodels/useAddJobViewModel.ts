// src/viewmodels/useAddJobViewModel.ts
import { addApplicationAsync } from '@/state/jobSlice';
import { AppDispatch } from '@/state/store';
import { AddJobFormData, AddJobFormErrors, JobStatus } from '@/types'; // Import the correct types
import { router } from 'expo-router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useAddJobViewModel = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Use the AddJobFormData interface for the state, with Date objects
    const [formData, setFormData] = useState<AddJobFormData>({
        companyName: '',
        position: '',
        notes: '',
        dateApplied: new Date(), // Initialize with current Date object
        initialStatus: 'Applied' as JobStatus, // Initialize with a default status
        interviewDate: undefined, // Initialize as undefined (Date object or undefined)
        interviewType: '',
        interviewRound: '',
    });

    const [errors, setErrors] = useState<AddJobFormErrors>({});
    const [loading, setLoading] = useState(false);

    const showInterviewFields = ['Interviewed', 'Offered', 'Accepted', 'No Offer'].includes(formData.initialStatus);

    const handleSubmit = async () => {
        const newErrors: AddJobFormErrors = {};
        if (!formData.companyName.trim()) {
            newErrors.companyName = 'Company Name is required.';
        }
        if (!formData.position.trim()) {
            newErrors.position = 'Position is required.';
        }
        // Add other validations as needed

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setLoading(true);
            try {
                // Prepare the job data for the Redux thunk.
                // Convert Date objects to YYYY-MM-DD strings for persistence.
                const jobDataToDispatch = {
                    companyName: formData.companyName.trim(),
                    position: formData.position.trim(),
                    notes: formData.notes?.trim(),
                    dateApplied: formData.dateApplied.toISOString().split('T')[0], // Convert Date to YYYY-MM-DD string
                    initialStatus: formData.initialStatus,
                    // Conditionally add interview fields, converting Date to string
                    ...(showInterviewFields && formData.interviewDate && { interviewDate: formData.interviewDate.toISOString().split('T')[0] }),
                    ...(showInterviewFields && formData.interviewType && { interviewType: formData.interviewType.trim() }),
                    ...(showInterviewFields && formData.interviewRound && { interviewRound: formData.interviewRound.trim() }),
                };

                await dispatch(addApplicationAsync(jobDataToDispatch)).unwrap();

                // Clear form and close modal on success
                setFormData({
                    companyName: '',
                    position: '',
                    notes: '',
                    dateApplied: new Date(), // Reset to new Date object
                    initialStatus: 'Applied' as JobStatus,
                    interviewDate: undefined,
                    interviewType: '',
                    interviewRound: '',
                });
                setErrors({});
                router.back();
            } catch (e: any) {
                console.error('Failed to add application:', e);
                setErrors(prev => ({ ...prev, general: e.message || 'Failed to add application. Please try again.' }));
            } finally {
                setLoading(false);
            }
        }
    };

    return {
        formData,
        setFormData,
        errors,
        loading,
        handleSubmit,
        showInterviewFields,
    };
};