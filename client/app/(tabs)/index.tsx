import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { navigate } from 'expo-router/build/global-state/routing';
import { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { useApplications } from '../../hooks/ApplicationProvider';

function AppLogoSVG() {
  return (
    <View style={styles.svgContainer}>
      <Svg width={90} height={90} viewBox="0 0 90 90">
        <Defs>
          <LinearGradient id="appGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#A1CEDC" />
            <Stop offset="100%" stopColor="#1D3D47" />
          </LinearGradient>
        </Defs>
        <Rect x={10} y={10} width={70} height={70} rx={18} fill="url(#appGradient)" />
        <Path
          d="M30 50 L45 30 L60 50"
          stroke="#fff"
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
        />
        <Circle cx={45} cy={60} r={5} fill="#fff" />
      </Svg>
    </View>
  );
}

export type Application = {
  company: string;
  role: string;
  status: string;
  notes: string;
  date: string;
};

export default function HomeScreen() {
  const { addApplication } = useApplications();

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!company || !role) {
      Alert.alert('Missing Fields', 'Please enter both company and role.');
      return;
    }
    addApplication({
      company,
      role,
      status,
      notes,
      date: new Date().toISOString(),
    });
    Alert.alert('Application Saved', `Company: ${company}\nRole: ${role}`);
    setCompany('');
    setRole('');
    setStatus('');
    setNotes('');
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<AppLogoSVG />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.headingText}>
          Job Application Tracker
        </ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Company"
          value={company}
          onChangeText={setCompany}
          placeholderTextColor="#7BA7B9"
        />
        <TextInput
          style={styles.input}
          placeholder="Role"
          value={role}
          onChangeText={setRole}
          placeholderTextColor="#7BA7B9"
        />
        <TextInput
          style={styles.input}
          placeholder="Status (e.g. Applied, Interview)"
          value={status}
          onChangeText={setStatus}
          placeholderTextColor="#7BA7B9"
        />
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholderTextColor="#7BA7B9"
          multiline
        />
        <View style={styles.buttonWrapper}>
          <Button title="Save Application" onPress={handleSubmit} color="#1D3D47" />
        </View>
        <View style={styles.historyButtonWrapper}>
          <Button
            title="Go to History"
            color="#A1CEDC"
            onPress={() => navigate('/explore')}
          />
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    justifyContent: 'center',
  },
  headingText: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#1D3D47',
    letterSpacing: 1,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    margin: 16,
    shadowColor: '#1D3D47',
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 3,
    gap: 14,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1D3D47',
    borderWidth: 1,
    borderColor: '#E3E8EF',
    marginBottom: 4,
  },
  notesInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  buttonWrapper: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1D3D47',
  },
  historyButtonWrapper: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#A1CEDC',
  },
});