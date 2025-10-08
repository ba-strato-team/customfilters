import React from 'react';
import { Briefcase, Plus } from 'lucide-react';

interface JobApplicationsViewProps {
  onGenerate: () => void;
}

export default function JobApplicationsView({ onGenerate }: JobApplicationsViewProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Briefcase className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
        </div>
        <button
          onClick={onGenerate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Generate Application
        </button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No job applications yet</h3>
        <p className="text-gray-500 mb-4">
          Start by generating your first job application document.
        </p>
        <button
          onClick={onGenerate}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}