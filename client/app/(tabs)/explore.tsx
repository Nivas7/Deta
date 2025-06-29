import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as React from 'react';
import { useRef } from 'react';
import { Animated, Easing, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApplications } from '../../hooks/ApplicationProvider';

export default function HistoryScreen() {
  const { applications } = useApplications();

  // Animation for each card
  const animatedValues = useRef<Animated.Value[]>([]);

  React.useEffect(() => {
    // Ensure animatedValues matches applications length
    if (animatedValues.current.length < applications.length) {
      for (let i = animatedValues.current.length; i < applications.length; i++) {
        animatedValues.current[i] = new Animated.Value(0);
      }
    }
  }, [applications.length]);

  // Animate cards on mount
  const animateCards = () => {
    const animations = applications.map((_, i) =>
      Animated.timing(animatedValues.current[i], {
        toValue: 1,
        duration: 500,
        delay: i * 120,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      })
    );
    Animated.stagger(80, animations).start();
  };

  // Trigger animation when applications change
  React.useEffect(() => {
    animateCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications.length]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          History
        </ThemedText>
        <FlatList
          data={applications}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={applications.length === 0 ? { flex: 1 } : undefined}
          renderItem={({ item, index }) => {
            const animatedStyle = {
              opacity: animatedValues.current[index] || 1,
              transform: [
                {
                  translateY: animatedValues.current[index]
                    ? animatedValues.current[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [40, 0],
                    })
                    : 0,
                },
                {
                  scale: animatedValues.current[index]
                    ? animatedValues.current[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    })
                    : 1,
                },
              ],
            };
            return (
              <Animated.View style={[styles.card, animatedStyle]}>
                <View style={styles.headerRow}>
                  <ThemedText type="default" style={styles.company}>
                    {item.company}
                  </ThemedText>
                  <View style={styles.statusPill}>
                    <ThemedText type="default" style={styles.statusPillText}>
                      {item.status || 'Unknown'}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText type="subtitle" style={styles.role}>
                  {item.role}
                </ThemedText>
                {item.notes ? (
                  <ThemedText type="default" style={styles.notes}>
                    {item.notes}
                  </ThemedText>
                ) : null}
                <ThemedText type="default" style={styles.date}>
                  {new Date(item.date).toLocaleString()}
                </ThemedText>
              </Animated.View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Animated.View
                style={{
                  opacity: animatedValues.current[0] || 1,
                  transform: [
                    {
                      scale: animatedValues.current[0]
                        ? animatedValues.current[0].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.9, 1],
                        })
                        : 1,
                    },
                  ],
                }}
              >
                <ThemedText type="default" style={styles.emptyText}>
                  No applications yet.
                </ThemedText>
              </Animated.View>
            </View>
          }
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F7FA',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 1,
    fontSize: 28,
    color: '#1D3D47',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#1D3D47',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E3E8EF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  company: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#1D3D47',
    letterSpacing: 0.5,
  },
  role: {
    fontSize: 16,
    color: '#3B4B5A',
    marginBottom: 6,
  },
  statusPill: {
    backgroundColor: '#A1CEDC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  statusPillText: {
    color: '#1D3D47',
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  notes: {
    marginTop: 8,
    color: '#555',
    fontStyle: 'italic',
    fontSize: 14,
  },
  date: {
    marginTop: 10,
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#A1CEDC',
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});