import { useState } from 'react';

const Tabs = ({ children, defaultValue = '', className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={className}>
      {children.map((child) => {
        if (child.type === TabsList) {
          return <child.type key="list" activeTab={activeTab} onTabChange={setActiveTab}>{child.props.children}</child.type>;
        }
        if (child.type === TabsContent) {
          return <child.type key="content" activeTab={activeTab}>{child.props.children}</child.type>;
        }
        return child;
      })}
    </div>
  );
};

const TabsList = ({ children, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`flex border-b border-nebula-stroke ${className}`}>
      {children.map((child) => {
        if (child.type === TabsTrigger) {
          return (
            <child.type
              key={child.props.value}
              isActive={activeTab === child.props.value}
              onClick={() => onTabChange(child.props.value)}
            >
              {child.props.children}
            </child.type>
          );
        }
        return child;
      })}
    </div>
  );
};

const TabsTrigger = ({ children, value, isActive, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 font-headline-sm text-headline-sm border-b-2 transition-smooth ${
        isActive
          ? 'border-primary text-primary'
          : 'border-transparent text-on-surface-variant hover:text-on-surface'
      } ${className}`}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, activeTab, className = '' }) => {
  return (
    <div className={className}>
      {children.map((child) => {
        if (child.type === TabsPanel) {
          return activeTab === child.props.value ? (
            <child.type key={child.props.value}>{child.props.children}</child.type>
          ) : null;
        }
        return child;
      })}
    </div>
  );
};

const TabsPanel = ({ children, value, className = '' }) => {
  return <div className={`py-4 ${className}`}>{children}</div>;
};

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
Tabs.Panel = TabsPanel;

export default Tabs;
