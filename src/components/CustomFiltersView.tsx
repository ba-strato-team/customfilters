import React, { useState } from 'react';
import { ChevronLeft, Plus, MoreVertical, Info, Edit, Trash2, ChevronLeft as ChevronLeftIcon, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { CreateCustomFilterPanel } from './CreateCustomFilterPanel';
import { FilterInfoPanel } from './FilterInfoPanel';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { ToastContainer } from './Toast';

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
  selectedDocuments?: string[];
  selectedWorkflows?: string[];
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'neutral';
}

export const CustomFiltersView: React.FC<CustomFiltersViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'people' | 'applicants' | 'templates'>('people');
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [editingFilter, setEditingFilter] = useState<Filter | null>(null);
  const [viewingFilter, setViewingFilter] = useState<Filter | null>(null);
  const [deletingFilter, setDeletingFilter] = useState<Filter | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: boolean }>({});
  const itemsPerPage = 10;

  const [filters, setFilters] = useState<Record<string, Filter[]>>({
    people: [
      {
        id: '1',
        name: 'Active Employees',
        conditions: 3,
        targetGroups: ['HR', 'Managers'],
        enabled: true,
        lastModified: '2 days ago',
        selectedDocuments: [],
        selectedWorkflows: []
      },
      {
        id: '2',
        name: 'Remote Workers',
        conditions: 2,
        targetGroups: ['All Users'],
        enabled: true,
        lastModified: '1 week ago',
        selectedDocuments: [],
        selectedWorkflows: []
      },
      {
        id: '3',
        name: 'New Hires (90 days)',
        conditions: 4,
        targetGroups: ['HR', 'IT', 'Operations', 'Finance'],
        enabled: false,
        lastModified: '3 days ago',
        selectedDocuments: [],
        selectedWorkflows: []
      }
    ],
    applicants: [
      {
        id: '4',
        name: 'Senior Level Candidates',
        conditions: 5,
        targetGroups: ['Recruiters', 'Hiring Managers', 'Department Heads'],
        enabled: true,
        lastModified: '1 day ago',
        selectedDocuments: [],
        selectedWorkflows: []
      },
      {
        id: '5',
        name: 'Technical Interviews Pending',
        conditions: 2,
        targetGroups: ['Engineering Team'],
        enabled: true,
        lastModified: '4 days ago',
        selectedDocuments: [],
        selectedWorkflows: []
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
        workflowsCount: 2,
        selectedDocuments: ['Form', 'Leave Form', 'Offer Letter Template'],
        selectedWorkflows: ['Onboarding Workflow', 'Performance Review Process']
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
        workflowsCount: 3,
        selectedDocuments: ['Annual Performance Review', 'Certificate of Employment', 'Exit Documents', 'Employee Handbook', 'Non-Disclosure Agreement'],
        selectedWorkflows: ['Training Enrollment', 'Benefits Setup', 'Equipment Assignment']
      }
    ]
  });

  const allFilters = filters[activeTab] || [];
  const totalPages = Math.ceil(allFilters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFilters = allFilters.slice(startIndex, endIndex);

  const addToast = (message: string, type: 'success' | 'error' | 'neutral') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const toggleFilterEnabled = (filterId: string) => {
    setFilters(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(filter =>
        filter.id === filterId ? { ...filter, enabled: !filter.enabled } : filter
      )
    }));
  };

  const handleCreateFilter = () => {
    setShowCreatePanel(true);
    setEditingFilter(null);
    setValidationErrors({});
  };

  const handleEditFilter = (filter: Filter) => {
    setEditingFilter(filter);
    setShowCreatePanel(true);
    setActiveDropdown(null);
    setValidationErrors({});
  };

  const handleViewInfo = (filter: Filter) => {
    setViewingFilter(filter);
    setActiveDropdown(null);
  };

  const handleDeleteClick = (filter: Filter) => {
    setDeletingFilter(filter);
    setActiveDropdown(null);
  };

  const handleSaveFilter = (filterData: any) => {
    const errors: { [key: string]: boolean } = {};

    if (!filterData.name.trim()) {
      errors.name = true;
    }

    if (filterData.targetGroups.length === 0) {
      errors.targetGroups = true;
    }

    if (activeTab === 'templates' && filterData.selectedDocuments.length === 0 && filterData.selectedWorkflows.length === 0) {
      errors.filterCriteria = true;
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      addToast('Please complete all required fields before saving.', 'error');
      return;
    }

    if (editingFilter) {
      setFilters(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(filter =>
          filter.id === editingFilter.id
            ? {
                ...filter,
                name: filterData.name,
                filterType: filterData.filterType,
                selectedDocuments: filterData.selectedDocuments,
                selectedWorkflows: filterData.selectedWorkflows,
                targetGroups: filterData.targetGroups,
                enabled: filterData.enabled,
                documentsCount: filterData.selectedDocuments.length,
                workflowsCount: filterData.selectedWorkflows.length,
                lastModified: 'Just now'
              }
            : filter
        )
      }));
      addToast('Custom filter updated successfully.', 'success');
    } else {
      const newFilter: Filter = {
        id: Date.now().toString(),
        name: filterData.name,
        conditions: 0,
        targetGroups: filterData.targetGroups,
        enabled: filterData.enabled,
        lastModified: 'Just now',
        filterType: filterData.filterType,
        documentsCount: filterData.selectedDocuments.length,
        workflowsCount: filterData.selectedWorkflows.length,
        selectedDocuments: filterData.selectedDocuments,
        selectedWorkflows: filterData.selectedWorkflows
      };

      setFilters(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], newFilter]
      }));
      addToast('Custom filter created successfully.', 'success');
    }

    setShowCreatePanel(false);
    setEditingFilter(null);
    setValidationErrors({});
  };

  const handleCancelFilter = () => {
    setShowCreatePanel(false);
    setEditingFilter(null);
    setValidationErrors({});

    if (editingFilter) {
      addToast('Changes discarded.', 'neutral');
    }
  };

  const handleConfirmDelete = () => {
    if (deletingFilter) {
      setFilters(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(filter => filter.id !== deletingFilter.id)
      }));
      addToast('Custom filter deleted successfully.', 'success');
      setDeletingFilter(null);
    }
  };

  const renderAssignedGroups = (groups: string[]) => {
    if (groups.length === 0) return <span className="text-gray-400">No groups</span>;

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

  const handleTabChange = (tab: 'people' | 'applicants' | 'templates') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="flex h-full">
      <div className={`flex-1 bg-gray-50 transition-all duration-300 ${showCreatePanel || viewingFilter ? 'mr-96' : ''}`}>
        <div className="p-6">
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
                                    <button
                                      onClick={() => handleViewInfo(filter)}
                                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                      <Info className="w-4 h-4" />
                                      <span>View Info</span>
                                    </button>
                                    <button
                                      onClick={() => handleEditFilter(filter)}
                                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                      <Edit className="w-4 h-4" />
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteClick(filter)}
                                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
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

      {showCreatePanel && (
        <CreateCustomFilterPanel
          activeTab={activeTab}
          onClose={handleCancelFilter}
          onSave={handleSaveFilter}
          editMode={!!editingFilter}
          initialData={editingFilter ? {
            id: editingFilter.id,
            name: editingFilter.name,
            filterType: editingFilter.filterType || 'people',
            selectedDocuments: editingFilter.selectedDocuments || [],
            selectedWorkflows: editingFilter.selectedWorkflows || [],
            targetGroups: editingFilter.targetGroups,
            enabled: editingFilter.enabled
          } : undefined}
          validationErrors={validationErrors}
        />
      )}

      {viewingFilter && (
        <FilterInfoPanel
          filter={{
            name: viewingFilter.name,
            filterType: viewingFilter.filterType,
            selectedDocuments: viewingFilter.selectedDocuments,
            selectedWorkflows: viewingFilter.selectedWorkflows,
            targetGroups: viewingFilter.targetGroups,
            enabled: viewingFilter.enabled
          }}
          onClose={() => setViewingFilter(null)}
          isTemplates={activeTab === 'templates'}
        />
      )}

      {deletingFilter && (
        <DeleteConfirmationDialog
          title="Delete Custom Filter"
          message="Are you sure you want to delete this custom filter? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingFilter(null)}
        />
      )}

      {activeDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setActiveDropdown(null)}
        />
      )}

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
};
