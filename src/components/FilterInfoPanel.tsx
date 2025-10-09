import React from 'react';
import { X } from 'lucide-react';

interface FilterInfoPanelProps {
  filter: {
    name: string;
    filterType?: 'people' | 'applicants';
    selectedDocuments?: string[];
    selectedWorkflows?: string[];
    targetGroups: string[];
    enabled: boolean;
  };
  onClose: () => void;
  isTemplates: boolean;
}

export const FilterInfoPanel: React.FC<FilterInfoPanelProps> = ({ filter, onClose, isTemplates }) => {
  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-lg z-30">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Filter Details</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="p-6 space-y-6 overflow-y-auto h-full pb-32">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
            {filter.name}
          </div>
        </div>

        {isTemplates && filter.filterType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter Type</label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 capitalize">
              {filter.filterType}
            </div>
          </div>
        )}

        {isTemplates && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-medium text-gray-900 mb-4">Filter Criteria</label>

            {filter.selectedDocuments && filter.selectedDocuments.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">Selected Documents</label>
                <div className="space-y-1">
                  {filter.selectedDocuments.map((doc, index) => (
                    <div key={index} className="px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-900">
                      {doc}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filter.selectedWorkflows && filter.selectedWorkflows.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Selected Workflows</label>
                <div className="space-y-1">
                  {filter.selectedWorkflows.map((workflow, index) => (
                    <div key={index} className="px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-900">
                      {workflow}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!filter.selectedDocuments || filter.selectedDocuments.length === 0) &&
             (!filter.selectedWorkflows || filter.selectedWorkflows.length === 0) && (
              <div className="text-sm text-gray-500">No documents or workflows selected</div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Groups</label>
          <div className="space-y-1">
            {filter.targetGroups.map((group, index) => (
              <div key={index} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-900">
                {group}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              filter.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
            }`}>
              {filter.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
        <button
          onClick={onClose}
          className="w-full px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
