import { AddJobFormData, JobStatus } from '@/types';
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
import { Button, Input } from 'react-native-elements'
export default function AddJobModal() {
  const { formData, setFormData, errors, loading, handleSubmit, showInterviewFields } =
    useAddJobViewModel();

  const [datePickerMode, setDatePickerMode] = useState<'dateApplied' | 'interviewDate' | null>(null);

  const openDatePicker = (mode: 'dateApplied' | 'interviewDate') => {
    setDatePickerMode(mode);
  };

  const onChangeDate = (event: any, selectedDate: Date | undefined) => {
    if (Platform.OS !== 'ios') {
      setDatePickerMode(null);
    }
    if (selectedDate) {
      if (datePickerMode === 'dateApplied') {
        setFormData((prev: AddJobFormData) => ({ ...prev, dateApplied: selectedDate }));
      } else if (datePickerMode === 'interviewDate') {
        setFormData((prev: AddJobFormData) => ({ ...prev, interviewDate: selectedDate }));
      }
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
          onChangeText={(text) => setFormData((prev: AddJobFormData) => ({ ...prev, companyName: text }))}
          errorMessage={errors.companyName}
          containerStyle={styles.inputContainer}
        />

        <Input
          label="Position"
          value={formData.position}
          onChangeText={(text) => setFormData((prev: AddJobFormData) => ({ ...prev, position: text }))}
          errorMessage={errors.position}
          containerStyle={styles.inputContainer}
        />

        {/* Date Applied */}
        <TouchableOpacity onPress={() => openDatePicker('dateApplied')}>
          <View pointerEvents="none">
            <Input
              label="Date Applied"
              value={formData.dateApplied ? formData.dateApplied.toLocaleDateString() : ''}
              placeholder="Select Date"
              editable={false}
              rightIcon={{ type: 'font-awesome', name: 'calendar', color: '#86939e' }}
              errorMessage={errors.dateApplied}
              containerStyle={styles.inputContainer}
            />
          </View>
        </TouchableOpacity>

        <Text style={styles.pickerLabel}>Initial Status:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={formData.initialStatus}
            onValueChange={(itemValue: JobStatus) =>
              setFormData((prev: AddJobFormData) => ({ ...prev, initialStatus: itemValue }))
            }
            style={styles.picker}
          >
            {STATUS_OPTIONS.map((statusOption) => (
              <Picker.Item key={statusOption} label={statusOption} value={statusOption} />
            ))}
          </Picker>
        </View>
        {errors.initialStatus && <Text style={styles.errorText}>{errors.initialStatus}</Text>}

        {/* Interview Details Section */}
        {showInterviewFields && (
          <View style={styles.interviewSection}>
            <Text style={styles.sectionTitle}>Interview Details</Text>

            <Input
              label="Interview Type"
              value={formData.interviewType}
              onChangeText={(text) =>
                setFormData((prev: AddJobFormData) => ({ ...prev, interviewType: text }))
              }
              placeholder="e.g., Technical, HR, On-site"
              containerStyle={styles.inputContainer}
            />

            <Input
              label="Interview Round"
              value={formData.interviewRound}
              onChangeText={(text) =>
                setFormData((prev: AddJobFormData) => ({ ...prev, interviewRound: text }))
              }
              placeholder="e.g., 1st, Final"
              containerStyle={styles.inputContainer}
            />

            <TouchableOpacity onPress={() => openDatePicker('interviewDate')}>
              <View pointerEvents="none">
                <Input
                  label="Interview Date"
                  value={formData.interviewDate ? formData.interviewDate.toLocaleDateString() : ''}
                  placeholder="Select Date"
                  editable={false}
                  rightIcon={{ type: 'font-awesome', name: 'calendar', color: '#86939e' }}
                  errorMessage={errors.interviewDate}
                  containerStyle={styles.inputContainer}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}

        <Input
          label="Notes (Optional)"
          value={formData.notes}
          onChangeText={(text) => setFormData((prev: AddJobFormData) => ({ ...prev, notes: text }))}
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

        {datePickerMode && (
          <DateTimePicker
            value={
              datePickerMode === 'dateApplied'
                ? formData.dateApplied || new Date()
                : formData.interviewDate || new Date()
            }
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeDate}
          />
        )}
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
  addButtonContainer: {
    marginTop: 24,
    marginBottom: Platform.OS === 'ios' ? 0 : 20,
  },
});
