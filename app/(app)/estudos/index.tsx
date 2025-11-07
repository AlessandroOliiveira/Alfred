import { View, Text, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { useState } from 'react';
import { Redirect } from 'expo-router';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { EmptyState } from '@/components/common/EmptyState';
import { FAB } from '@/components/common/FAB';
import { useStudyStore } from '@/store/useStudyStore';
import { useUserStore } from '@/store/useUserStore';
import { generateId, getCurrentDate } from '@/utils/helpers';
import { StudySession, StudyType } from '@/types';
import clsx from 'clsx';
import { formatDate } from '@/utils/formatters';

export default function EstudosScreen() {
  const user = useUserStore((state) => state.user);
  const sessions = useStudyStore((state) => state.sessions);
  const addSession = useStudyStore((state) => state.addSession);
  const deleteSession = useStudyStore((state) => state.deleteSession);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<StudyType>('ingles');
  const [duration, setDuration] = useState('');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  const handleOpenModal = () => {
    setSelectedType('ingles');
    setDuration('');
    setTopic('');
    setNotes('');
    setErrors({});
    setModalVisible(true);
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (!duration.trim() || isNaN(Number(duration)) || Number(duration) <= 0) {
      newErrors.duration = 'Duração inválida (minutos)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newSession: StudySession = {
      id: generateId(),
      type: selectedType,
      duration: Number(duration),
      date: getCurrentDate(),
      topic: topic.trim() || undefined,
      notes: notes.trim() || undefined,
      userId: user.id,
      createdAt: getCurrentDate(),
      updatedAt: getCurrentDate(),
    };

    addSession(newSession);
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Excluir Sessão',
      'Tem certeza que deseja excluir esta sessão de estudo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteSession(id),
        },
      ]
    );
  };

  // Calculate stats
  const englishSessions = sessions.filter((s) => s.type === 'ingles');
  const concursoSessions = sessions.filter((s) => s.type === 'concurso');

  const totalEnglishMinutes = englishSessions.reduce((sum, s) => sum + s.duration, 0);
  const totalConcursoMinutes = concursoSessions.reduce((sum, s) => sum + s.duration, 0);

  const totalEnglishHours = (totalEnglishMinutes / 60).toFixed(1);
  const totalConcursoHours = (totalConcursoMinutes / 60).toFixed(1);

  // Calculate this week progress
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const thisWeekSessions = sessions.filter((s) => new Date(s.date) >= startOfWeek);
  const thisWeekMinutes = thisWeekSessions.reduce((sum, s) => sum + s.duration, 0);
  const thisWeekHours = (thisWeekMinutes / 60).toFixed(1);
  const weeklyGoal = 20;
  const weekProgress = Math.min((thisWeekMinutes / 60 / weeklyGoal) * 100, 100);

  // Sort sessions by date (newest first)
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="p-4">
          {/* Weekly Progress Card */}
          <Card className="mb-4">
            <Text className="text-lg font-bold text-text-primary mb-3">
              Meta Semanal
            </Text>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-text-secondary">
                {thisWeekHours}h de {weeklyGoal}h
              </Text>
              <Text className="text-secondary font-bold">
                {weekProgress.toFixed(0)}%
              </Text>
            </View>
            <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-secondary rounded-full"
                style={{ width: `${weekProgress}%` }}
              />
            </View>
          </Card>

          {/* Stats Cards */}
          <View className="flex-row gap-3 mb-4">
            <Card className="flex-1">
              <Text className="text-text-secondary text-sm mb-1">Inglês</Text>
              <Text className="text-2xl font-bold text-primary">
                {totalEnglishHours}h
              </Text>
              <Text className="text-text-secondary text-xs mt-1">
                {englishSessions.length} sessões
              </Text>
            </Card>
            <Card className="flex-1">
              <Text className="text-text-secondary text-sm mb-1">
                Concurso MP
              </Text>
              <Text className="text-2xl font-bold text-accent">
                {totalConcursoHours}h
              </Text>
              <Text className="text-text-secondary text-xs mt-1">
                {concursoSessions.length} sessões
              </Text>
            </Card>
          </View>

          {/* Recent Sessions */}
          <Text className="text-lg font-bold text-text-primary mb-3">
            Sessões Recentes
          </Text>

          {sortedSessions.length === 0 ? (
            <EmptyState
              title="Nenhuma sessão registrada"
              message="Comece a registrar suas sessões de estudo"
              actionLabel="Registrar Sessão"
              onAction={handleOpenModal}
            />
          ) : (
            sortedSessions.slice(0, 20).map((session) => (
              <Card key={session.id} className="mb-3">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <View
                        className={clsx(
                          'px-2 py-1 rounded-md mr-2',
                          session.type === 'ingles'
                            ? 'bg-primary/10'
                            : 'bg-accent/10'
                        )}
                      >
                        <Text
                          className={clsx(
                            'text-xs font-semibold',
                            session.type === 'ingles'
                              ? 'text-primary'
                              : 'text-accent'
                          )}
                        >
                          {session.type === 'ingles' ? 'Inglês' : 'Concurso MP'}
                        </Text>
                      </View>
                      <Text className="text-lg font-bold text-text-primary">
                        {session.duration} min
                      </Text>
                    </View>

                    {session.topic && (
                      <Text className="text-base text-text-primary mb-1">
                        {session.topic}
                      </Text>
                    )}

                    {session.notes && (
                      <Text className="text-sm text-text-secondary mb-2">
                        {session.notes}
                      </Text>
                    )}

                    <Text className="text-xs text-text-secondary">
                      {formatDate(session.date)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleDelete(session.id)}
                    className="p-2"
                  >
                    <Text className="text-danger">🗑️</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Button */}
      <View className="p-4 bg-white border-t border-border">
        <Button title="Registrar Sessão" onPress={handleOpenModal} />
      </View>

      {/* Add Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-2xl font-bold text-text-primary mb-6">
              Nova Sessão de Estudo
            </Text>

            {/* Type Selector */}
            <Text className="text-text-primary font-semibold mb-2">
              Tipo de Estudo
            </Text>
            <View className="flex-row gap-3 mb-4">
              <TouchableOpacity
                onPress={() => setSelectedType('ingles')}
                className={clsx(
                  'flex-1 py-3 rounded-lg border-2',
                  selectedType === 'ingles'
                    ? 'bg-primary border-primary'
                    : 'bg-white border-border'
                )}
              >
                <Text
                  className={clsx(
                    'text-center font-semibold',
                    selectedType === 'ingles'
                      ? 'text-white'
                      : 'text-text-secondary'
                  )}
                >
                  Inglês
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedType('concurso')}
                className={clsx(
                  'flex-1 py-3 rounded-lg border-2',
                  selectedType === 'concurso'
                    ? 'bg-accent border-accent'
                    : 'bg-white border-border'
                )}
              >
                <Text
                  className={clsx(
                    'text-center font-semibold',
                    selectedType === 'concurso'
                      ? 'text-white'
                      : 'text-text-secondary'
                  )}
                >
                  Concurso MP
                </Text>
              </TouchableOpacity>
            </View>

            <Input
              label="Duração (minutos)"
              value={duration}
              onChangeText={setDuration}
              placeholder="Ex: 60"
              keyboardType="numeric"
              error={errors.duration}
            />

            <Input
              label="Tópico (opcional)"
              value={topic}
              onChangeText={setTopic}
              placeholder="Ex: Present Perfect"
            />

            <Input
              label="Observações (opcional)"
              value={notes}
              onChangeText={setNotes}
              placeholder="Ex: Revisei exercícios..."
              multiline
              numberOfLines={3}
            />

            <View className="flex-row gap-3 mt-4">
              <Button
                title="Cancelar"
                onPress={() => setModalVisible(false)}
                variant="outline"
                className="flex-1"
              />
              <Button
                title="Salvar"
                onPress={handleSave}
                className="flex-1"
              />
            </View>
          </View>
        </View>
      </Modal>

      <FAB />
    </View>
  );
}
