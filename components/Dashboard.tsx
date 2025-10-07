import React, { useState, useMemo, FC, useRef, useEffect, useCallback } from 'react';
import { Assignment, Course, Status, StudySession, Priority } from '../types';
import { DashboardCard } from './DashboardCard';
import { PomodoroTimer } from './PomodoroTimer';
import { BookOpenIcon, CheckCircleIcon, ClockIcon, ExclamationCircleIcon } from './icons';
import { SAMPLE_COURSES, SAMPLE_ASSIGNMENTS } from '../constants';
import { WeeklyMatrix } from './WeeklyMatrix';
import { RichTextEditor } from './RichTextEditor';
import { AssignmentDetailModal } from './AssignmentDetailModal';
import { CourseProgressList } from './CourseProgressList';
import { CourseAssignmentsView } from './CourseAssignmentsView';
import { Toast } from './Toast';
import useLocalStorage from '../hooks/useLocalStorage';

// Modal component for adding or editing an assignment
interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignment: Omit<Assignment, 'id' | 'status'> | Assignment) => void;
  courses: Course[];
  assignmentToEdit?: Assignment | null;
  defaultCourseId?: string;
}

const AssignmentModal: FC<AssignmentModalProps> = ({ isOpen, onClose, onSave, courses, assignmentToEdit, defaultCourseId }) => {
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.Medium);
  const [estimatedHours, setEstimatedHours] = useState(1);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const isEditMode = !!assignmentToEdit;
  
  const handleClose = useCallback(() => {
    setIsAnimatingOut(true);
    setTimeout(() => {
        onClose();
        setIsAnimatingOut(false);
    }, 300); // Duration should match animation duration
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
        if (isEditMode && assignmentToEdit) {
            setTitle(assignmentToEdit.title);
            setCourseId(assignmentToEdit.courseId);
            setDescription(assignmentToEdit.description);
            setDueDate(new Date(assignmentToEdit.dueDate).toISOString().split('T')[0]);
            setPriority(assignmentToEdit.priority);
            setEstimatedHours(assignmentToEdit.estimatedHours);
        } else {
            setTitle('');
            setDescription('');
            setDueDate('');
            setPriority(Priority.Medium);
            setEstimatedHours(1);
            setCourseId(defaultCourseId || courses[0]?.id || '');
        }
        setTimeout(() => {
          modalRef.current?.querySelector('input')?.focus();
        }, 100);
    }
  }, [isOpen, isEditMode, assignmentToEdit, courses, defaultCourseId]);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            handleClose();
        }
    };
    if (isOpen) {
        window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !courseId || !dueDate) {
      alert('Please fill in all required fields.');
      return;
    }
    
    const assignmentData = {
      title,
      courseId,
      description,
      dueDate: new Date(`${dueDate}T00:00:00`),
      priority,
      estimatedHours,
    };
    
    if (isEditMode && assignmentToEdit) {
        onSave({ ...assignmentToEdit, ...assignmentData });
    } else {
        onSave(assignmentData);
    }
    
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="assignment-modal-title" className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 ${isAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={handleClose}>
        <div ref={modalRef} className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] ${isAnimatingOut ? 'animate-scale-slide-down' : 'animate-scale-slide-up'}`} onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="p-8 pb-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <h2 id="assignment-modal-title" className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isEditMode ? 'Edit Assignment' : 'Add New Assignment'}
                    </h2>
                </div>
                <div className="p-8 space-y-4 overflow-y-auto flex-grow">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="course" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Course</label>
                        <select id="course" value={courseId} onChange={e => setCourseId(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white">
                        {courses.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                        <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} max="2999-12-31" required className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                        <select id="priority" value={priority} onChange={e => setPriority(e.target.value as Priority)} required className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white">
                            <option value={Priority.Low}>Low</option>
                            <option value={Priority.Medium}>Medium</option>
                            <option value={Priority.High}>High</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Hours</label>
                        <input type="number" id="estimatedHours" value={estimatedHours} min="0" step="0.5" onChange={e => setEstimatedHours(Number(e.target.value))} required className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <RichTextEditor value={description} onChange={setDescription} />
                    </div>
                </div>
                <div className="flex justify-end space-x-4 p-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        {isEditMode ? 'Save Changes' : 'Save Assignment'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

// Modal for adding or editing a course
const COURSE_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 
  'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
];

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Omit<Course, 'id' | 'isCompleted'> | Course) => void;
  courseToEdit?: Course | null;
}

const CourseModal: FC<CourseModalProps> = ({ isOpen, onClose, onSave, courseToEdit }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState(COURSE_COLORS[0]);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const isEditMode = !!courseToEdit;
  
  const handleClose = useCallback(() => {
    setIsAnimatingOut(true);
    setTimeout(() => {
        onClose();
        setIsAnimatingOut(false);
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && courseToEdit) {
        setName(courseToEdit.name);
        setCode(courseToEdit.code);
        setColor(courseToEdit.color);
      } else {
        setName('');
        setCode('');
        setColor(COURSE_COLORS[0]);
      }
      setTimeout(() => {
          modalRef.current?.querySelector('input')?.focus();
      }, 100);
    }
  }, [isOpen, isEditMode, courseToEdit]);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            handleClose();
        }
    };
    if (isOpen) {
        window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) {
      alert('Please fill in all fields.');
      return;
    }

    if (isEditMode && courseToEdit) {
      onSave({ ...courseToEdit, name, code, color });
    } else {
      onSave({ name, code, color });
    }
    handleClose();
  };
  
  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="course-modal-title" className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 ${isAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={handleClose}>
        <div ref={modalRef} className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[90vh] ${isAnimatingOut ? 'animate-scale-slide-down' : 'animate-scale-slide-up'}`} onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="p-8 pb-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <h2 id="course-modal-title" className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isEditMode ? 'Edit Course' : 'Add New Course'}
                    </h2>
                </div>
                <div className="p-8 space-y-4 overflow-y-auto flex-grow">
                    <div>
                        <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Course Name</label>
                        <input type="text" id="courseName" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Course Code (e.g., CS101)</label>
                        <input type="text" id="courseCode" value={code} onChange={e => setCode(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                        <div className="mt-2 grid grid-cols-8 gap-2">
                        {COURSE_COLORS.map(c => (
                            <button key={c} type="button" onClick={() => setColor(c)} className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${c} ${color === c ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800' : ''}`}></button>
                        ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-4 p-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        {isEditMode ? 'Save Changes' : 'Save Course'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

interface ResetConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ResetConfirmationModal: FC<ResetConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const handleClose = useCallback(() => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      onClose();
      setIsAnimatingOut(false);
    }, 300);
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div role="alertdialog" aria-modal="true" aria-labelledby="reset-modal-title" className={`fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center ${isAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={handleClose}>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md text-center ${isAnimatingOut ? 'animate-scale-slide-down' : 'animate-scale-slide-up'}`} onClick={e => e.stopPropagation()}>
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 mb-4">
            <i className="fa-solid fa-triangle-exclamation text-2xl text-red-600 dark:text-red-300"></i>
        </div>
        <h2 id="reset-modal-title" className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Are you absolutely sure?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This action cannot be undone. All of your courses, assignments, and study session data will be permanently deleted.
        </p>
        <div className="flex justify-center space-x-4">
          <button type="button" onClick={handleClose} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
          >
            Yes, delete everything
          </button>
        </div>
      </div>
    </div>
  );
};


const completionMilestones = [
  { threshold: 64, subtitle: "Legendary status unlocked!", gradient: "bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500", iconEffect: "text-yellow-300 animate-pulse" },
  { threshold: 32, subtitle: "Master level! Truly dedicated.", gradient: "bg-gradient-to-br from-purple-500 to-pink-500", iconEffect: "text-pink-200" },
  { threshold: 16, subtitle: "In the zone! Amazing focus.", gradient: "bg-gradient-to-br from-amber-500 to-orange-600", iconEffect: "text-orange-200" },
  { threshold: 8, subtitle: "On fire! You're unstoppable.", gradient: "bg-gradient-to-br from-red-500 to-orange-500", iconEffect: "text-yellow-200" },
  { threshold: 4, subtitle: "You're building a habit!", gradient: "bg-gradient-to-br from-blue-500 to-cyan-500", iconEffect: "text-cyan-200" },
  { threshold: 2, subtitle: "Great start! Keep the momentum.", gradient: "bg-gradient-to-br from-emerald-500 to-lime-600", iconEffect: "text-lime-200" }
];

const getCompletionCardStyle = (hours: number) => {
  if (hours <= 0) {
    return { subtitle: undefined, gradient: "bg-gradient-to-br from-slate-500 to-slate-600", iconEffect: "text-white/90" };
  }
  
  const achievedMilestone = completionMilestones.find(m => hours >= m.threshold);

  if (achievedMilestone) {
    return achievedMilestone;
  }

  // Case where 0 < hours < 2
  return { subtitle: undefined, gradient: "bg-gradient-to-br from-green-500 to-teal-600", iconEffect: "text-white/90" };
};


export const Dashboard: React.FC = () => {
  const [assignments, setAssignments] = useLocalStorage<Assignment[]>('assignments', SAMPLE_ASSIGNMENTS);
  const [courses, setCourses] = useLocalStorage<Course[]>('courses', SAMPLE_COURSES);
  const [studySessions, setStudySessions] = useLocalStorage<StudySession[]>('studySessions', []);
  
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  
  const [assignmentToEdit, setAssignmentToEdit] = useState<Assignment | null>(null);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [defaultCourseIdForModal, setDefaultCourseIdForModal] = useState<string | undefined>();
  
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  const matrixRef = useRef<HTMLDivElement>(null);

  const activeCourses = useMemo(() => courses.filter(c => !c.isCompleted), [courses]);
  const completedCourses = useMemo(() => courses.filter(c => c.isCompleted), [courses]);

  const dashboardStats = useMemo(() => {
    const now = new Date();
    
    const totalStudyHours = assignments
      .filter(a => a.status !== Status.Done && !courses.find(c => c.id === a.courseId)?.isCompleted)
      .reduce((total, a) => total + a.estimatedHours, 0);

    const completedCourseIds = courses
      .filter(c => c.isCompleted)
      .map(c => c.id);

    const hoursFromCompletedCourses = assignments
      .filter(a => completedCourseIds.includes(a.courseId))
      .reduce((total, a) => total + a.estimatedHours, 0);
      
    const minutesFromActiveSessions = studySessions
      .filter(s => {
        if (!s.assignmentId) return true;
        
        const assignment = assignments.find(a => a.id === s.assignmentId);
        
        return assignment && !completedCourseIds.includes(assignment.courseId);
      })
      .reduce((total, session) => total + session.minutes, 0);

    const totalHoursCompleted = Math.round(
      ((minutesFromActiveSessions / 60) + hoursFromCompletedCourses) * 10
    ) / 10;
    
    const dueNext7Days = assignments.filter(a => {
        const dueDate = new Date(a.dueDate);
        const nextSevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        return dueDate > now && dueDate <= nextSevenDays && a.status !== Status.Done
    });

    return {
      dueThisWeekCount: dueNext7Days.length,
      totalStudyHours,
      totalHoursCompleted,
    };
  }, [assignments, studySessions, courses]);

  const handleSessionComplete = (session: { assignmentId: string | null; minutes: number }) => {
    const newSession: StudySession = {
      id: `s${Date.now()}`,
      assignmentId: session.assignmentId,
      minutes: session.minutes,
      startedAt: new Date(),
    };
    setStudySessions(prevSessions => [...prevSessions, newSession]);
  };

  const handleSaveAssignment = (assignmentData: Omit<Assignment, 'id' | 'status'> | Assignment) => {
    if ('id' in assignmentData) {
      // Editing existing assignment
      setAssignments(prev => prev.map(a => (a.id === assignmentData.id ? assignmentData : a)));
    } else {
      // Adding new assignment
      const newAssignment: Assignment = {
        ...assignmentData,
        id: `a${Date.now()}`,
        status: Status.NotStarted,
      };
      setAssignments(prev => [...prev, newAssignment]);
      setTimeout(() => {
        matrixRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };
  
  const handleOpenAssignmentModalForCourse = (courseId?: string) => {
    setAssignmentToEdit(null);
    setDefaultCourseIdForModal(courseId);
    setIsAssignmentModalOpen(true);
  };

  const handleOpenAssignmentModalForEdit = (assignment: Assignment) => {
    setAssignmentToEdit(assignment);
    setIsAssignmentModalOpen(true);
  };
  
  const handleCloseAssignmentModal = () => {
    setIsAssignmentModalOpen(false);
    setAssignmentToEdit(null);
  };

  const handleSaveCourse = (courseData: Omit<Course, 'id' | 'isCompleted'> | Course) => {
    if ('id' in courseData) {
      // Editing an existing course
      setCourses(prevCourses => 
        prevCourses.map(c => (c.id === courseData.id ? courseData : c))
      );
    } else {
      // Adding a new course
      const newCourse: Course = {
        ...courseData,
        id: `c${Date.now()}`,
        isCompleted: false,
      };
      setCourses(prev => [...prev, newCourse]);
    }
  };

  const handleCompleteCourse = (courseToComplete: Course) => {
    const courseHours = assignments
      .filter(a => a.courseId === courseToComplete.id)
      .reduce((sum, a) => sum + a.estimatedHours, 0);

    setCourses(prev => prev.map(c => c.id === courseToComplete.id ? { ...c, isCompleted: true } : c));
    setAssignments(prev => prev.map(a => a.courseId === courseToComplete.id ? { ...a, status: Status.Done } : a));
    
    setToast({
        message: `Congratulations! You completed "${courseToComplete.name}" and logged ${courseHours} hours.`,
        type: 'success',
    });
  };

  const handleOpenCourseModalForAdd = () => {
    setCourseToEdit(null);
    setIsCourseModalOpen(true);
  };
  
  const handleOpenCourseModalForEdit = (course: Course) => {
    setCourseToEdit(course);
    setIsCourseModalOpen(true);
  };
  
  const handleCloseCourseModal = () => {
    setIsCourseModalOpen(false);
    setCourseToEdit(null); // Clear selection on close
  };

  const handleOpenDetailModal = (assignment: Assignment) => {
      setSelectedAssignment(assignment);
  };

  const handleCloseDetailModal = () => {
      setSelectedAssignment(null);
  };
  
  const handleEditFromDetail = (assignment: Assignment) => {
      handleCloseDetailModal();
      // A small timeout ensures the detail modal is gone before the edit modal appears
      setTimeout(() => {
        handleOpenAssignmentModalForEdit(assignment);
      }, 100);
  };
  
  const handleAssignmentStatusChange = (assignmentId: string, status: Status) => {
    setAssignments(prevAssignments => 
      prevAssignments.map(a => 
        a.id === assignmentId ? { ...a, status } : a
      )
    );
  };

  const handleConfirmReset = () => {
    setAssignments([]);
    setCourses([]);
    setStudySessions([]);
    setIsResetModalOpen(false);
    setToast({
        message: "Planner has been reset successfully.",
        type: 'success',
    });
  };

  const selectedCourse = useMemo(() => {
      if (!selectedAssignment) return null;
      return courses.find(c => c.id === selectedAssignment.courseId) || null;
  }, [selectedAssignment, courses]);

  const completionStyle = getCompletionCardStyle(dashboardStats.totalHoursCompleted);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Welcome! Here's your study overview.</p>
        </div>
        <button
            onClick={() => setIsResetModalOpen(true)}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900 flex items-center space-x-2"
            title="Reset all planner data"
        >
            <i className="fa-solid fa-trash-can"></i>
            <span>Reset Planner</span>
        </button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <DashboardCard 
          title="Total Hours Completed" 
          value={`${dashboardStats.totalHoursCompleted} hrs`} 
          icon={<CheckCircleIcon className="w-6 h-6"/>} 
          color="text-green-500" 
          isFeatured={true}
          subtitle={completionStyle.subtitle}
          gradient={completionStyle.gradient}
          iconEffect={completionStyle.iconEffect}
        />
        <DashboardCard title="Total Study Hours" value={`${dashboardStats.totalStudyHours} hrs`} icon={<BookOpenIcon className="w-6 h-6"/>} color="text-purple-500" />
        <DashboardCard title="Due Next 7 Days" value={dashboardStats.dueThisWeekCount} icon={<ClockIcon className="w-6 h-6"/>} color="text-blue-500"/>
        <DashboardCard title="Overdue" value={assignments.filter(a => new Date(a.dueDate) < new Date() && a.status !== Status.Done).length} icon={<ExclamationCircleIcon className="w-6 h-6"/>} color="text-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <CourseAssignmentsView
                courses={activeCourses}
                assignments={assignments}
                onAddAssignment={handleOpenAssignmentModalForCourse}
                onEditAssignment={handleOpenAssignmentModalForEdit}
                onAddCourse={handleOpenCourseModalForAdd}
                onEditCourse={handleOpenCourseModalForEdit}
            />

            <div ref={matrixRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 scroll-mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">7-Day Priority Matrix</h3>
                <WeeklyMatrix assignments={assignments.filter(a => a.status !== Status.Done)} courses={activeCourses} onAssignmentClick={handleOpenDetailModal} />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Progress</h3>
                <CourseProgressList 
                    courses={activeCourses} 
                    assignments={assignments} 
                    onCompleteCourse={handleCompleteCourse} 
                />
            </div>
        </div>
        
        <div className="lg:col-span-1 space-y-8">
             <PomodoroTimer assignments={assignments} courses={activeCourses} onSessionComplete={handleSessionComplete} />
            {completedCourses.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Completed Courses</h3>
                    <ul className="space-y-2">
                        {completedCourses.map(course => (
                            <li key={course.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 flex items-center">
                                <i className="fa-solid fa-check-circle text-green-500 mr-3"></i>
                                <span className="line-through">{course.name} ({course.code})</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
      </div>
      <AssignmentModal
          isOpen={isAssignmentModalOpen}
          onClose={handleCloseAssignmentModal}
          onSave={handleSaveAssignment}
          courses={activeCourses}
          assignmentToEdit={assignmentToEdit}
          defaultCourseId={defaultCourseIdForModal}
        />
      <CourseModal 
          isOpen={isCourseModalOpen}
          onClose={handleCloseCourseModal}
          onSave={handleSaveCourse}
          courseToEdit={courseToEdit}
      />
      <AssignmentDetailModal
          isOpen={selectedAssignment !== null}
          onClose={handleCloseDetailModal}
          assignment={selectedAssignment}
          course={selectedCourse}
          onEdit={handleEditFromDetail}
          onStatusChange={handleAssignmentStatusChange}
      />
      <ResetConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
};