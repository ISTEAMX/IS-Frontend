# Key Features: IS-frontend

## Administrative Management
The core functionality revolves around the administration of various academic entities:

### 1. Group Management
- **Description**: Organize and manage student groups.
- **Actions**: Add, edit, and delete student cohorts.
- **Workflow**: Admins can quickly search through existing groups and modify their names or membership counts.

### 2. Room Management
- **Description**: Configure educational facilities (classrooms, labs, lecture halls).
- **Actions**: Track room availability, capacity, and equipment.
- **Workflow**: Manage physical spaces and assign them to specific activities.

### 3. Subject Management
- **Description**: Define the academic curriculum.
- **Actions**: Create subjects, set credit hours, and categorize them by department.
- **Workflow**: Links subjects to relevant student groups and teachers.

### 4. Teacher Management
- **Description**: Manage the list of educators.
- **Actions**: Store teacher contact info, expertise, and availability.
- **Workflow**: View teacher assignments and workload across different subjects.

## User Authentication
- **Secure Login**: Access control via JWT-based authentication.
- **Registration**: Onboarding of new users with role-based permissions (Admin/User).
- **Session Management**: Automatic token refresh and session persistence.

## Dashboard & Scheduling (Work-in-Progress)
- **Visual Schedule**: View upcoming events and classes.
- **Resource Overview**: A high-level view of available rooms and current teacher assignments.

## Error Tracking & Monitoring
- **Global Error Handlers**: Catches uncaught JavaScript errors (`window.onerror`) and unhandled promise rejections, automatically reporting them to the backend.
- **React Error Boundary**: Wraps the entire application in an `ErrorBoundary` component that catches render errors, displays a user-friendly fallback UI, and reports the error to AWS CloudWatch via the backend.
- **API Error Reporting**: All non-401 Axios response errors are automatically reported with the HTTP method and URL context.
- **Silent Reporting**: Error reporting never interrupts the user experience — all failures in the reporting pipeline are silently swallowed.

