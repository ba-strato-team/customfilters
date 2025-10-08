import React, { useState } from 'react';
import { X, ChevronDown, Info } from 'lucide-react';
import { ConditionBuilderModal } from './ConditionBuilderModal';
import { TargetGroupsDropdown } from './TargetGroupsDropdown';
import { SmartDropdown } from './SmartDropdown';

interface CreateCustomFilterPanelProps {
  activeTab: 'people' | 'applicants' | 'templates';
  onClose: () => void;
  onSave: () => void;
}

export const CreateCustomFilterPanel: React.FC<CreateCustomFilterPanelProps> = ({
  activeTab,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [filterType, setFilterType] = useState<'people' | 'applicants'>('people');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
  const [conditions, setConditions] = useState<any[]>([]);
  const [targetGroups, setTargetGroups] = useState<string[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [showConditionBuilder, setShowConditionBuilder] = useState(false);
  const [showTargetGroups, setShowTargetGroups] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showWorkflows, setShowWorkflows] = useState(false);

  const availableDocuments = [
    'Annual Performance Review',
    'Certificate of Employment',
    'Exit Documents',
    'Form',
    'Leave Form',
    'Offer Letter Template',
    'Reference Check Form',
    'Employee Handbook',
    'Non-Disclosure Agreement',
    'Work Authorization'
  ];

  const availableWorkflows = [
    'Onboarding Workflow',
    'Performance Review Process',
    'Exit Interview Process',
    'Training Enrollment',
    'Benefits Setup',
    'Equipment Assignment',
    'Security Access Setup',
    'Compliance Training',
    'Background Check Process',
    'Reference Verification'
  ];
  const getTabLabel = () => {
    switch (activeTab) {
      case 'people': return 'People';
      case 'applicants': return 'Applicants';
      case 'templates': return 'Templates';
      default: return 'People';
    }
  };

  const toggleDocument = (document: string) => {
    if (selectedDocuments.includes(document)) {
      setSelectedDocuments(selectedDocuments.filter(d => d !== document));
    } else {
      setSelectedDocuments([...selectedDocuments, document]);
    }
  };

  const toggleWorkflow = (workflow: string) => {
    if (selectedWorkflows.includes(workflow)) {
      setSelectedWorkflows(selectedWorkflows.filter(w => w !== workflow));
    } else {
      setSelectedWorkflows([...selectedWorkflows, workflow]);
    }
  };
  const handleSave = () => {
    // Validation for templates: Check if at least one from each group is filled
    if (activeTab === 'templates') {
      const hasGroup1 = selectedDocuments.length > 0 || selectedWorkflows.length > 0;
      const hasGroup2 = conditions.length > 0 || targetGroups.length > 0;

      if (!hasGroup1) {
        alert('Please select at least one from Group 1: Select Documents or Select Workflows');
        return;
      }

      if (!hasGroup2) {
        alert('Please select at least one from Group 2: Conditions or Target Groups');
        return;
      }
    }

    onSave();
  };

  return (
    <>
      <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-lg z-30">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Create Custom Filter for {getTabLabel()}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto h-full pb-32">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter filter name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Type Field - Only for Templates */}
          {activeTab === 'templates' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Type <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setFilterType('people')}
                  className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                    filterType === 'people'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  People
                </button>
                <button
                  onClick={() => setFilterType('applicants')}
                  className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                    filterType === 'applicants'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Applicants
                </button>
              </div>
            </div>
          )}

          {/* Filter Criteria - Only for Templates */}
          {activeTab === 'templates' && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Filter Criteria <span className="text-red-500">*</span>
              </label>

              {/* Instructional Helper Text */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-900">
                    <p className="font-medium mb-1">To create a valid filter, select at least one from each group below:</p>
                    <ul className="space-y-0.5 ml-4 list-disc">
                      <li><strong>Group 1:</strong> Select Documents or Select Workflows</li>
                      <li><strong>Group 2:</strong> Conditions or Target Groups</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Group 1: Documents or Workflows */}
              <div className="border border-gray-300 rounded-lg p-4 bg-white mb-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Group 1: Documents or Workflows (select at least one)
                </div>
                <div className="space-y-4">
                  {/* Select Documents */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Documents
                    </label>
                    <button
                      onClick={() => setShowDocuments(!showDocuments)}
                      className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white"
                    >
                      <span className="text-gray-500">
                        {selectedDocuments.length === 0 ? 'Select documents' : `${selectedDocuments.length} document(s) selected`}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    <SmartDropdown isOpen={showDocuments} onClose={() => setShowDocuments(false)}>
                      <div className="p-2">
                        <div className="py-1">
                          {availableDocuments.map((document) => (
                            <button
                              key={document}
                              onClick={() => toggleDocument(document)}
                              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={selectedDocuments.includes(document)}
                                onChange={() => {}}
                                className="rounded border-gray-300"
                              />
                              <span>{document}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </SmartDropdown>
                  </div>

                  {/* Divider with OR */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-3 bg-white text-xs font-medium text-gray-400">OR</span>
                    </div>
                  </div>

                  {/* Select Workflows */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Workflows
                    </label>
                    <button
                      onClick={() => setShowWorkflows(!showWorkflows)}
                      className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white"
                    >
                      <span className="text-gray-500">
                        {selectedWorkflows.length === 0 ? 'Select workflows' : `${selectedWorkflows.length} workflow(s) selected`}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    <SmartDropdown isOpen={showWorkflows} onClose={() => setShowWorkflows(false)}>
                      <div className="p-2">
                        <div className="py-1">
                          {availableWorkflows.map((workflow) => (
                            <button
                              key={workflow}
                              onClick={() => toggleWorkflow(workflow)}
                              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={selectedWorkflows.includes(workflow)}
                                onChange={() => {}}
                                className="rounded border-gray-300"
                              />
                              <span>{workflow}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </SmartDropdown>
                  </div>
                </div>
              </div>

              {/* Group 2: Conditions or Target Groups */}
              <div className="border border-gray-300 rounded-lg p-4 bg-white">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Group 2: Conditions or Target Groups (select at least one)
                </div>
                <div className="space-y-4">
                  {/* Conditions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conditions
                    </label>
                    <button
                      onClick={() => setShowConditionBuilder(true)}
                      className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white"
                    >
                      <span className="text-gray-500">
                        {conditions.length === 0 ? 'Add conditions' : `${conditions.length} condition(s) added`}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Divider with OR */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-3 bg-white text-xs font-medium text-gray-400">OR</span>
                    </div>
                  </div>

                  {/* Target Groups */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Groups
                    </label>
                    <button
                      onClick={() => setShowTargetGroups(!showTargetGroups)}
                      className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white"
                    >
                      <span className="text-gray-500">
                        {targetGroups.length === 0 ? 'Select target groups' : `${targetGroups.length} group(s) selected`}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {showTargetGroups && (
                      <TargetGroupsDropdown
                        selectedGroups={targetGroups}
                        onSelectionChange={setTargetGroups}
                        onClose={() => setShowTargetGroups(false)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Conditions and Target Groups Field - For People and Applicants tabs */}
          {activeTab !== 'templates' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conditions
                </label>
                <button
                  onClick={() => setShowConditionBuilder(true)}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-500">
                    {conditions.length === 0 ? 'Add conditions' : `${conditions.length} condition(s) added`}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Target Groups Field */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Groups
                </label>
                <button
                  onClick={() => setShowTargetGroups(!showTargetGroups)}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-500">
                    {targetGroups.length === 0 ? 'Select target groups' : `${targetGroups.length} group(s) selected`}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showTargetGroups && (
                  <TargetGroupsDropdown
                    selectedGroups={targetGroups}
                    onSelectionChange={setTargetGroups}
                    onClose={() => setShowTargetGroups(false)}
                  />
                )}
              </div>
            </>
          )}

          {/* Enable Filter Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Enable Filter
            </label>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || (activeTab === 'templates' && filterType ? false : false)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                name.trim()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Create
            </button>
          </div>
        </div>
      </div>

      {/* Condition Builder Modal */}
      {showConditionBuilder && (
        <ConditionBuilderModal
          conditions={conditions}
          onConditionsChange={setConditions}
          onClose={() => setShowConditionBuilder(false)}
          filterType={activeTab === 'templates' ? filterType : activeTab}
        />
      )}
    </>
  );
};