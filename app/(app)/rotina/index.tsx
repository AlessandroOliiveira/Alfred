import { View, Text, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { useState } from 'react';
import { Redirect } from 'expo-router';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { EmptyState } from '@/components/common/EmptyState';
import { FAB } from '@/components/common/FAB';
import { useRoutineStore } from '@/store/useRoutineStore';
import { useUserStore } from '@/store/useUserStore';
import { generateId, getCurrentDate } from '@/utils/helpers';
import { RoutineItem } from '@/types';
import clsx from 'clsx';

export default function RotinaScreen() {
  const user = useUserStore((state) => state.user);
  const routine = useRoutineStore((state) => state.routine);
  const addRoutineItem = useRoutineStore((state) => state.addRoutineItem);
  const updateRoutineItem = useRoutineStore((state) => state.updateRoutineItem);
  const deleteRoutineItem = useRoutineStore((state) => state.deleteRoutineItem);
  const toggleRoutineItem = useRoutineStore((state) => state.toggleRoutineItem);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<RoutineItem | null>(null);
  const [time, setTime] = useState('');
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  const handleOpenModal = (item?: RoutineItem) => {
    if (item) {
      setEditingItem(item);
      setTime(item.time);
      setActivity(item.activity);
      setDuration(item.duration);
    } else {
      setEditingItem(null);
      setTime('');
      setActivity('');
      setDuration('');
    }
    setErrors({});
    setModalVisible(true);
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (!time.trim()) newErrors.time = 'Horário é obrigatório';
    if (!activity.trim()) newErrors.activity = 'Atividade é obrigatória';
    if (!duration.trim()) newErrors.duration = 'Duração é obrigatória';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingItem) {
      updateRoutineItem(editingItem.id, {
        time,
        activity,
        duration,
        updatedAt: getCurrentDate(),
      });
    } else {
      const newItem: RoutineItem = {
        id: generateId(),
        time,
        activity,
        duration,
        completed: false,
        userId: user.id,
        createdAt: getCurrentDate(),
        updatedAt: getCurrentDate(),
      };
      addRoutineItem(newItem);
    }

    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Excluir Item',
      'Tem certeza que deseja excluir este item da rotina?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteRoutineItem(id),
        },
      ]
    );
  };

  const completedCount = routine.filter((r) => r.completed).length;
  const progress = routine.length > 0 ? (completedCount / routine.length) * 100 : 0;

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="p-4">
          {/* Progress Card */}
          <Card className="mb-4">
            <Text className="text-lg font-bold text-text-primary mb-3">
              Progresso do Dia
            </Text>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-text-secondary">
                {completedCount} de {routine.length} concluídas
              </Text>
              <Text className="text-primary font-bold">
                {progress.toFixed(0)}%
              </Text>
            </View>
            <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-primary rounded-full"
                style={{ width: `${progress}%` }}
              />
            </View>
          </Card>

          {/* Routine Items */}
          {routine.length === 0 ? (
            <EmptyState
              title="Nenhuma atividade"
              message="Adicione atividades à sua rotina diária"
              actionLabel="Adicionar Atividade"
              onAction={() => handleOpenModal()}
            />
          ) : (
            routine
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((item) => (
                <Card key={item.id} className="mb-3">
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      onPress={() => toggleRoutineItem(item.id)}
                      className="mr-3"
                    >
                      <View
                        className={clsx(
                          'w-6 h-6 rounded-full border-2 items-center justify-center',
                          item.completed
                            ? 'bg-primary border-primary'
                            : 'border-gray-300'
                        )}
                      >
                        {item.completed && (
                          <Text className="text-white text-xs">✓</Text>
                        )}
                      </View>
                    </TouchableOpacity>

                    <View className="flex-1">
                      <Text
                        className={clsx(
                          'text-base font-semibold',
                          item.completed
                            ? 'text-text-secondary line-through'
                            : 'text-text-primary'
                        )}
                      >
                        {item.activity}
                      </Text>
                      <View className="flex-row mt-1">
                        <Text className="text-text-secondary text-sm">
                          {item.time}
                        </Text>
                        <Text className="text-text-secondary text-sm mx-2">
                          •
                        </Text>
                        <Text className="text-text-secondary text-sm">
                          {item.duration}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => handleOpenModal(item)}
                        className="p-2"
                      >
                        <Text className="text-primary">✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDelete(item.id)}
                        className="p-2"
                      >
                        <Text className="text-danger">🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Card>
              ))
          )}
        </View>
      </ScrollView>

      {/* Add Button */}
      <View className="p-4 bg-white border-t border-border">
        <Button
          title="Adicionar Atividade"
          onPress={() => handleOpenModal()}
        />
      </View>

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-2xl font-bold text-text-primary mb-6">
              {editingItem ? 'Editar Atividade' : 'Nova Atividade'}
            </Text>

            <Input
              label="Horário"
              value={time}
              onChangeText={setTime}
              placeholder="Ex: 07:00"
              error={errors.time}
            />

            <Input
              label="Atividade"
              value={activity}
              onChangeText={setActivity}
              placeholder="Ex: Exercício matinal"
              error={errors.activity}
            />

            <Input
              label="Duração"
              value={duration}
              onChangeText={setDuration}
              placeholder="Ex: 30 min"
              error={errors.duration}
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
