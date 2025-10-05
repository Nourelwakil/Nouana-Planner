import React, { useState } from 'react';
import { Assignment, Course, Priority, Status } from '../types';
import { BookOpenIcon, ClockIcon } from './icons';

interface CourseAssignmentsViewProps {
  courses: Course[];
  assignments: Assignment[];
  onAddAssignment: (courseId?: string) => void;
  onEditAssignment: (assignment: Assignment) => void;
  onAddCourse: () => void;
  onEditCourse: (course: Course) => void;
}

const priorityClasses: Record<Priority, { bg: string; text: string }> = {
  [Priority.High]: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-200' },
  [Priority.Medium]: { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-800 dark:text-yellow-200' },
  [Priority.Low]: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-200' },
};

const statusClasses: Record<Status, { bg: string; text: string; icon: string; label: string }> = {
  [Status.NotStarted]: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-300', icon: 'fa-regular fa-circle', label: 'Not Started' },
  [Status.InProgress]: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-200', icon: 'fa-solid fa-spinner fa-spin', label: 'In Progress' },
  [Status.Done]: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-200', icon: 'fa-solid fa-check', label: 'Done' },
};

export const CourseAssignmentsView: React.FC<CourseAssignmentsViewProps> = ({
  courses,
  assignments,
  onAddAssignment,
  onEditAssignment,
  onAddCourse,
  onEditCourse,
}) => {
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());

  const toggleCourse = (courseId: string) => {
    const newSet = new Set(expandedCourses);
    if (newSet.has(courseId)) {
      newSet.delete(courseId);
    } else {
      newSet.add(courseId);
    }
    setExpandedCourses(newSet);
  };
  
  const formatDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const itemDate = new Date(date);
    itemDate.setHours(0, 0, 0, 0);

    const diffTime = itemDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    if (diffDays === -1) return 'Yesterday';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `in ${diffDays} days`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Courses & Assignments</h3>
        <div className="flex items-center space-x-2">
          <button onClick={onAddCourse} className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105">
            <i className="fa-solid fa-plus mr-1.5"></i> Course
          </button>
          <button onClick={() => onAddAssignment()} disabled={courses.length === 0} className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed">
            <i className="fa-solid fa-plus mr-1.5"></i> Assignment
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {courses.length > 0 ? (
          courses.map(course => {
            const assignmentsForCourse = assignments
              .filter(a => a.courseId === course.id)
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
            const isExpanded = expandedCourses.has(course.id);

            return (
              <div key={course.id} className="border border-gray-200 dark:border-gray-700 rounded-lg transition-shadow hover:shadow-md">
                <div className="group flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-t-lg cursor-pointer" onClick={() => toggleCourse(course.id)}>
                  <div className="flex items-center space-x-3 flex-grow min-w-0">
                    <span className={`w-3 h-3 rounded-full flex-shrink-0 ${course.color}`}></span>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{course.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{course.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0 pl-2">
                    <button onClick={(e) => { e.stopPropagation(); onAddAssignment(course.id); }} className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      + Assignment
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onEditCourse(course); }} className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1 group-hover:translate-x-0 focus:opacity-100">
                      <i className="fa-solid fa-pencil"></i>
                    </button>
                    <i className={`fa-solid fa-chevron-down text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}></i>
                  </div>
                </div>
                {isExpanded && (
                  <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                    {assignmentsForCourse.length > 0 ? (
                      <ul className="space-y-3">
                        {assignmentsForCourse.map(assignment => {
                          const statusClass = statusClasses[assignment.status];
                          const priorityClass = priorityClasses[assignment.priority];
                          return (
                            <li key={assignment.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <div className="flex-grow min-w-0">
                                <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{assignment.title}</p>
                                <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    <span className={`px-2 py-0.5 rounded-full capitalize ${priorityClass.bg} ${priorityClass.text}`}>{assignment.priority}</span>
                                    <span className={`px-2 py-0.5 rounded-full ${statusClass.bg} ${statusClass.text}`}>{statusClass.label}</span>
                                </div>
                              </div>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                                <ClockIcon className="w-4 h-4 mr-1.5" />
                                <span>{formatDate(assignment.dueDate)}</span>
                              </div>
                              <button onClick={() => onEditAssignment(assignment)} className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400" aria-label={`Edit ${assignment.title}`}>
                                <i className="fa-solid fa-pencil"></i>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    ) : (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">No assignments for this course yet.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <BookOpenIcon className="w-10 h-10 mx-auto mb-3" />
                <h4 className="font-semibold">No Courses Found</h4>
                <p className="text-sm">Add a course to start organizing your assignments.</p>
            </div>
        )}
      </div>
    </div>
  );
};