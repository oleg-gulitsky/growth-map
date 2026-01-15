import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import { Lesson, LessonStatus } from '../types/lesson';

type LessonItemProps = {
  item: Lesson;
};

const getStatusIcon = (status: LessonStatus) => {
  switch (status) {
    case LessonStatus.Done:
      return <Ionicons name="checkmark-circle" size={32} color={COLORS.SUCCESS} />;
    case LessonStatus.Active:
      return <Ionicons name="play-circle" size={32} color={COLORS.PRIMARY} />;
    case LessonStatus.Locked:
      return <Ionicons name="lock-closed" size={32} color={COLORS.GRAY_400} />;
    default:
      return null;
  }
};

const getItemStyle = (status: LessonStatus) => {
  switch (status) {
    case LessonStatus.Done:
      return [styles.itemContainer, styles.itemDone];
    case LessonStatus.Active:
      return [styles.itemContainer, styles.itemActive];
    case LessonStatus.Locked:
      return [styles.itemContainer, styles.itemLocked];
    default:
      return styles.itemContainer;
  }
};

export const LessonItem = ({ item }: LessonItemProps) => {
  const isInteractive = item.status === LessonStatus.Active || item.status === LessonStatus.Locked;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    if (item.status === LessonStatus.Active) {
      console.log(STRINGS.CONSOLE_START_LESSON);
    } else if (item.status === LessonStatus.Locked) {
      router.push('/modal');
    }
  };

  useEffect(() => {
    if (item.status === LessonStatus.Active) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [item.status, pulseAnim]);

  const scaleStyle = item.status === LessonStatus.Active ? {
    transform: [{ scale: pulseAnim }],
  } : {};

  const ItemComponent = item.status === LessonStatus.Active ? Animated.View : View;

  return (
    <Pressable
      onPress={handlePress}
      disabled={!isInteractive}
      style={({ pressed }) => [
        pressed && isInteractive && styles.itemPressed,
      ]}
    >
      <ItemComponent style={[
        getItemStyle(item.status),
        scaleStyle,
      ]}>
        <View style={styles.iconContainer}>
          {getStatusIcon(item.status)}
        </View>
        <View style={styles.contentContainer}>
          <Text style={[
            styles.title,
            item.status === LessonStatus.Locked && styles.titleLocked,
            item.status === LessonStatus.Active && styles.titleActive,
          ]}>
            {item.title}
          </Text>
          <Text style={[
            styles.statusText,
            item.status === LessonStatus.Done && styles.statusDone,
            item.status === LessonStatus.Active && styles.statusActive,
            item.status === LessonStatus.Locked && styles.statusLocked,
          ]}>
            {item.status === LessonStatus.Done && STRINGS.STATUS_DONE}
            {item.status === LessonStatus.Active && STRINGS.STATUS_ACTIVE}
            {item.status === LessonStatus.Locked && STRINGS.STATUS_LOCKED}
          </Text>
        </View>
        {item.status === LessonStatus.Active && (
          <View style={styles.arrowContainer}>
            <Ionicons name="chevron-forward" size={24} color={COLORS.PRIMARY} />
          </View>
        )}
      </ItemComponent>
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
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
});
