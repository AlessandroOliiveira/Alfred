import { View, Text, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { useState } from 'react';
import { Redirect } from 'expo-router';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { EmptyState } from '@/components/common/EmptyState';
import { FAB } from '@/components/common/FAB';
import { useFiverrStore } from '@/store/useFiverrStore';
import { useUserStore } from '@/store/useUserStore';
import { generateId, getCurrentDate } from '@/utils/helpers';
import { formatDate } from '@/utils/formatters';
import { FiverrTask, TaskPriority } from '@/types';
import clsx from 'clsx';

export default function FiverrScreen() {
  const user = useUserStore((state) => state.user);
  const tasks = useFiverrStore((state) => state.tasks);
  const addTask = useFiverrStore((state) => state.addTask);
  const updateTask = useFiverrStore((state) => state.updateTask);
  const deleteTask = useFiverrStore((state) => state.deleteTask);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<FiverrTask | null>(null);
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  const handleOpenModal = (task?: FiverrTask) => {
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setClient(task.client);
      setDeadline(task.deadline);
      setPriority(task.priority);
      setDescription(task.description || '');
    } else {
      setEditingTask(null);
      setTitle('');
      setClient('');
      setDeadline('');
      setPriority('medium');
      setDescription('');
    }
    setErrors({});
    setModalVisible(true);
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Título é obrigatório';
    if (!client.trim()) newErrors.client = 'Cliente é obrigatório';
    if (!deadline.trim()) newErrors.deadline = 'Prazo é obrigatório';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, {
        title,
        client,
        deadline,
        priority,
        description: description.trim() || undefined,
        updatedAt: getCurrentDate(),
      });
    } else {
      const newTask: FiverrTask = {
        id: generateId(),
        title,
        client,
        deadline,
        priority,
        description: description.trim() || undefined,
        completed: false,
        userId: user.id,
        createdAt: getCurrentDate(),
        updatedAt: getCurrentDate(),
      };
      addTask(newTask);
    }

    setModalVisible(false);
  };

  const handleToggleComplete = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      updateTask(id, {
        completed: !task.completed,
        updatedAt: getCurrentDate(),
      });
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Excluir Tarefa',
      'Tem certeza que deseja excluir esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteTask(id),
        },
      ]
    );
  };

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const getPriorityColor = (p: TaskPriority) => {
    switch (p) {
      case 'high':
        return 'bg-danger';
      case 'medium':
        return 'bg-accent';
      case 'low':
        return 'bg-secondary';
    }
  };

  const getPriorityTextColor = (p: TaskPriority) => {
    switch (p) {
      case 'high':
        return 'text-danger';
      case 'medium':
        return 'text-accent';
      case 'low':
        return 'text-secondary';
    }
  };

  const getPriorityLabel = (p: TaskPriority) => {
    switch (p) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
    }
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  // Sort pending tasks by priority and deadline
  const sortedPendingTasks = [...pendingTasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="p-4">
          {/* Stats Card */}
          <Card className="mb-4">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-text-secondary text-sm mb-1">
                  Tarefas Pendentes
                </Text>
                <Text className="text-3xl font-bold text-primary">
                  {pendingTasks.length}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-text-secondary text-sm mb-1">
                  Concluídas
                </Text>
                <Text className="text-3xl font-bold text-secondary">
                  {completedTasks.length}
                </Text>
              </View>
            </View>
          </Card>

          {/* Pending Tasks */}
          <View className="mb-4">
            <Text className="text-lg font-bold text-text-primary mb-3">
              Tarefas Pendentes
            </Text>

            {sortedPendingTasks.length === 0 ? (
              <EmptyState
                title="Nenhuma tarefa pendente"
                message="Adicione tarefas do Fiverr para gerenciar"
                actionLabel="Adicionar Tarefa"
                onAction={() => handleOpenModal()}
              />
            ) : (
              sortedPendingTasks.map((task) => {
                const overdue = isOverdue(task.deadline);
                return (
                  <Card key={task.id} className="mb-3">
                    <View className="flex-row items-start">
                      <TouchableOpacity
                        onPress={() => handleToggleComplete(task.id)}
                        className="mr-3 mt-1"
                      >
                        <View className="w-6 h-6 rounded-full border-2 border-gray-300" />
                      </TouchableOpacity>

                      <View className="flex-1">
                        <View className="flex-row items-center mb-2">
                          <View
                            className={clsx(
                              'px-2 py-1 rounded-md mr-2',
                              getPriorityColor(task.priority) + '/10'
                            )}
                          >
                            <Text
                              className={clsx(
                                'text-xs font-semibold',
                                getPriorityTextColor(task.priority)
                              )}
                            >
                              {getPriorityLabel(task.priority)}
                            </Text>
                          </View>
                          {overdue && (
                            <View className="px-2 py-1 rounded-md bg-danger/10">
                              <Text className="text-xs font-semibold text-danger">
                                Atrasada
                              </Text>
                            </View>
                          )}
                        </View>

                        <Text className="text-base font-semibold text-text-primary mb-1">
                          {task.title}
                        </Text>

                        <Text className="text-sm text-text-secondary mb-1">
                          Cliente: {task.client}
                        </Text>

                        {task.description && (
                          <Text className="text-sm text-text-secondary mb-2">
                            {task.description}
                          </Text>
                        )}

                        <Text
                          className={clsx(
                            'text-xs font-semibold',
                            overdue ? 'text-danger' : 'text-text-secondary'
                          )}
                        >
                          Prazo: {formatDate(task.deadline)}
                        </Text>

                        <View className="flex-row gap-3 mt-2">
                          <TouchableOpacity onPress={() => handleOpenModal(task)}>
                            <Text className="text-primary text-sm font-semibold">
                              Editar
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleDelete(task.id)}>
                            <Text className="text-danger text-sm font-semibold">
                              Excluir
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Card>
                );
              })
            )}
          </View>

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <View>
              <Text className="text-lg font-bold text-text-primary mb-3">
                Tarefas Concluídas
              </Text>

              {completedTasks.map((task) => (
                <Card key={task.id} className="mb-3 opacity-60">
                  <View className="flex-row items-start">
                    <TouchableOpacity
                      onPress={() => handleToggleComplete(task.id)}
                      className="mr-3 mt-1"
                    >
                      <View className="w-6 h-6 rounded-full border-2 bg-secondary border-secondary items-center justify-center">
                        <Text className="text-white text-xs">✓</Text>
                      </View>
                    </TouchableOpacity>

                    <View className="flex-1">
                      <Text className="text-base font-semibold text-text-secondary line-through mb-1">
                        {task.title}
                      </Text>
                      <Text className="text-sm text-text-secondary">
                        Cliente: {task.client}
                      </Text>
                    </View>

                    <TouchableOpacity onPress={() => handleDelete(task.id)}>
                      <Text className="text-danger">🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Button */}
      <View className="p-4 bg-white border-t border-border">
        <Button title="Adicionar Tarefa" onPress={() => handleOpenModal()} />
      </View>

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
            <View className="bg-white rounded-t-3xl p-6">
              <Text className="text-2xl font-bold text-text-primary mb-6">
                {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
              </Text>

              <Input
                label="Título"
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: Criar logo para cliente"
                error={errors.title}
              />

              <Input
                label="Cliente"
                value={client}
                onChangeText={setClient}
                placeholder="Nome do cliente"
                error={errors.client}
              />

              <Input
                label="Prazo (Data)"
                value={deadline}
                onChangeText={setDeadline}
                placeholder="Ex: 2024-12-31"
                error={errors.deadline}
              />

              {/* Priority Selector */}
              <Text className="text-text-primary font-semibold mb-2">
                Prioridade
              </Text>
              <View className="flex-row gap-2 mb-4">
                {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setPriority(p)}
                    className={clsx(
                      'flex-1 py-3 rounded-lg border-2',
                      priority === p
                        ? `${getPriorityColor(p)} border-transparent`
                        : 'bg-white border-border'
                    )}
                  >
                    <Text
                      className={clsx(
                        'text-center font-semibold',
                        priority === p ? 'text-white' : 'text-text-secondary'
                      )}
                    >
                      {getPriorityLabel(p)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Input
                label="Descrição (opcional)"
                value={description}
                onChangeText={setDescription}
                placeholder="Detalhes da tarefa..."
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
          </ScrollView>
        </View>
      </Modal>

      <FAB />
    </View>
  );
}
