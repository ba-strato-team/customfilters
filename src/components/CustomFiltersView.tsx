import React, { useState } from 'react';
import { ChevronLeft, Plus, MoreVertical, Info, Edit, Trash2, ChevronLeft as ChevronLeftIcon, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
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
  filterType?: 'people' | 'applicants';
  documentsCount?: number;
  workflowsCount?: number;
}

export const CustomFiltersView: React.FC<CustomFiltersViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'people' | 'applicants' | 'templates'>('people');
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
        targetGroups: ['HR', 'IT', 'Operations', 'Finance'],
        enabled: false,
        lastModified: '3 days ago'
      }
    ],
    applicants: [
      {
        id: '4',
        name: 'Senior Level Candidates',
        conditions: 5,
        targetGroups: ['Recruiters', 'Hiring Managers', 'Department Heads'],
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
        targetGroups: ['Legal', 'HR', 'Finance'],
        enabled: true,
        lastModified: '1 week ago',
        filterType: 'people',
        documentsCount: 3,
        workflowsCount: 2
      },
      {
        id: '7',
        name: 'Onboarding Templates',
        conditions: 4,
        targetGroups: ['HR', 'IT', 'Facilities', 'Operations'],
        enabled: true,
        lastModified: '3 days ago',
        filterType: 'applicants',
        documentsCount: 5,
        workflowsCount: 3
      }
    ]
  };

  const allFilters = mockFilters[activeTab] || [];
  const totalPages = Math.ceil(allFilters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFilters = allFilters.slice(startIndex, endIndex);

  const toggleFilterEnabled = (filterId: string) => {
    // Toggle logic will be implemented with actual state management
    console.log('Toggle filter:', filterId);
  };

  const renderAssignedGroups = (groups: string[]) => {
    if (groups.length === 0) return <span className="text-gray-400">No groups</span>;

    // For simplicity, show first 2 groups and count remainder
    const visibleGroups = groups.slice(0, 2);
    const remainingCount = groups.length - visibleGroups.length;

    return (
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-gray-900 truncate">
          {visibleGroups.join(', ')}
          {remainingCount > 0 && (
            <span className="text-gray-900"> +{remainingCount} More</span>
          )}
        </span>
      </div>
    );
  };

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

  const handleTabChange = (tab: 'people' | 'applicants' | 'templates') => {
    setActiveTab(tab);
    setCurrentPage(1);
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
                  onClick={() => handleTabChange(tab.id as any)}
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
            {allFilters.length === 0 ? (
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
              <>
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        {activeTab === 'templates' && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Filter Type
                          </th>
                        )}
                        {activeTab === 'templates' && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Scope
                          </th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assigned Groups
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                          Status
                        </th>
                        <th className="px-6 py-3 w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentFilters.map((filter) => (
                        <tr key={filter.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">{filter.name}</span>
                          </td>
                          {activeTab === 'templates' && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900 capitalize">{filter.filterType || 'People'}</span>
                            </td>
                          )}
                          {activeTab === 'templates' && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900">
                                {filter.documentsCount || 0} Documents, {filter.workflowsCount || 0} Workflows
                              </span>
                            </td>
                          )}
                          <td className="px-6 py-4">
                            <div className="text-sm whitespace-nowrap overflow-hidden">
                              {renderAssignedGroups(filter.targetGroups)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleFilterEnabled(filter.id)}
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
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="relative">
                              <button
                                onClick={() => handleDropdownToggle(filter.id)}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                              >
                                <MoreVertical className="w-4 h-4 text-gray-500" />
                              </button>

                              {activeDropdown === filter.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700">Rows per page</span>
                      <select
                        value={itemsPerPage}
                        disabled
                        className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                      >
                        <option value={10}>10</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-700">
                        {startIndex + 1}-{Math.min(endIndex, allFilters.length)} of {allFilters.length}
                      </span>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setCurrentPage(1)}
                          disabled={currentPage === 1}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronsLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={currentPage === totalPages}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronsRight className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
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