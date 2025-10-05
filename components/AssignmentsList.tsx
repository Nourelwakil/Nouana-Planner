import React from 'react';
import { Assignment, Course, Priority, Status } from '../types';
import { ClockIcon } from './icons';

interface AssignmentsListProps {
  assignments: Assignment[];
  courses: Course[];
  onEdit: (assignment: Assignment) => void;
}

const priorityClasses: Record<Priority, { bg: string; text: string }> = {
  [Priority.High]: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-200' },
  [Priority.Medium]: { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-800 dark:text-yellow-200' },
  [Priority.Low]: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-200' },
};

const statusClasses: Record<Status, { bg: string; text: string; icon: string; label: string }> = {
  [Status.NotStarted]: { 
    bg: 'bg-gray-100 dark:bg-gray-700', 
    text: 'text-gray-600 dark:text-gray-300', 
    icon: 'fa-regular fa-circle', 
    label: 'Not Started' 
  },
  [Status.InProgress]: { 
    bg: 'bg-blue-100 dark:bg-blue-900/50', 
    text: 'text-blue-800 dark:text-blue-200', 
    icon: 'fa-solid fa-spinner fa-spin', 
    label: 'In Progress' 
  },
  [Status.Done]: { 
    bg: 'bg-green-100 dark:bg-green-900/50', 
    text: 'text-green-800 dark:text-green-200', 
    icon: 'fa-solid fa-check', 
    label: 'Done' 
  },
};


export const AssignmentsList: React.FC<AssignmentsListProps> = ({ assignments, courses, onEdit }) => {
  const getCourse = (courseId: string) => courses.find(c => c.id === courseId);

  const formatDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const itemDate = new Date(date);
    itemDate.setHours(0, 0, 0, 0);

    const diffTime = itemDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `in ${diffDays} days`;
  };

  return (
    <ul className="space-y-4">
      {assignments.length > 0 ? (
        assignments.map(assignment => {
          const course = getCourse(assignment.courseId);
          const priorityClass = priorityClasses[assignment.priority];
          const statusClass = statusClasses[assignment.status];
          return (
            <li key={assignment.id} className="group flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:-translate-y-0.5 transform transition-all duration-200">
              <span className={`w-2 h-10 rounded-full ${course?.color || 'bg-gray-400'}`}></span>
              <div className="flex-grow min-w-0">
                <p className="font-semibold text-gray-800 dark:text-gray-200 truncate" title={assignment.title}>{assignment.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{course?.name || 'No Course'}</p>
              </div>
              <div className="flex items-center space-x-3 text-sm flex-shrink-0">
                 <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${statusClass.bg} ${statusClass.text}`}>
                  <i className={`${statusClass.icon}`}></i>
                  <span>{statusClass.label}</span>
                 </span>
                 <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${priorityClass.bg} ${priorityClass.text}`}>
                  {assignment.priority}
                 </span>
                 <div className="flex items-center text-gray-500 dark:text-gray-400">
                   <ClockIcon className="w-4 h-4 mr-1" />
                   <span>{formatDate(assignment.dueDate)}</span>
                 </div>
              </div>
              <button
                onClick={() => onEdit(assignment)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200 focus:opacity-100"
                aria-label={`Edit ${assignment.title}`}
                title={`Edit ${assignment.title}`}
            >
                <i className="fa-solid fa-pencil"></i>
            </button>
            </li>
          );
        })
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No assignments here. Great job!</p>
      )}
    </ul>
  );
};