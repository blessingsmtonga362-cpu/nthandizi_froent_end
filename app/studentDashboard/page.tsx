import Link from "next/link";
export default function StudentDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">Student Dashboard</h1>
        <p className="text-lg mb-8">Welcome to your dashboard! Here you can manage your courses, view your progress, and access resources.</p>
        <div className="flex space-x-4">
            <Link href="/studentDashboard/courses" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">My Courses</Link>
        </div>
    </div>
  );
}