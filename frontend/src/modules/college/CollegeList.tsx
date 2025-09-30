import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { College } from "@/types";
import { Button } from "@/components/ui/button";
import AddCollegeDialog from "./CollegeAddDialog"; // <-- Import the new component

export default function CollegeList() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // We moved the fetch logic into a reusable function
  const fetchColleges = () => {
    setLoading(true);
    api
      .get("/colleges/")
      .then((response) => {
        setColleges(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError("Failed to load colleges. Is the backend running?");
        setLoading(false);
      });
  };

  // Initial load
  useEffect(() => {
    fetchColleges();
  }, []);

  if (loading && colleges.length === 0)
    return <p className="text-center p-4">Loading colleges...</p>;
  if (error) return <p className="text-center text-red-500 p-4">{error}</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Colleges</h1>
          <p className="text-zinc-500 text-sm">Manage university departments</p>
        </div>

        {/* <-- REPLACED THE OLD BUTTON WITH THE DIALOG --> */}
        <AddCollegeDialog onCollegeAdded={fetchColleges} />
      </div>

      <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 border-b">
            <tr>
              <th className="p-4 font-medium text-zinc-500">Code</th>
              <th className="p-4 font-medium text-zinc-500">Name</th>
              <th className="p-4 font-medium text-zinc-500 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {colleges.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-zinc-500">
                  No colleges found. Click "Add College" to create one.
                </td>
              </tr>
            ) : (
              colleges.map((college) => (
                <tr
                  key={college.id}
                  className="border-b last:border-0 hover:bg-zinc-50 transition-colors"
                >
                  <td className="p-4 font-medium">{college.college_code}</td>
                  <td className="p-4">{college.college_name}</td>
                  <td className="p-4 text-right space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
