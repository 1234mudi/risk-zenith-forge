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
  inherent: SectionCollaboration;
  control: SectionCollaboration;
  residual: SectionCollaboration;
  issues: SectionCollaboration;
  additional: SectionCollaboration;
}

interface CollaborationContextType {
  collaborationState: CollaborationState;
  updateSectionCollaboration: (
    sections: string[],
    collaborators: Collaborator[]
  ) => void;
  setActiveEditor: (sectionId: string, userId: string, isActive: boolean) => void;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(
  undefined
);

const initialState: CollaborationState = {
  inherent: { collaborators: [], activeEditors: [] },
  control: { collaborators: [], activeEditors: [] },
  residual: { collaborators: [], activeEditors: [] },
  issues: { collaborators: [], activeEditors: [] },
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

  return (
    <CollaborationContext.Provider
      value={{ collaborationState, updateSectionCollaboration, setActiveEditor }}
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
