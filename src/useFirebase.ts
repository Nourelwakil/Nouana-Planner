import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  setDoc,
  getDocs
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from './firebase';
import { Course, Task, AppState, PomodoroSettings } from './types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function useFirebase() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<AppState>({
    courses: [],
    tasks: [],
    pomodoroSettings: {
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      color: '#4f46e5',
      theme: 'light'
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setState({ 
        courses: [], 
        tasks: [], 
        pomodoroSettings: {
          workDuration: 25,
          shortBreakDuration: 5,
          longBreakDuration: 15,
          color: '#4f46e5',
          theme: 'light'
        }
      });
      return;
    }

    const qCourses = query(collection(db, 'courses'), where('uid', '==', user.uid));
    const unsubCourses = onSnapshot(qCourses, (snapshot) => {
      const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      setState(prev => ({ ...prev, courses }));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'courses'));

    const qTasks = query(collection(db, 'tasks'), where('uid', '==', user.uid));
    const unsubTasks = onSnapshot(qTasks, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      setState(prev => ({ ...prev, tasks }));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'tasks'));

    const unsubSettings = onSnapshot(doc(db, 'settings', user.uid), (snapshot) => {
      if (snapshot.exists()) {
        setState(prev => ({ ...prev, pomodoroSettings: snapshot.data() as PomodoroSettings }));
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, `settings/${user.uid}`));

    return () => {
      unsubCourses();
      unsubTasks();
      unsubSettings();
    };
  }, [user]);

  const addCourse = async (course: Omit<Course, 'id'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'courses'), { ...course, uid: user.uid });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'courses');
    }
  };

  const toggleCourse = async (id: string) => {
    const course = state.courses.find(c => c.id === id);
    if (!course) return;
    try {
      await updateDoc(doc(db, 'courses', id), { completed: !course.completed });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `courses/${id}`);
    }
  };

  const deleteCourse = async (id: string) => {
    if (!user) return;
    try {
      // 1. Delete all tasks associated with this course
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('uid', '==', user.uid),
        where('courseId', '==', id)
      );
      const tasksSnapshot = await getDocs(tasksQuery);
      const deletePromises = tasksSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // 2. Delete the course itself
      await deleteDoc(doc(db, 'courses', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `courses/${id}`);
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'completed'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'tasks'), { ...task, completed: false, uid: user.uid });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'tasks');
    }
  };

  const toggleTask = async (id: string) => {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;
    try {
      await updateDoc(doc(db, 'tasks', id), { completed: !task.completed });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tasks/${id}`);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `tasks/${id}`);
    }
  };

  const updatePomodoroSettings = async (settings: PomodoroSettings) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'settings', user.uid), settings);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `settings/${user.uid}`);
    }
  };

  return {
    user,
    loading,
    state,
    addCourse,
    toggleCourse,
    deleteCourse,
    addTask,
    toggleTask,
    deleteTask,
    updatePomodoroSettings
  };
}
