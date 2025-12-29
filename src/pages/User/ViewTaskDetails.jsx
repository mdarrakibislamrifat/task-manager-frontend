import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import moment from "moment";
import AvatarGroup from "../../components/AvatarGroup";
import { LuSquareArrowDownRight } from "react-icons/lu";

const ViewTaskDetails = () => {
  const { id } = useParams();

  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";

      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/10";

      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  // Get task info by id
  const getTaskDetailsById = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASK.GET_TASK_BY_ID(id),
      );
      if (response.data) {
        const taskInfo = response.data;
        setTask(taskInfo);
      }
    } catch (err) {
      console.error("Error fetching task details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // handle todo check
  const updateTodoChecklist = async (index) => {
    if (!task) return;

    const updatedChecklist = task.todoChecklist.map((item, idx) =>
      idx === index ? { ...item, completed: !item.completed } : item,
    );

    try {
      const response = await axiosInstance.put(
        API_PATHS.TASK.UPDATE_TASK_CHECKLIST(id),
        { todoChecklist: updatedChecklist },
      );

      if (response.status === 200) {
        setTask(response.data.task);
      }
    } catch (error) {
      console.error("Error updating checklist:", error);
    }
  };

  // Handle Attachment link lick
  const handleLinkClick = (link) => {
    if (!/^https?:\/\//.test(link)) {
      link = `https://${link}`;
    }
    window.open(link, "_blank");
  };

  useEffect(() => {
    getTaskDetailsById(id);
    return () => {};
  }, [id]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="mt-5">
        {isLoading ? (
          // ১. টাস্ক ডিটেইলস স্কেলিটন
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
            <div className="form-card col-span-3 space-y-6">
              {/* Title Skeleton */}
              <div className="flex justify-between items-center">
                <div className="h-7 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>

              {/* Description Skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-100 rounded w-full"></div>
              </div>

              {/* Priority, Date, Assigned Skeleton */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex -space-x-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full border-2 border-white"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full border-2 border-white"></div>
                  </div>
                </div>
              </div>

              {/* Checklist Skeleton */}
              <div className="space-y-3 pt-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : task ? (
          // ২. আসল ডাটা (লোডিং শেষ হলে)
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="form-card col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm md:text-xl font-medium">
                  {task?.title}
                </h2>
                <div
                  className={`text-[11px] md:text-[13px] font-medium ${getStatusTagColor(
                    task?.status,
                  )} px-4 py-0.5 rounded`}
                >
                  {task?.status}
                </div>
              </div>

              <div className="mt-4">
                <InfoBox label="Description" value={task?.description} />
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 md:col-span-4">
                  <InfoBox label="Priority" value={task?.priority} />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Due Date"
                    value={
                      task?.dueDate
                        ? moment(task?.dueDate).format("DD-MM-YYYY")
                        : "N/A"
                    }
                  />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-500">
                    Assigned To
                  </label>
                  <AvatarGroup
                    avatars={
                      task?.assignedTo?.map((item) => item?.profileImageUrl) ||
                      []
                    }
                    maxVisible={5}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="text-xs font-medium text-slate-500">
                  Todo Checklist
                </label>
                {task?.todoChecklist?.map((item, index) => (
                  <TodoCheckList
                    key={`todo_${index}`}
                    text={item?.text}
                    isChecked={item?.completed === true}
                    onChange={() => updateTodoChecklist(index)}
                  />
                ))}
              </div>

              {task?.attachments?.length > 0 && (
                <div className="mt-4">
                  <label className="text-xs font-medium text-slate-500">
                    Attachments
                  </label>
                  {task?.attachments?.map((link, index) => (
                    <Attachment
                      key={`link_${index}`}
                      link={link}
                      index={index}
                      onClick={() => handleLinkClick(link)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            Task details not found.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;

const InfoBox = ({ label, value }) => {
  return (
    <>
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <p className="text-[13px] md:text-[13px] font-medium text-gray-700 mt-0.5">
        {value}
      </p>
    </>
  );
};

const TodoCheckList = ({ text, isChecked, onChange }) => {
  return (
    <div className="flex items-center gap-3 p-3">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer "
      />
      <p className="text-[13px] text-gray-800">{text}</p>
    </div>
  );
};

const Attachment = ({ link, index, onClick }) => {
  return (
    <div
      className="flex justify-between bg-gray-100 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex-1 flex items-center gap-3 ">
        <span className="text-xs text-gray-400 font-semibold nr-2">
          {index < 9 ? `0${index + 1}` : index + 1}
        </span>
        <p className="text-xs text-black">{link}</p>
      </div>
      <LuSquareArrowDownRight className="text-gray-400" />
    </div>
  );
};
