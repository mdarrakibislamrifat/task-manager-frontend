import { use, useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import UserCard from "../../components/Cards/UserCard";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Download Task Report
  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
        responseType: "blob",
      });

      // Create a url for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users-report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading report:", err);
      toast.error("Failed to download report.Please try again.");
    }
  };

  useEffect(() => {
    getAllUsers();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Team Members</h2>

          {/* লোডিং শেষ না হওয়া পর্যন্ত ডাউনলোড বাটন হাইড রাখতে পারেন অথবা ডিজেবল করতে পারেন */}
          {!isLoading && (
            <button
              className="flex md:flex download-btn"
              onClick={handleDownloadReport}
            >
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {isLoading ? (
            // ৪. ইউজার কার্ড স্কেলিটন (৬টি ডামি কার্ড)
            [1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white border border-gray-100 rounded-xl p-5 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  {/* সার্কেল প্রোফাইল ইমেজ স্কেলিটন */}
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    {/* নাম এবং ইমেইল স্কেলিটন */}
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))
          ) : allUsers?.length > 0 ? (
            // ৫. আসল ইউজার লিস্ট
            allUsers.map((user) => <UserCard key={user._id} userInfo={user} />)
          ) : (
            // ৬. যদি কোন ইউজার না পাওয়া যায়
            <div className="col-span-full text-center py-10 text-gray-400">
              No team members found.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
