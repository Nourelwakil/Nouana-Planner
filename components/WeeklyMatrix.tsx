import React, { useMemo } from 'react';
import { Assignment, Course, Priority } from '../types';

interface WeeklyMatrixProps {
  assignments: Assignment[];
  courses: Course[];
  onAssignmentClick: (assignment: Assignment) => void;
}

type MatrixData = {
  [date: string]: {
    [Priority.High]: Assignment[];
    [Priority.Medium]: Assignment[];
    [Priority.Low]: Assignment[];
  };
};

const priorities: Priority[] = [Priority.High, Priority.Medium, Priority.Low];
const priorityConfig: Record<Priority, { label: string; icon: string; color: string }> = {
    [Priority.High]: { label: 'High', icon: 'fa-arrow-up', color: 'text-red-500' },
    [Priority.Medium]: { label: 'Medium', icon: 'fa-minus', color: 'text-yellow-500' },
    [Priority.Low]: { label: 'Low', icon: 'fa-arrow-down', color: 'text-green-500' },
};

// Utility to get a contrasting text color for a given background color class
const getTextColor = (bgColorClass: string) => {
    // Simple heuristic: yellow and pink are light, others are dark enough for white text
    if (bgColorClass.includes('yellow') || bgColorClass.includes('pink')) {
        return 'text-gray-800';
    }
    return 'text-white';
};


export const WeeklyMatrix: React.FC<WeeklyMatrixProps> = ({ assignments, courses, onAssignmentClick }) => {
  const { weekDates, matrixData } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date;
    });

    const matrixData = weekDates.reduce<MatrixData>((acc, date) => {
      const dateString = date.toISOString().split('T')[0];
      acc[dateString] = {
        [Priority.High]: [],
        [Priority.Medium]: [],
        [Priority.Low]: [],
      };
      return acc;
    }, {});

    assignments.forEach(assignment => {
      const dueDate = new Date(assignment.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      const dateString = dueDate.toISOString().split('T')[0];
      if (matrixData[dateString] && matrixData[dateString][assignment.priority]) {
        matrixData[dateString][assignment.priority].push(assignment);
      }
    });

    return { weekDates, matrixData };
  }, [assignments]);

  const getCourse = (courseId: string) => courses.find(c => c.id === courseId);

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-[auto,repeat(7,1fr)] gap-1 min-w-[600px]">
        {/* Header Row */}
        <div />
        {weekDates.map(date => (
          <div key={date.toISOString()} className="text-center p-2">
            <p className="font-bold text-gray-800 dark:text-gray-200">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{date.toLocaleDateString('en-US', { day: 'numeric' })}</p>
          </div>
        ))}
        
        {/* Priority Rows */}
        {priorities.map(priority => (
          <React.Fragment key={priority}>
             <div className="flex items-center justify-center p-2 border-r border-gray-200 dark:border-gray-700">
                <div className={`flex items-center space-x-2 ${priorityConfig[priority].color}`}>
                    <i className={`fa-solid ${priorityConfig[priority].icon} w-4 h-4`}></i>
                    <span className="font-semibold hidden sm:inline">{priorityConfig[priority].label}</span>
                </div>
            </div>
            {weekDates.map(date => {
                const dateString = date.toISOString().split('T')[0];
                const dayAssignments = matrixData[dateString][priority];
                return (
                    <div key={dateString} className="border-t border-gray-200 dark:border-gray-700 p-1.5 min-h-[80px] space-y-1.5">
                        {dayAssignments.map(assignment => {
                            const course = getCourse(assignment.courseId);
                            const textColor = course ? getTextColor(course.color) : 'text-white';
                            return (
                                <button
                                    type="button"
                                    key={assignment.id}
                                    onClick={() => onAssignmentClick(assignment)}
                                    className={`w-full p-2 rounded-md shadow-sm text-xs font-medium truncate text-left ${course?.color || 'bg-gray-400'} ${textColor} transition-transform hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800`}
                                    title={`${assignment.title} - ${course?.name || 'No Course'}`}
                                >
                                    {assignment.title}
                                </button>
                            );
                        })}
                    </div>
                )
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};