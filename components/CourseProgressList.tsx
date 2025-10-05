import React from 'react';
import { Course, Assignment, Status } from '../types';

interface CourseProgressListProps {
  courses: Course[];
  assignments: Assignment[];
  onCompleteCourse: (course: Course) => void;
}

export const CourseProgressList: React.FC<CourseProgressListProps> = ({ courses, assignments, onCompleteCourse }) => {
    const completedAssignmentsByCourse = assignments
        .filter(a => a.status === Status.Done)
        .reduce((acc, assignment) => {
            const courseId = assignment.courseId;
            if (!acc[courseId]) {
                acc[courseId] = [];
            }
            acc[courseId].push(assignment);
            return acc;
        }, {} as Record<string, Assignment[]>);

    const coursesWithCompletedAssignments = courses.filter(course => completedAssignmentsByCourse[course.id]?.length > 0);

    if (coursesWithCompletedAssignments.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                <i className="fa-solid fa-list-check text-2xl mb-2"></i>
                <p>Complete an assignment to track your progress here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {coursesWithCompletedAssignments.map(course => (
                <div key={course.id}>
                    <div className="group flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                            <span className={`w-3 h-3 rounded-full ${course.color}`}></span>
                            <h4 className="font-bold text-gray-800 dark:text-gray-200">{course.name}</h4>
                        </div>
                        <button
                            onClick={() => onCompleteCourse(course)}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-opacity duration-200 focus:opacity-100"
                            aria-label={`Mark ${course.name} as complete`}
                            title={`Mark ${course.name} as complete`}
                        >
                            <i className="fa-solid fa-check-circle text-xl"></i>
                        </button>
                    </div>
                    <ul className="space-y-2 pl-6 border-l-2 border-gray-200 dark:border-gray-700 ml-1.5">
                        {completedAssignmentsByCourse[course.id].map(assignment => (
                            <li key={assignment.id} className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                <i className="fa-solid fa-check text-green-500 mr-3"></i>
                                <span className="line-through">{assignment.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};