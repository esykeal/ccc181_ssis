import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, BookOpen } from "lucide-react";
import api from "@/lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_students: 0,
    total_colleges: 0,
    total_programs: 0,
  });

  useEffect(() => {
    api
      .get("/stats/")
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch dashboard stats:", error);
      });
  }, []);

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {/* STUDENTS CARD */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Display the live number */}
            <div className="text-2xl font-bold">{stats.total_students}</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>

        {/* COLLEGES CARD */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Colleges
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Display the live number */}
            <div className="text-2xl font-bold">{stats.total_colleges}</div>
            <p className="text-xs text-muted-foreground">
              Departments & Colleges
            </p>
          </CardContent>
        </Card>

        {/* PROGRAMS CARD */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Programs Offered
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Display the live number */}
            <div className="text-2xl font-bold">{stats.total_programs}</div>
            <p className="text-xs text-muted-foreground">Academic courses</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
