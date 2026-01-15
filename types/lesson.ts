export enum LessonStatus {
  Done = 'done',
  Active = 'active',
  Locked = 'locked',
}

export type Lesson = {
  id: number;
  title: string;
  status: LessonStatus;
};

export function isValidLesson(item: any): item is Lesson {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'number' &&
    typeof item.title === 'string' &&
    typeof item.status === 'string' &&
    Object.values(LessonStatus).includes(item.status)
  );
}
