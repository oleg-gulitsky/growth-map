import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

// Constants
const COLORS = {
  PRIMARY: '#3b82f6',
  PRIMARY_DARK: '#1e40af',
  PRIMARY_BG: '#eff6ff',
  SUCCESS: '#10b981',
  SUCCESS_LIGHT: '#86efac',
  SUCCESS_BG: '#f0fdf4',
  DANGER: '#ef4444',
  DANGER_LIGHT: '#fee2e2',
  WHITE: '#ffffff',
  BLACK: '#000000',
  GRAY_50: '#f9fafb',
  GRAY_100: '#f3f4f6',
  GRAY_200: '#e5e7eb',
  GRAY_300: '#d1d5db',
  GRAY_400: '#9ca3af',
  GRAY_500: '#6b7280',
  GRAY_900: '#111827',
  OVERLAY: 'rgba(0, 0, 0, 0.5)',
};

const STRINGS = {
  HOME_TITLE: 'Карта роста',
  HOME_SUBTITLE: 'Ваш путь к развитию',
  MODAL_TITLE: 'Урок заблокирован',
  MODAL_MESSAGE: 'Завершите предыдущие уроки, чтобы разблокировать этот урок',
  MODAL_BUTTON: 'Понятно',
  STATUS_DONE: 'Завершено',
  STATUS_ACTIVE: 'Начать урок',
  STATUS_LOCKED: 'Заблокировано',
  EMPTY_STATE_TITLE: 'Нет доступных уроков',
  EMPTY_STATE_MESSAGE: 'Уроки появятся здесь, когда они будут добавлены',
};

// Data
const lessonsData = [
  { id: 1, title: 'Welcome Journey', status: 'done' },
  { id: 2, title: 'Переключение на себя', status: 'active' },
  { id: 3, title: 'Источник вдохновения', status: 'locked' },
  { id: 4, title: 'Пространство идей', status: 'locked' },
  { id: 5, title: 'Финальный тест', status: 'locked' },
];

// Modal Component
const Modal = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed" size={64} color={COLORS.DANGER} />
        </View>

        <Text style={styles.modalTitle}>{STRINGS.MODAL_TITLE}</Text>
        <Text style={styles.modalMessage}>{STRINGS.MODAL_MESSAGE}</Text>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}
          onPress={onClose}
        >
          <Text style={styles.buttonText}>{STRINGS.MODAL_BUTTON}</Text>
        </Pressable>
      </View>
    </View>
  );
};

// Lesson Item Component
const LessonItem = ({ item, onPress }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'done':
        return <Ionicons name="checkmark-circle" size={32} color={COLORS.SUCCESS} />;
      case 'active':
        return <Ionicons name="play-circle" size={32} color={COLORS.PRIMARY} />;
      case 'locked':
        return <Ionicons name="lock-closed" size={32} color={COLORS.GRAY_400} />;
      default:
        return null;
    }
  };

  const getItemStyle = (status) => {
    switch (status) {
      case 'done':
        return [styles.itemContainer, styles.itemDone];
      case 'active':
        return [styles.itemContainer, styles.itemActive];
      case 'locked':
        return [styles.itemContainer, styles.itemLocked];
      default:
        return styles.itemContainer;
    }
  };

  const isInteractive = item.status === 'active' || item.status === 'locked';

  return (
    <Pressable
      onPress={() => onPress(item)}
      disabled={!isInteractive}
      style={({ pressed }) => [
        pressed && isInteractive && styles.itemPressed,
      ]}
    >
      <View style={getItemStyle(item.status)}>
        <View style={styles.iconContainerItem}>
          {getStatusIcon(item.status)}
        </View>
        <View style={styles.contentContainer}>
          <Text style={[
            styles.title,
            item.status === 'locked' && styles.titleLocked,
            item.status === 'active' && styles.titleActive,
          ]}>
            {item.title}
          </Text>
          <Text style={[
            styles.statusText,
            item.status === 'done' && styles.statusDone,
            item.status === 'active' && styles.statusActive,
            item.status === 'locked' && styles.statusLocked,
          ]}>
            {item.status === 'done' && STRINGS.STATUS_DONE}
            {item.status === 'active' && STRINGS.STATUS_ACTIVE}
            {item.status === 'locked' && STRINGS.STATUS_LOCKED}
          </Text>
        </View>
        {item.status === 'active' && (
          <View style={styles.arrowContainer}>
            <Ionicons name="chevron-forward" size={24} color={COLORS.PRIMARY} />
          </View>
        )}
      </View>
    </Pressable>
  );
};

// Main App Component
export default function App() {
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleItemPress = (item) => {
    if (item.status === 'active') {
      console.log('Start lesson:', item.title);
    } else if (item.status === 'locked') {
      setModalVisible(true);
    }
  };

  const renderItem = ({ item }) => (
    <LessonItem item={item} onPress={handleItemPress} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>{STRINGS.EMPTY_STATE_TITLE}</Text>
      <Text style={styles.emptyStateMessage}>{STRINGS.EMPTY_STATE_MESSAGE}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{STRINGS.HOME_TITLE}</Text>
        <Text style={styles.headerSubtitle}>{STRINGS.HOME_SUBTITLE}</Text>
      </View>
      <FlatList
        data={lessonsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
      <Modal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.GRAY_50,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_200,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.GRAY_900,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.GRAY_500,
  },
  listContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.GRAY_900,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 14,
    color: COLORS.GRAY_500,
    textAlign: 'center',
    lineHeight: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemDone: {
    backgroundColor: COLORS.SUCCESS_BG,
    borderWidth: 1,
    borderColor: COLORS.SUCCESS_LIGHT,
  },
  itemActive: {
    backgroundColor: COLORS.PRIMARY_BG,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    shadowColor: COLORS.PRIMARY,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  itemLocked: {
    backgroundColor: COLORS.GRAY_100,
    opacity: 0.7,
    borderWidth: 1,
    borderColor: COLORS.GRAY_300,
  },
  itemPressed: {
    opacity: 0.7,
  },
  iconContainerItem: {
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.GRAY_900,
    marginBottom: 4,
  },
  titleActive: {
    color: COLORS.PRIMARY_DARK,
    fontWeight: '700',
  },
  titleLocked: {
    color: COLORS.GRAY_400,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  statusDone: {
    color: COLORS.SUCCESS,
  },
  statusActive: {
    color: COLORS.PRIMARY,
  },
  statusLocked: {
    color: COLORS.GRAY_400,
  },
  arrowContainer: {
    marginLeft: 8,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.OVERLAY,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.DANGER_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.GRAY_900,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: COLORS.GRAY_500,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '600',
  },
});
