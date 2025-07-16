import { addApplicationAsync } from '@/state/jobSlice';
import { AppDispatch } from '@/state/store';
import { AddJobFormData, AddJobFormErrors, JobStatus } from '@/types';
import { router } from 'expo-router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useAddJobViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<AddJobFormData>({
    companyName: '',
    position: '',
    notes: '',
    dateApplied: new Date(),
    initialStatus: 'Applied' as JobStatus,
    interviewDate: undefined,
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

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const jobDataToDispatch = {
          companyName: formData.companyName.trim(),
          position: formData.position.trim(),
          notes: formData.notes?.trim(),
          dateApplied: formData.dateApplied.toISOString().split('T')[0],
          initialStatus: formData.initialStatus,
          ...(showInterviewFields && formData.interviewDate && { interviewDate: formData.interviewDate.toISOString().split('T')[0] }),
          ...(showInterviewFields && formData.interviewType && { interviewType: formData.interviewType.trim() }),
          ...(showInterviewFields && formData.interviewRound && { interviewRound: formData.interviewRound.trim() }),
        };

        await dispatch(addApplicationAsync(jobDataToDispatch)).unwrap();

        setFormData({
          companyName: '',
          position: '',
          notes: '',
          dateApplied: new Date(),
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
