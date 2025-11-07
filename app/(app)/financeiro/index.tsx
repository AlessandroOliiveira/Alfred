import { View, Text, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { useState } from 'react';
import { Redirect } from 'expo-router';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { EmptyState } from '@/components/common/EmptyState';
import { FAB } from '@/components/common/FAB';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useUserStore } from '@/store/useUserStore';
import { generateId, getCurrentDate } from '@/utils/helpers';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Transaction, TransactionType } from '@/types';
import clsx from 'clsx';

const EXPENSE_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Compras',
  'Outros',
];

const INCOME_CATEGORIES = ['Salário', 'Freelance', 'Investimentos', 'Outros'];

export default function FinanceiroScreen() {
  const user = useUserStore((state) => state.user);
  const transactions = useFinanceStore((state) => state.transactions);
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);

  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  const handleOpenModal = (transactionType: TransactionType = 'expense') => {
    setType(transactionType);
    setAmount('');
    setCategory('');
    setDescription('');
    setErrors({});
    setModalVisible(true);
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Valor inválido';
    }
    if (!category.trim()) {
      newErrors.category = 'Categoria é obrigatória';
    }
    if (!description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newTransaction: Transaction = {
      id: generateId(),
      type,
      amount: Number(amount),
      category,
      date: getCurrentDate(),
      description,
      userId: user.id,
      createdAt: getCurrentDate(),
      updatedAt: getCurrentDate(),
    };

    addTransaction(newTransaction);
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Excluir Transação',
      'Tem certeza que deseja excluir esta transação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteTransaction(id),
        },
      ]
    );
  };

  // Calculate summary
  const incomes = transactions.filter((t) => t.type === 'income');
  const expenses = transactions.filter((t) => t.type === 'expense');

  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  // Calculate expenses by category
  const expensesByCategory: Record<string, number> = {};
  expenses.forEach((t) => {
    expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
  });

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="p-4">
          {/* Balance Card */}
          <Card className="mb-4">
            <Text className="text-text-secondary text-sm mb-2">
              Saldo Total
            </Text>
            <Text
              className={clsx(
                'text-4xl font-bold mb-4',
                balance >= 0 ? 'text-secondary' : 'text-danger'
              )}
            >
              {formatCurrency(balance)}
            </Text>

            <View className="flex-row justify-between">
              <View>
                <Text className="text-text-secondary text-sm mb-1">
                  Receitas
                </Text>
                <Text className="text-secondary font-bold text-lg">
                  {formatCurrency(totalIncome)}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-text-secondary text-sm mb-1">
                  Despesas
                </Text>
                <Text className="text-danger font-bold text-lg">
                  {formatCurrency(totalExpenses)}
                </Text>
              </View>
            </View>
          </Card>

          {/* Expenses by Category */}
          {Object.keys(expensesByCategory).length > 0 && (
            <Card className="mb-4">
              <Text className="text-lg font-bold text-text-primary mb-3">
                Despesas por Categoria
              </Text>
              {Object.entries(expensesByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, value]) => {
                  const percentage = (value / totalExpenses) * 100;
                  return (
                    <View key={cat} className="mb-3">
                      <View className="flex-row justify-between mb-1">
                        <Text className="text-text-primary">{cat}</Text>
                        <Text className="text-text-secondary">
                          {formatCurrency(value)} ({percentage.toFixed(0)}%)
                        </Text>
                      </View>
                      <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <View
                          className="h-full bg-danger rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </View>
                    </View>
                  );
                })}
            </Card>
          )}

          {/* Quick Actions */}
          <View className="flex-row gap-3 mb-4">
            <Button
              title="+ Receita"
              onPress={() => handleOpenModal('income')}
              variant="secondary"
              className="flex-1"
            />
            <Button
              title="- Despesa"
              onPress={() => handleOpenModal('expense')}
              variant="danger"
              className="flex-1"
            />
          </View>

          {/* Transactions List */}
          <Text className="text-lg font-bold text-text-primary mb-3">
            Transações Recentes
          </Text>

          {sortedTransactions.length === 0 ? (
            <EmptyState
              title="Nenhuma transação"
              message="Adicione suas receitas e despesas"
              actionLabel="Adicionar Transação"
              onAction={() => handleOpenModal()}
            />
          ) : (
            sortedTransactions.slice(0, 30).map((transaction) => (
              <Card key={transaction.id} className="mb-3">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <View
                        className={clsx(
                          'px-2 py-1 rounded-md mr-2',
                          transaction.type === 'income'
                            ? 'bg-secondary/10'
                            : 'bg-danger/10'
                        )}
                      >
                        <Text
                          className={clsx(
                            'text-xs font-semibold',
                            transaction.type === 'income'
                              ? 'text-secondary'
                              : 'text-danger'
                          )}
                        >
                          {transaction.category}
                        </Text>
                      </View>
                    </View>

                    <Text className="text-base font-semibold text-text-primary mb-1">
                      {transaction.description}
                    </Text>

                    <Text className="text-xs text-text-secondary">
                      {formatDate(transaction.date)}
                    </Text>
                  </View>

                  <View className="items-end">
                    <Text
                      className={clsx(
                        'text-xl font-bold',
                        transaction.type === 'income'
                          ? 'text-secondary'
                          : 'text-danger'
                      )}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </Text>

                    <TouchableOpacity
                      onPress={() => handleDelete(transaction.id)}
                      className="mt-2"
                    >
                      <Text className="text-danger text-xs">Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>

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
              {type === 'income' ? 'Nova Receita' : 'Nova Despesa'}
            </Text>

            {/* Type Selector */}
            <View className="flex-row gap-3 mb-4">
              <TouchableOpacity
                onPress={() => setType('income')}
                className={clsx(
                  'flex-1 py-3 rounded-lg border-2',
                  type === 'income'
                    ? 'bg-secondary border-secondary'
                    : 'bg-white border-border'
                )}
              >
                <Text
                  className={clsx(
                    'text-center font-semibold',
                    type === 'income' ? 'text-white' : 'text-text-secondary'
                  )}
                >
                  Receita
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setType('expense')}
                className={clsx(
                  'flex-1 py-3 rounded-lg border-2',
                  type === 'expense'
                    ? 'bg-danger border-danger'
                    : 'bg-white border-border'
                )}
              >
                <Text
                  className={clsx(
                    'text-center font-semibold',
                    type === 'expense' ? 'text-white' : 'text-text-secondary'
                  )}
                >
                  Despesa
                </Text>
              </TouchableOpacity>
            </View>

            <Input
              label="Valor (R$)"
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="numeric"
              error={errors.amount}
            />

            {/* Category Selector */}
            <Text className="text-text-primary font-semibold mb-2">
              Categoria
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
            >
              <View className="flex-row gap-2">
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    className={clsx(
                      'px-4 py-2 rounded-lg border',
                      category === cat
                        ? type === 'income'
                          ? 'bg-secondary border-secondary'
                          : 'bg-danger border-danger'
                        : 'bg-white border-border'
                    )}
                  >
                    <Text
                      className={clsx(
                        'font-semibold',
                        category === cat ? 'text-white' : 'text-text-secondary'
                      )}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            {errors.category && (
              <Text className="text-danger text-sm mb-2">
                {errors.category}
              </Text>
            )}

            <Input
              label="Descrição"
              value={description}
              onChangeText={setDescription}
              placeholder="Ex: Almoço no restaurante"
              error={errors.description}
            />

            <View className="flex-row gap-3 mt-4">
              <Button
                title="Cancelar"
                onPress={() => setModalVisible(false)}
                variant="outline"
                className="flex-1"
              />
              <Button title="Salvar" onPress={handleSave} className="flex-1" />
            </View>
          </View>
        </View>
      </Modal>

      <FAB />
    </View>
  );
}
