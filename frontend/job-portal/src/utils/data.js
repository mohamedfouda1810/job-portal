import {
    Search,
    Users,
    FileText,
    MessageSquare,
    BarChart3,
    Shield,
    Clock,
    Award,
    Briefcase,
    Building2,
    LayoutDashboard,
    Plus

} from 'lucide-react'


export const jobSeekerFeatures = [
    {
        icon: Search,
        title: "Smart Job Matching ",
        description:
            'AI POweres algorithm you with relevant opportunties on tour skills and prefrences'
    },
    {
        icon: FileText,
        title: "Resume Buildert  ",
        description:
            'Create proffesional resumes '
    },
    {
        icon: MessageSquare,
        title: "Direct COmmunication ",
        description:
            'Connect Directly with employers '
    }, {
        icon: Award,
        title: "Skill Assessment",
        description:
            'showcase your abilities with verfied skill tests and earn badges '
    },

];

export const employerFeatures = [
     {
        icon: Users,
        title: "Talent Pool Access   ",
        description:
            'Access our vast database '
    },   {
        icon: BarChart3,
        title: "Analytics Dashboard   ",
        description:
            'Track your hiring performance  '
    },
       {
        icon: Shield,
        title: "verfied Candidates   ",
        description:
            'All Candidates undergo background verfication'
    },
        {
        icon: Clock,
        title: "Quick hiring   ",
        description:
            'Streamlined hiring process reduces '
    }, 
       
];

// Navigation items configrations
export const NAVIGATION_MENU = [
    { id: 'employer', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'post-job', name: 'Post job ', icon: Plus },
    { id: 'manage-jobs', name: 'Manage Jobs ', icon: Briefcase },
    { id: 'company-profile', name: 'Comoany Profile', icon: Building2 },
    
];

// Categories  
export const CATEGORIES = [
    { value: "Engineering", label: "Engineering" },
    { value: "Design", label: "Design" },
    { value: "Marketing", label: "Marketing" },
    { value: "Sales", label: "Sales" },
    { value: "IT & Software", label: "IT & Software" },
    { value: "Customer-service", label: "Customer-service" },
    { value: "Product", label: "Product" },
    { value: "Finance", label: "Finance" },
    { value: "HR", label: "HR" },
    { value: "Other", label: "Other" },

    
]


// Job Types

export const JOB_TYPES = [
    { value: "Remote", label: "Remote" },
    { value: "Full-Time", label: "Full-Time" },
    { value: "Part-Time", label: "Part-Time" },
    { value: "Contract", label: "Contract" },
    { value: "Internship", label: "Internship" },
    
]


//  Salary Range

export const SALARY_RANGES = [
    'less than $1000',
    '$1000 - $15000',
    'More than $15000'

]