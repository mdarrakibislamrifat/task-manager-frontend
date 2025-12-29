import { use, useContext, useEffect, useState } from "react";
import useUserAuth from "../../hooks/useUserAuth";
import { UserProviderContext } from "../../context/UserContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import InfoCard from "../../components/Cards/InfoCard";
import { addThousandsSeparator } from "../../utils/helper";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

const Dashboard = () => {
  useUserAuth();

  const { user } = useContext(UserProviderContext);

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [pieChartData, setPieChartData] = useState({});

  const [barChartData, setBarChartData] = useState({});

  // Get Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  // Prepare Chart Data
  const prepareChartData = (data) => {
    const taskistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData = [
      {
        status: "Pending",
        count: taskistribution?.Pending || 0,
      },
      {
        status: "In Progress",
        count: taskistribution?.InProgress || 0,
      },
      {
        status: "Completed",
        count: taskistribution?.Completed || 0,
      },
    ];

    setPieChartData(taskDistributionData);

    const PriorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ];

    setBarChartData(PriorityLevelData);
  };

  const getDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASK.GET_DASHBOARD_DATA,
      );
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts);
      }
    } catch (err) {
      console.log("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  useEffect(() => {
    getDashboardData();
    return () => {};
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="animate-pulse space-y-6 my-5">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">
              {getGreeting()}! {user?.name}
            </h2>
            <p className="text-xs md:text-[13px]text-gray-400 mt-1.5">
              {moment().format("dddd,Do MMMM, YYYY")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <InfoCard
            label="Total Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.All || 0,
            )}
            color="bg-primary"
          />

          <InfoCard
            label="Pending Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Pending || 0,
            )}
            color="bg-violet-500"
          />

          <InfoCard
            label="In Progress Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.InProgress || 0,
            )}
            color="bg-cyan-500"
          />

          <InfoCard
            label="Completed Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Completed || 0,
            )}
            color="bg-lime-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h1 className="font-medium">Task Distribution</h1>
            </div>
            <CustomPieChart data={pieChartData} colors={COLORS} />
          </div>
        </div>

        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h1 className="font-medium">Task Priority Levels</h1>
            </div>
            <CustomBarChart data={barChartData} />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent Tasks</h5>
              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight className="text-base" />
              </button>
            </div>

            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
