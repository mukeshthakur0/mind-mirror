import Sidebar from "../components/sidebar";
import Chart from "./charts";
function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
        <Chart />
    </div>
  );
}
export default Dashboard;