import { useAddJobViewModel } from '@/viewmodels/useAddJobViewModel';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Input } from 'react-native-elements';

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
                    containerStyle={{ marginTop: 24 }}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
