import React, { useState } from 'react';
import { ChevronLeft, Plus, MoreVertical, Info, CreditCard as Edit, Trash2, Users, FileText } from 'lucide-react';
import { CreateCustomFilterPanel } from './CreateCustomFilterPanel';

interface CustomFiltersViewProps {
  onBack: () => void;
}

interface Filter {
  id: string;
  name: string;
  targetGroups: string[];
  enabled: boolean;
  filterType?: 'people' | 'applicants';
  selectedDocuments?: string[];
  selectedWorkflows?: string[];
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
        targetGroups: ['HR', 'Managers'],
        enabled: true
      },
      {
        id: '2',
        name: 'Remote Workers',
        targetGroups: ['All Users', 'IT', 'Engineering Team'],
        enabled: true
      },
      {
        id: '3',
        name: 'New Hires (90 days)',
        targetGroups: ['HR', 'IT', 'Managers', 'Legal', 'Finance'],
        enabled: false
      }
    ],
    applicants: [
      {
        id: '4',
        name: 'Senior Level Candidates',
        targetGroups: ['Recruiters', 'Hiring Managers'],
        enabled: true
      },
      {
        id: '5',
        name: 'Technical Interviews Pending',
        targetGroups: ['Engineering Team', 'HR', 'Recruiters'],
        enabled: true
      }
    ],
    templates: [
      {
        id: '6',
        name: 'Contract Templates',
        targetGroups: ['Legal', 'HR'],
        enabled: true,
        filterType: 'people',
        selectedDocuments: ['Certificate of Employment', 'Offer Letter Template', 'Employee Handbook'],
        selectedWorkflows: ['Onboarding Workflow', 'Performance Review Process']
      },
      {
        id: '7',
        name: 'Applicant Processing',
        targetGroups: ['Recruiters', 'Hiring Managers', 'HR', 'Legal'],
        enabled: false,
        filterType: 'applicants',
        selectedDocuments: ['Reference Check Form', 'Work Authorization'],
        selectedWorkflows: ['Background Check Process', 'Reference Verification', 'Training Enrollment']
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

  const toggleFilterStatus = (filterId: string) => {
    // In a real app, this would update the filter status
    console.log('Toggle filter status for:', filterId);
  };

  const renderAssignedGroups = (groups: string[], maxWidth: string = 'max-w-48') => {
    if (groups.length === 0) return <span className="text-gray-400">None</span>;
    
    const visibleGroups = groups.slice(0, 2);
    const remainingCount = groups.length - visibleGroups.length;
    
    return (
      <div className={`${maxWidth} truncate`}>
        <span className="text-gray-600">
          {visibleGroups.join(', ')}
          {remainingCount > 0 && (
            <span 
              className="text-blue-600 cursor-pointer ml-1"
              title={groups.slice(2).join(', ')}
            >
              + {remainingCount} More
            </span>
          )}
        </span>
      </div>
    );
  };

  const renderScope = (documents: string[] = [], workflows: string[] = []) => {
    const docCount = documents.length;
    const workflowCount = workflows.length;
    
    if (docCount === 0 && workflowCount === 0) {
      return <span className="text-gray-400">None</span>;
    }
    
    const scopeText = [
      docCount > 0 ? `${docCount} Document${docCount > 1 ? 's' : ''}` : null,
      workflowCount > 0 ? `${workflowCount} Workflow${workflowCount > 1 ? 's' : ''}` : null
    ].filter(Boolean).join(', ');
    
    const fullDetails = [
      ...(docCount > 0 ? [`Documents: ${documents.join(', ')}`] : []),
      ...(workflowCount > 0 ? [`Workflows: ${workflows.join(', ')}`] : [])
    ].join('\n');
    
    return (
      <span 
        className="text-gray-600 cursor-help"
        title={fullDetails}
      >
        {scopeText}
      </span>
    );
  };

  const renderStatusToggle = (filter: Filter) => {
    return (
      <button
        onClick={() => toggleFilterStatus(filter.id)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          filter.enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            filter.enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    );
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 min-w-48">Name</th>
                      {activeTab === 'templates' && (
                        <>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 min-w-32">Filter Type</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 min-w-40">Scope</th>
                        </>
                      )}
                      <th className="text-left py-3 px-4 font-medium text-gray-900 min-w-48">Assigned Groups</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 min-w-24">Status</th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentFilters.map((filter) => (
                      <tr key={filter.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900 truncate max-w-48" title={filter.name}>
                            {filter.name}
                          </div>
                        </td>
                        {activeTab === 'templates' && (
                          <>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                {filter.filterType === 'people' ? (
                                  <Users className="w-4 h-4 text-blue-500" />
                                ) : (
                                  <FileText className="w-4 h-4 text-green-500" />
                                )}
                                <span className="text-gray-600 capitalize">
                                  {filter.filterType || 'people'}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              {renderScope(filter.selectedDocuments, filter.selectedWorkflows)}
                            </td>
                          </>
                        )}
                        <td className="py-4 px-4">
                          {renderAssignedGroups(filter.targetGroups)}
                        </td>
                        <td className="py-4 px-4">
                          {renderStatusToggle(filter)}
                        </td>
                        <td className="py-4 px-4">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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