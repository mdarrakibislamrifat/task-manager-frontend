import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTab from "../../components/TaskStatusTab";
import TaskCard from "../../components/Cards/TaskCard";

const MyTasks = () => {
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

  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`);
  };

  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>

          {/* ৪. ট্যাব স্কেলিটন লোডার */}
          {isLoading ? (
            <div className="h-10 w-full lg:w-80 bg-gray-200 animate-pulse rounded-lg"></div>
          ) : (
            tabs?.[0]?.count > 0 && (
              <TaskStatusTab
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
            )
          )}
        </div>

        {/* ৫. টাস্ক কার্ড গ্রিড ও স্কেলিটন */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {isLoading ? (
            // লোডিং অবস্থায় ৬টি ডামি স্কেলিটন কার্ড
            [1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white border border-gray-100 rounded-xl p-5 space-y-4 animate-pulse shadow-sm"
              >
                <div className="flex justify-between">
                  <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full w-full mt-4"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex -space-x-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full border-2 border-white"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))
          ) : allTasks?.length > 0 ? (
            // আসল টাস্ক লিস্ট
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
                onClick={() => handleClick(item._id)}
              />
            ))
          ) : (
            // ডাটা না থাকলে এম্পটি স্টেট
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
              <p className="text-lg">No tasks found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;
