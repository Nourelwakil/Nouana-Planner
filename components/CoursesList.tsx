import React from 'react';
import { Course } from '../types';
import { BookOpenIcon } from './icons';

interface CoursesListProps {
  courses: Course[];
  onEdit: (course: Course) => void;
}

export const CoursesList: React.FC<CoursesListProps> = ({ courses, onEdit }) => {
  return (
    <div className="space-y-3">
      {courses.length > 0 ? (
        courses.map(course => (
          <div key={course.id} className="group flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transform hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center space-x-3">
                <span className={`w-3 h-3 rounded-full ${course.color}`}></span>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{course.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{course.code}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onEdit(course)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 focus:opacity-100"
                    aria-label={`Edit ${course.name}`}
                    title={`Edit ${course.name}`}
                >
                    <i className="fa-solid fa-pencil"></i>
                </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          <BookOpenIcon className="w-8 h-8 mx-auto mb-2" />
          <p>No active courses yet.</p>
          <p className="text-sm">Add a course to start organizing.</p>
        </div>
      )}
    </div>
  );
};