import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

import { useJobs } from '@/hooks/useJobs';
import { globalStyles } from '@/styles/global';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/input';
import { JobStatus } from '@/types';
import { STATUS_OPTIONS } from '@/constants';

export default function AddJobModal() {
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
        const newErrors = {
            companyName: '',
            position: '',
        };

        if (!formData.companyName.trim()) {
            newErrors.companyName = 'Company name is required';
        }

        if (!formData.position.trim()) {
            newErrors.position = 'Position is required';
        }

        setErrors(newErrors);
        return !newErrors.companyName && !newErrors.position;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const success = await addApplication(formData);
            if (success) {
                router.back();
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to add application');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView style={globalStyles.container}>
                <View style={globalStyles.content}>
                    <Text style={globalStyles.header}>Add New Application</Text>
                    <Text style={globalStyles.subHeader}>
                        Track a new job opportunity
                    </Text>

                    <Input
                        label="Company Name *"
                        value={formData.companyName}
                        onChangeText={(text) => {
                            setFormData(prev => ({ ...prev, companyName: text }));
                            if (errors.companyName) {
                                setErrors(prev => ({ ...prev, companyName: '' }));
                            }
                        }}
                        placeholder="e.g. Google, Microsoft, Apple"
                        error={errors.companyName}
                    />

                    <Input
                        label="Position *"
                        value={formData.position}
                        onChangeText={(text) => {
                            setFormData(prev => ({ ...prev, position: text }));
                            if (errors.position) {
                                setErrors(prev => ({ ...prev, position: '' }));
                            }
                        }}
                        placeholder="e.g. Software Engineer, Product Manager"
                        error={errors.position}
                    />

                    <View style={{ marginBottom: 20 }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: 8,
                        }}>
                            Status
                        </Text>
                        <View style={{
                            borderWidth: 1,
                            borderColor: '#D1D5DB',
                            borderRadius: 8,
                            backgroundColor: '#FFFFFF',
                        }}>
                            <Picker
                                selectedValue={formData.status}
                                onValueChange={(value: JobStatus) =>
                                    setFormData(prev => ({ ...prev, status: value }))
                                }
                                style={{ height: 50 }}
                                mode="dropdown"
                            >
                                {STATUS_OPTIONS.map((status) => (
                                    <Picker.Item key={status} label={status} value={status} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    <Input
                        label="Date Applied"
                        value={formData.dateApplied}
                        onChangeText={(text) =>
                            setFormData(prev => ({ ...prev, dateApplied: text }))
                        }
                        placeholder="YYYY-MM-DD"
                    />


                    <Input
                        label="Notes (Optional)"
                        value={formData.notes}
                        onChangeText={(text) =>
                            setFormData(prev => ({ ...prev, notes: text }))
                        }
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
                </View>
            </ScrollView>
        </KeyboardAvoidingView >
    );
}