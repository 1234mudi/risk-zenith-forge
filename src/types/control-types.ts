
export type Control = {
  id: string;
  controlId: string;
  name: string;
  designEffect: string;
  operativeEffect: string;
  effectiveness: string;
  weighting: string;
  isKeyControl: boolean;
  category: string;
  comments: string;
  testResults?: {
    lastTested: string;
    result: string;
    tester: string;
    findings: string;
  }
};

export type ControlLibraryItem = {
  id: string;
  name: string;
  category: string;
  description: string;
};
