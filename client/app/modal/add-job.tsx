import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, View, Platform } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useJobs } from '@/hooks/useJobs';
import { JobStatus } from '@/types';

// ViewModel for AddJobModal
const useAddJobViewModel = () => {
    const { addApplication } = useJobs();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        position: '',
        status: 'Applied' as JobStatus,
        dateApplied: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const [errors, setErrors] = useState({
        companyName: '',
        position: '',
    });

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
            // Reset form after submission
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

export default function AddJobModal() {
    const { formData, setFormData, errors, loading, handleSubmit } = useAddJobViewModel();

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Input
                    label="Company Name"
                    value={formData.companyName}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, companyName: text }))}
                    errorMessage={errors.companyName}
                />
                <Input
                    label="Position"
                    value={formData.position}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, position: text }))}
                    errorMessage={errors.position}
                />
                <Input
                    label="Notes (Optional)"
                    value={formData.notes}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
                    placeholder="Any additional notes"
                    multiline
                    numberOfLines={3}
                    style={{ minHeight: 60 }}
                />
                <Button
                    title={loading ? "Adding..." : "Add Application"}
                    onPress={handleSubmit}
                    disabled={loading}
                    style={{ marginTop: 24 }}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}