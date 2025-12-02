import React, { createContext, useContext, useState, ReactNode } from "react";

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface SectionCollaboration {
  collaborators: Collaborator[];
  activeEditors: string[]; // IDs of users currently editing
}

interface CollaborationState {
  main: SectionCollaboration;
  inherent: SectionCollaboration;
  control: SectionCollaboration;
  residual: SectionCollaboration;
  heatmap: SectionCollaboration;
  treatment: SectionCollaboration;
  issues: SectionCollaboration;
  metrics: SectionCollaboration;
  comments: SectionCollaboration;
  additional: SectionCollaboration;
}

interface CollaborationContextType {
  collaborationState: CollaborationState;
  updateSectionCollaboration: (
    sections: string[],
    collaborators: Collaborator[]
  ) => void;
  setActiveEditor: (sectionId: string, userId: string, isActive: boolean) => void;
  removeCollaboratorFromSection: (sectionId: string, userId: string) => void;
  removeCollaboratorFromAllSections: (userId: string) => void;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(
  undefined
);

const initialState: CollaborationState = {
  main: { 
    collaborators: [
      { id: "1", name: "Sarah Johnson", email: "sarah@example.com", role: "Senior Auditor" }
    ], 
    activeEditors: [] 
  },
  inherent: { 
    collaborators: [
      { id: "1", name: "Sarah Johnson", email: "sarah@example.com", role: "Senior Auditor" },
      { id: "2", name: "Michael Chen", email: "michael@example.com", role: "Compliance Officer" }
    ], 
    activeEditors: ["1"] 
  },
  control: { 
    collaborators: [
      { id: "2", name: "Michael Chen", email: "michael@example.com", role: "Compliance Officer" }
    ], 
    activeEditors: [] 
  },
  residual: { 
    collaborators: [
      { id: "3", name: "Emma Rodriguez", email: "emma@example.com", role: "Risk Analyst" }
    ], 
    activeEditors: [] 
  },
  heatmap: { collaborators: [], activeEditors: [] },
  treatment: { collaborators: [], activeEditors: [] },
  issues: { collaborators: [], activeEditors: [] },
  metrics: { collaborators: [], activeEditors: [] },
  comments: { collaborators: [], activeEditors: [] },
  additional: { collaborators: [], activeEditors: [] },
};

export const CollaborationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [collaborationState, setCollaborationState] = useState<CollaborationState>(initialState);

  const updateSectionCollaboration = (
    sections: string[],
    collaborators: Collaborator[]
  ) => {
    setCollaborationState((prev) => {
      const newState = { ...prev };
      sections.forEach((sectionId) => {
        if (newState[sectionId as keyof CollaborationState]) {
          newState[sectionId as keyof CollaborationState] = {
            ...newState[sectionId as keyof CollaborationState],
            collaborators,
          };
        }
      });
      return newState;
    });
  };

  const setActiveEditor = (
    sectionId: string,
    userId: string,
    isActive: boolean
  ) => {
    setCollaborationState((prev) => {
      const section = prev[sectionId as keyof CollaborationState];
      if (!section) return prev;

      const activeEditors = isActive
        ? [...section.activeEditors.filter((id) => id !== userId), userId]
        : section.activeEditors.filter((id) => id !== userId);

      return {
        ...prev,
        [sectionId]: {
          ...section,
          activeEditors,
        },
      };
    });
  };

  const removeCollaboratorFromSection = (sectionId: string, userId: string) => {
    setCollaborationState((prev) => {
      const section = prev[sectionId as keyof CollaborationState];
      if (!section) return prev;

      return {
        ...prev,
        [sectionId]: {
          collaborators: section.collaborators.filter((c) => c.id !== userId),
          activeEditors: section.activeEditors.filter((id) => id !== userId),
        },
      };
    });
  };

  const removeCollaboratorFromAllSections = (userId: string) => {
    setCollaborationState((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((sectionId) => {
        const section = newState[sectionId as keyof CollaborationState];
        newState[sectionId as keyof CollaborationState] = {
          collaborators: section.collaborators.filter((c) => c.id !== userId),
          activeEditors: section.activeEditors.filter((id) => id !== userId),
        };
      });
      return newState;
    });
  };

  return (
    <CollaborationContext.Provider
      value={{ 
        collaborationState, 
        updateSectionCollaboration, 
        setActiveEditor,
        removeCollaboratorFromSection,
        removeCollaboratorFromAllSections
      }}
    >
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error(
      "useCollaboration must be used within CollaborationProvider"
    );
  }
  return context;
};
