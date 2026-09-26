export interface EmployeeTask {
  id: string;
  title: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
}

export interface EmployeeTarget {
  metric: string;
  achieved: number;
  goal: number;
  percentage: number;
}
