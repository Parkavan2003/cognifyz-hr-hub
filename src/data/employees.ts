export const ROLES = [
  "Founder / Director",
  "CEO",
  "COO",
  "CTO",
  "Vice President",
  "Senior Manager",
  "Manager",
  "Assistant Manager",
  "Team Lead",
  "Senior Employee",
  "Employee",
  "Intern"
] as const;

export type Role = typeof ROLES[number];

export const ROLE_HIERARCHY: Record<Role, number> = {
  "Founder / Director": 0,
  "CEO": 1,
  "COO": 2,
  "CTO": 2,
  "Vice President": 3,
  "Senior Manager": 4,
  "Manager": 5,
  "Assistant Manager": 6,
  "Team Lead": 7,
  "Senior Employee": 8,
  "Employee": 9,
  "Intern": 10,
};

export const DEPARTMENTS = [
  "Executive",
  "Engineering",
  "Product",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
  "Operations",
  "Customer Success"
] as const;

export type Department = typeof DEPARTMENTS[number];

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: Department;
  reportingManagerId: string | null;
  avatar?: string;
  salary: number;
  joinDate: string;
}

export const initialEmployees: Employee[] = [
  {
    id: "1",
    name: "Ramachandran Iyer",
    email: "ramachandran.iyer@cognifyz.com",
    role: "Founder / Director",
    department: "Executive",
    reportingManagerId: null,
    salary: 500000,
    joinDate: "2018-01-15",
  },
  {
    id: "2",
    name: "Lakshmi Venkatesh",
    email: "lakshmi.venkatesh@cognifyz.com",
    role: "CEO",
    department: "Executive",
    reportingManagerId: "1",
    salary: 400000,
    joinDate: "2018-03-20",
  },
  {
    id: "3",
    name: "Sanjay Krishnan",
    email: "sanjay.krishnan@cognifyz.com",
    role: "CTO",
    department: "Engineering",
    reportingManagerId: "2",
    salary: 350000,
    joinDate: "2018-06-10",
  },
  {
    id: "4",
    name: "Annapurna Sundaram",
    email: "annapurna.sundaram@cognifyz.com",
    role: "COO",
    department: "Operations",
    reportingManagerId: "2",
    salary: 350000,
    joinDate: "2018-07-01",
  },
  {
    id: "5",
    name: "Murugan Selvaraj",
    email: "murugan.selvaraj@cognifyz.com",
    role: "Vice President",
    department: "Engineering",
    reportingManagerId: "3",
    salary: 280000,
    joinDate: "2019-02-15",
  },
  {
    id: "6",
    name: "Kavitha Ramamurthy",
    email: "kavitha.ramamurthy@cognifyz.com",
    role: "Vice President",
    department: "Marketing",
    reportingManagerId: "4",
    salary: 275000,
    joinDate: "2019-04-20",
  },
  {
    id: "7",
    name: "Senthil Kumar",
    email: "senthil.kumar@cognifyz.com",
    role: "Senior Manager",
    department: "Engineering",
    reportingManagerId: "5",
    salary: 200000,
    joinDate: "2019-08-10",
  },
  {
    id: "8",
    name: "Meenakshi Natarajan",
    email: "meenakshi.natarajan@cognifyz.com",
    role: "Senior Manager",
    department: "Product",
    reportingManagerId: "5",
    salary: 195000,
    joinDate: "2019-09-15",
  },
  {
    id: "9",
    name: "Karthikeyan Pillai",
    email: "karthikeyan.pillai@cognifyz.com",
    role: "Manager",
    department: "Engineering",
    reportingManagerId: "7",
    salary: 150000,
    joinDate: "2020-01-20",
  },
  {
    id: "10",
    name: "Saraswathi Devi",
    email: "saraswathi.devi@cognifyz.com",
    role: "Manager",
    department: "Marketing",
    reportingManagerId: "6",
    salary: 145000,
    joinDate: "2020-03-10",
  },
  {
    id: "11",
    name: "Balaji Narayanan",
    email: "balaji.narayanan@cognifyz.com",
    role: "Assistant Manager",
    department: "Engineering",
    reportingManagerId: "9",
    salary: 110000,
    joinDate: "2020-06-15",
  },
  {
    id: "12",
    name: "Priya Subramaniam",
    email: "priya.subramaniam@cognifyz.com",
    role: "Assistant Manager",
    department: "Human Resources",
    reportingManagerId: "4",
    salary: 105000,
    joinDate: "2020-08-20",
  },
  {
    id: "13",
    name: "Vignesh Palaniswamy",
    email: "vignesh.palaniswamy@cognifyz.com",
    role: "Team Lead",
    department: "Engineering",
    reportingManagerId: "11",
    salary: 90000,
    joinDate: "2021-01-10",
  },
  {
    id: "14",
    name: "Deepa Ranganathan",
    email: "deepa.ranganathan@cognifyz.com",
    role: "Team Lead",
    department: "Sales",
    reportingManagerId: "10",
    salary: 85000,
    joinDate: "2021-03-15",
  },
  {
    id: "15",
    name: "Arun Shanmugam",
    email: "arun.shanmugam@cognifyz.com",
    role: "Senior Employee",
    department: "Engineering",
    reportingManagerId: "13",
    salary: 75000,
    joinDate: "2021-06-20",
  },
  {
    id: "16",
    name: "Divya Thiruvenkatam",
    email: "divya.thiruvenkatam@cognifyz.com",
    role: "Senior Employee",
    department: "Product",
    reportingManagerId: "8",
    salary: 72000,
    joinDate: "2021-08-10",
  },
  {
    id: "17",
    name: "Prakash Govindaraj",
    email: "prakash.govindaraj@cognifyz.com",
    role: "Employee",
    department: "Engineering",
    reportingManagerId: "13",
    salary: 55000,
    joinDate: "2022-01-15",
  },
  {
    id: "18",
    name: "Gayathri Muralidharan",
    email: "gayathri.muralidharan@cognifyz.com",
    role: "Employee",
    department: "Marketing",
    reportingManagerId: "10",
    salary: 52000,
    joinDate: "2022-03-20",
  },
  {
    id: "19",
    name: "Rajesh Balasubramanian",
    email: "rajesh.balasubramanian@cognifyz.com",
    role: "Employee",
    department: "Sales",
    reportingManagerId: "14",
    salary: 50000,
    joinDate: "2022-06-10",
  },
  {
    id: "20",
    name: "Sangeetha Ramasamy",
    email: "sangeetha.ramasamy@cognifyz.com",
    role: "Intern",
    department: "Engineering",
    reportingManagerId: "13",
    salary: 25000,
    joinDate: "2024-01-15",
  },
  {
    id: "21",
    name: "Harish Chandrasekaran",
    email: "harish.chandrasekaran@cognifyz.com",
    role: "Intern",
    department: "Product",
    reportingManagerId: "8",
    salary: 22000,
    joinDate: "2024-02-20",
  },
  {
    id: "22",
    name: "Nandhini Vasudevan",
    email: "nandhini.vasudevan@cognifyz.com",
    role: "Intern",
    department: "Human Resources",
    reportingManagerId: "12",
    salary: 20000,
    joinDate: "2024-03-10",
  },
];

export function canSeeEmployee(viewerRole: Role, targetRole: Role): boolean {
  return ROLE_HIERARCHY[viewerRole] < ROLE_HIERARCHY[targetRole];
}

export function canAssignTasks(role: Role): boolean {
  return ROLE_HIERARCHY[role] <= ROLE_HIERARCHY["Assistant Manager"];
}

export function canMessageEmployee(senderRole: Role, receiverRole: Role): boolean {
  if (senderRole === "Founder / Director") return true;
  return ROLE_HIERARCHY[senderRole] < ROLE_HIERARCHY[receiverRole];
}

export function getSubordinates(employees: Employee[], viewerRole: Role): Employee[] {
  return employees.filter(emp => canSeeEmployee(viewerRole, emp.role));
}

export function getRoleColor(role: Role): string {
  const colors: Record<Role, string> = {
    "Founder / Director": "bg-chart-4/10 text-chart-4 border-chart-4/20",
    "CEO": "bg-primary/10 text-primary border-primary/20",
    "COO": "bg-chart-2/10 text-chart-2 border-chart-2/20",
    "CTO": "bg-chart-5/10 text-chart-5 border-chart-5/20",
    "Vice President": "bg-chart-3/10 text-chart-3 border-chart-3/20",
    "Senior Manager": "bg-info/10 text-info border-info/20",
    "Manager": "bg-success/10 text-success border-success/20",
    "Assistant Manager": "bg-warning/10 text-warning border-warning/20",
    "Team Lead": "bg-primary/10 text-primary border-primary/20",
    "Senior Employee": "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20",
    "Employee": "bg-secondary text-secondary-foreground border-border",
    "Intern": "bg-accent text-accent-foreground border-accent-foreground/20",
  };
  return colors[role];
}
