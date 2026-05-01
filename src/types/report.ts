export type Severity = 'low' | 'medium' | 'high';
export type Status   = 'pending' | 'confirmed' | 'assigned' | 'resolved';
export type Category = 'bache' | 'agua' | 'basura' | 'alumbrado' | 'drenaje' | 'grafiti' | 'otro';

export type Report = {
  id: string;
  type: Category;
  title: string;
  location: string;
  time: string;
  severity: Severity;
  votes: number;
  status?: Status | string;  // allows DB text values (e.g. 'pendiente')
};
