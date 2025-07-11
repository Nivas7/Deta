// src/components/AddJobModal.tsx
import { AddJobFormData, JobStatus } from '@/types'; // <--- Import AddJobFormData here
import { STATUS_OPTIONS } from '@/utils/constant';
import { useAddJobViewModel } from '@/viewmodels/useAddJobViewModel';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button, Input } from 'react-native-elements';


export default function AddJobModal() {
    const { formData, setFormData, errors, loading, handleSubmit, showInterviewFields } =
        useAddJobViewModel();

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showInterviewDatePicker, setShowInterviewDatePicker] = useState(false);


    const onChangeDateApplied = (event: any, selectedDate: Date | undefined) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setFormData((prev: AddJobFormData) => ({ ...prev, dateApplied: selectedDate })); // <--- Explicitly type prev
        }
    };

    const onChangeInterviewDate = (event: any, selectedDate: Date | undefined) => {
        setShowInterviewDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setFormData((prev: AddJobFormData) => ({ ...prev, interviewDate: selectedDate })); // <--- Explicitly type prev
        }
    };


    return (
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                automaticallyAdjustKeyboardInsets={true}
            >
                <Text style={styles.title}>Add Job Application</Text>

                <Input
                    label="Company Name"
                    value={formData.companyName}
                    onChangeText={(text) => setFormData((prev: AddJobFormData) => ({ ...prev, companyName: text }))} // <--- Explicitly type prev
                    errorMessage={errors.companyName}
                    containerStyle={styles.inputContainer}
                />

                <Input
                    label="Position"
                    value={formData.position}
                    onChangeText={(text) => setFormData((prev: AddJobFormData) => ({ ...prev, position: text }))} // <--- Explicitly type prev
                    errorMessage={errors.position}
                    containerStyle={styles.inputContainer}
                />

                {/* Date Applied */}
                <Text style={styles.pickerLabel}>Date Applied:</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                    <Text style={styles.datePickerButtonText}>
                        {formData.dateApplied ? formData.dateApplied.toLocaleDateString() : 'Select Date'}
                    </Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={formData.dateApplied || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onChangeDateApplied}
                    />
                )}
                {errors.dateApplied && <Text style={styles.errorText}>{errors.dateApplied}</Text>}


                {/* Initial Status Picker */}
                <Text style={styles.pickerLabel}>Initial Status:</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={formData.initialStatus}
                        onValueChange={(itemValue: JobStatus) => setFormData((prev: AddJobFormData) => ({ ...prev, initialStatus: itemValue }))} // <--- Explicitly type prev
                        style={styles.picker}
                    >
                        {STATUS_OPTIONS.map((statusOption) => (
                            <Picker.Item key={statusOption} label={statusOption} value={statusOption} />
                        ))}
                    </Picker>
                </View>
                {errors.initialStatus && <Text style={styles.errorText}>{errors.initialStatus}</Text>}

                {/* Interview Details Section (Conditionally Rendered) */}
                {showInterviewFields && (
                    <View style={styles.interviewSection}>
                        <Text style={styles.sectionTitle}>Interview Details</Text>
                        <Input
                            label="Interview Type"
                            value={formData.interviewType}
                            onChangeText={(text) => setFormData((prev: AddJobFormData) => ({ ...prev, interviewType: text }))} // <--- Explicitly type prev
                            placeholder="e.g., Technical, HR, On-site"
                            containerStyle={styles.inputContainer}
                        />

                        <Input
                            label="Interview Round"
                            value={formData.interviewRound}
                            onChangeText={(text) => setFormData((prev: AddJobFormData) => ({ ...prev, interviewRound: text }))} // <--- Explicitly type prev
                            placeholder="e.g., 1st, Final"
                            containerStyle={styles.inputContainer}
                        />

                        {/* Interview Date Picker */}
                        <Text style={styles.pickerLabel}>Interview Date:</Text>
                        <TouchableOpacity onPress={() => setShowInterviewDatePicker(true)} style={styles.datePickerButton}>
                            <Text style={styles.datePickerButtonText}>
                                {formData.interviewDate ? formData.interviewDate.toLocaleDateString() : 'Select Date'}
                            </Text>
                        </TouchableOpacity>
                        {showInterviewDatePicker && (
                            <DateTimePicker
                                value={formData.interviewDate || new Date()}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={onChangeInterviewDate}
                            />
                        )}
                        {errors.interviewDate && <Text style={styles.errorText}>{errors.interviewDate}</Text>}
                    </View>
                )}


                <Input
                    label="Notes (Optional)"
                    value={formData.notes}
                    onChangeText={(text) => setFormData((prev: AddJobFormData) => ({ ...prev, notes: text }))} // <--- Explicitly type prev
                    placeholder="Any additional notes"
                    multiline
                    numberOfLines={3}
                    inputStyle={{ minHeight: 60 }}
                    containerStyle={styles.inputContainer}
                />

                {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}

                <Button
                    title={loading ? 'Adding...' : 'Add Application'}
                    onPress={handleSubmit}
                    disabled={loading}
                    containerStyle={styles.addButtonContainer}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardAvoidingContainer: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
        paddingBottom: Platform.OS === 'ios' ? 20 : 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 16,
    },
    pickerLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#86939e',
        marginBottom: 8,
        marginTop: 8,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#86939e',
        borderRadius: 4,
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    picker: {
        height: 50,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -10,
        marginBottom: 10,
        marginLeft: 10,
    },
    interviewSection: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    datePickerButton: {
        height: 48,
        borderColor: '#bdc6cf',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 10,
        justifyContent: 'center',
        marginBottom: 16,
        backgroundColor: '#F9FAFB',
    },
    datePickerButtonText: {
        fontSize: 16,
        color: '#86939e',
    },
    addButtonContainer: {
        marginTop: 24,
        marginBottom: Platform.OS === 'ios' ? 0 : 20,
    }
});