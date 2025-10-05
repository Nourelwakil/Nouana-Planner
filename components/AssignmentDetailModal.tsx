import React, { FC, useState, useEffect } from 'react';
import { Assignment, Course, Priority, Status } from '../types';
import { ClockIcon } from './icons';

interface AssignmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
  course: Course | null;
  onEdit: (assignment: Assignment) => void;
  onStatusChange: (assignmentId: string, newStatus: Status) => void;
}

const priorityConfig: Record<Priority, { label: string; icon: string; classes: string }> = {
  [Priority.High]: { label: 'High', icon: 'fa-arrow-up', classes: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' },
  [Priority.Medium]: { label: 'Medium', icon: 'fa-minus', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200' },
  [Priority.Low]: { label: 'Low', icon: 'fa-arrow-down', classes: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' },
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

const statusOptions = [
    { value: Status.NotStarted, label: 'Not Started' },
    { value: Status.InProgress, label: 'In Progress' },
    { value: Status.Done, label: 'Done' },
];


export const AssignmentDetailModal: FC<AssignmentDetailModalProps> = ({ isOpen, onEdit, ...props }) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [localStatus, setLocalStatus] = useState<Status | undefined>();
  
  // Destructure after state to avoid stale closures in handlers
  const { onClose, assignment, course, onStatusChange } = props;

  useEffect(() => {
    if (isOpen && assignment) {
      setLocalStatus(assignment.status);
    }
  }, [isOpen, assignment]);
  
  const hasChanges = isOpen && assignment !== null && localStatus !== assignment.status;

  const handleClose = () => {
    if (hasChanges) return; // Prevent closing if there are changes
    
    setIsAnimatingOut(true);
    setTimeout(() => {
      onClose();
      setIsAnimatingOut(false);
    }, 300);
  };
  
  const handleEdit = () => {
    if (assignment) {
      onEdit(assignment);
    }
  };

  const handleSaveChanges = () => {
    if (localStatus && assignment) {
      onStatusChange(assignment.id, localStatus);
    }
    setIsAnimatingOut(true);
    setTimeout(() => {
        onClose();
        setIsAnimatingOut(false);
    }, 300);
  };
  
  const handleDiscard = () => {
      if (assignment) {
          setLocalStatus(assignment.status);
      }
  };

  if (!isOpen || !assignment) return null;

  const priorityInfo = priorityConfig[assignment.priority];
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const currentStatus = localStatus || assignment.status;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center ${isAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={handleClose}>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl transform transition-all flex flex-col ${isAnimatingOut ? 'animate-scale-slide-down' : 'animate-scale-slide-up'}`} onClick={e => e.stopPropagation()}>
        <div className="p-8 pb-0">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{assignment.title}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        {course && (
                            <div className="flex items-center">
                                <span className={`w-3 h-3 rounded-full mr-2 ${course.color}`}></span>
                                <span className="font-semibold">{course.name}</span>
                            </div>
                        )}
                        <div className="flex items-center">
                            <i className="fa-solid fa-calendar-day mr-2"></i>
                            <span>Due: {formatDate(assignment.dueDate)}</span>
                        </div>
                    </div>
                </div>
                <button onClick={handleClose} disabled={hasChanges} className={`text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors ${hasChanges ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <i className="fa-solid fa-times text-2xl"></i>
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 mr-3">Priority:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${priorityInfo.classes}`}>
                        <i className={`fa-solid ${priorityInfo.icon} mr-2`}></i>
                        {priorityInfo.label}
                    </span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                     <span className="font-semibold mr-3">Est. Time:</span>
                     <div className="flex items-center text-sm">
                       <ClockIcon className="w-4 h-4 mr-1" />
                       <span>{assignment.estimatedHours} {assignment.estimatedHours === 1 ? 'hour' : 'hours'}</span>
                     </div>
                </div>
                <div className="flex items-center">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 mr-3">Status:</span>
                    <div className="relative">
                        <select
                            value={currentStatus}
                            onChange={(e) => setLocalStatus(e.target.value as Status)}
                            className={`appearance-none pl-3 pr-8 py-1 rounded-full text-sm font-medium border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${statusClasses[currentStatus].bg} ${statusClasses[currentStatus].text}`}
                            aria-label="Change assignment status"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium">
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${statusClasses[currentStatus].text}`}>
                            <i className="fa-solid fa-chevron-down text-xs"></i>
                        </div>
                    </div>
                </div>
            </div>
        
            <div className="max-h-[45vh] overflow-y-auto pr-2 flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Description</h3>
                 <div
                    dangerouslySetInnerHTML={{ __html: assignment.description }}
                    className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                 />
                 {!assignment.description && <p className="text-gray-500 italic">No description provided.</p>}
            </div>
        </div>

        <div className={`mt-auto transition-colors duration-300 ${hasChanges ? '' : 'pt-6 border-t border-gray-200 dark:border-gray-700'}`}>
            {!hasChanges ? (
                <div className="flex justify-between items-center px-8 pb-8">
                    <button
                        onClick={handleEdit}
                        className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-all duration-200 transform hover:scale-105"
                    >
                        <i className="fa-solid fa-pencil mr-2"></i>
                        Edit Full Assignment
                    </button>
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-500 transition-all duration-200"
                    >
                        Close
                    </button>
                </div>
            ) : (
                 <div className="bg-blue-50 dark:bg-gray-700/60 p-4 rounded-b-lg flex justify-between items-center animate-fade-in">
                    <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                        <i className="fa-solid fa-circle-info mr-2"></i>
                        You have unsaved changes.
                    </p>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleDiscard}
                            className="px-4 py-2 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-500 transition-colors"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleSaveChanges}
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-transform transform hover:scale-105"
                        >
                            Save & Close
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};