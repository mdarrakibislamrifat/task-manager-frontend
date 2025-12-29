import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTab from "../../components/TaskStatusTab";
import TaskCard from "../../components/Cards/TaskCard";

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const getAllTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance(API_PATHS.TASK.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

      // Map status Summary data with exact keys from your API
      const statusSummary = response.data?.statusSummary || {};

      const statusArray = [
        {
          label: "All",
          count: statusSummary.all || 0,
        },
        {
          label: "Pending",
          count: statusSummary.pendingTasks || 0,
        },
        {
          label: "In Progress",
          count: statusSummary.inProgressTasks || 0,
        },
        {
          label: "Completed",
          count: statusSummary.completedTasks || 0,
        },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (taskData) => {
    navigate(`/admin/create-task`, { state: { taskId: taskData._id } });
  };

  // download task report
  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "task_details.xlsx");
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
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-medium">My Tasks</h2>
            {!isLoading && (
              <button
                className="flex lg:hidden download-btn"
                onClick={handleDownloadReport}
              >
                <LuFileSpreadsheet className="text-lg" /> Download Report
              </button>
            )}
          </div>

          {/* ৪. ট্যাব স্কেলিটন অথবা ট্যাব */}
          {isLoading ? (
            <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-md"></div>
          ) : (
            tabs?.[0]?.count > 0 && (
              <div className="flex items-center gap-3">
                <TaskStatusTab
                  tabs={tabs}
                  activeTab={filterStatus}
                  setActiveTab={setFilterStatus}
                />
                <button
                  className="hidden lg:flex download-btn"
                  onClick={handleDownloadReport}
                >
                  <LuFileSpreadsheet className="text-lg" /> Download Report
                </button>
              </div>
            )
          )}
        </div>

        {/* ৫. টাস্ক কার্ড গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {isLoading ? (
            // লোডিং অবস্থায় ৬টি স্কেলিটন কার্ড দেখাবে
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-xl p-5 space-y-4 animate-pulse"
              >
                <div className="flex justify-between items-start">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="flex gap-2 py-2">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="pt-4 border-t border-gray-50 flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))
          ) : allTasks.length > 0 ? (
            allTasks.map((item) => (
              <TaskCard
                key={item._id}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                progress={item.progress}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={item.assignedTo?.map((u) => u.profileImageUrl)}
                attachmentCount={item.attachments?.length || 0}
                completedTodoCount={item.completedTodoCount || 0}
                todoChecklist={item.todoChecklist || []}
                onClick={() => handleClick(item)}
              />
            ))
          ) : (
            // যদি কোন টাস্ক না থাকে
            <div className="col-span-full text-center py-10 text-gray-400">
              No tasks found.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;
