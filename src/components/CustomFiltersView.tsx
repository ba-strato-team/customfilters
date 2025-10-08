import React, { useState } from 'react';
import { ChevronLeft, Plus, MoreVertical, Info, Edit, Trash2 } from 'lucide-react';
import { CreateCustomFilterPanel } from './CreateCustomFilterPanel';

interface CustomFiltersViewProps {
  onBack: () => void;
}

interface Filter {
  id: string;
  name: string;
  conditions: number;
  targetGroups: string[];
  enabled: boolean;
  lastModified: string;
}

export const CustomFiltersView: React.FC<CustomFiltersViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'people' | 'applicants' | 'templates'>('people');
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const mockFilters: Record<string, Filter[]> = {
    people: [
      {
        id: '1',
        name: 'Active Employees',
        conditions: 3,
        targetGroups: ['HR', 'Managers'],
        enabled: true,
        lastModified: '2 days ago'
      },
      {
        id: '2',
        name: 'Remote Workers',
        conditions: 2,
        targetGroups: ['All Users'],
        enabled: true,
        lastModified: '1 week ago'
      },
      {
        id: '3',
        name: 'New Hires (90 days)',
        conditions: 4,
        targetGroups: ['HR', 'IT'],
        enabled: false,
        lastModified: '3 days ago'
      }
    ],
    applicants: [
      {
        id: '4',
        name: 'Senior Level Candidates',
        conditions: 5,
        targetGroups: ['Recruiters', 'Hiring Managers'],
        enabled: true,
        lastModified: '1 day ago'
      },
      {
        id: '5',
        name: 'Technical Interviews Pending',
        conditions: 2,
        targetGroups: ['Engineering Team'],
        enabled: true,
        lastModified: '4 days ago'
      }
    ],
    templates: [
      {
        id: '6',
        name: 'Contract Templates',
        conditions: 3,
        targetGroups: ['Legal', 'HR'],
        enabled: true,
        lastModified: '1 week ago'
      }
    ]
  };

  const currentFilters = mockFilters[activeTab] || [];

  const tabs = [
    { id: 'people', label: 'People' },
    { id: 'applicants', label: 'Applicants' },
    { id: 'templates', label: 'Templates' }
  ];

  const handleDropdownToggle = (filterId: string) => {
    setActiveDropdown(activeDropdown === filterId ? null : filterId);
  };

  const handleCreateFilter = () => {
    setShowCreatePanel(true);
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={`flex-1 bg-gray-50 transition-all duration-300 ${showCreatePanel ? 'mr-96' : ''}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Custom Filters</h1>
            </div>
            <button
              onClick={handleCreateFilter}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Custom Filter</span>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label.toUpperCase()}
                </button>
              ))}
            </nav>
          </div>

          {/* Filters List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {currentFilters.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Plus className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No custom filters yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first custom filter for {activeTab}.
                </p>
                <button
                  onClick={handleCreateFilter}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Filter
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {currentFilters.map((filter) => (
                  <div key={filter.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-gray-900">{filter.name}</h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            filter.enabled 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {filter.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          {filter.conditions} conditions • Target: {filter.targetGroups.join(', ')} • Modified {filter.lastModified}
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => handleDropdownToggle(filter.id)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                        
                        {activeDropdown === filter.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <Info className="w-4 h-4" />
                                <span>View Info</span>
                              </button>
                              <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                              </button>
                              <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Filter Panel */}
      {showCreatePanel && (
        <CreateCustomFilterPanel
          activeTab={activeTab}
          onClose={() => setShowCreatePanel(false)}
          onSave={() => {
            setShowCreatePanel(false);
            // Handle save logic here
          }}
        />
      )}

      {/* Backdrop for dropdown */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
};