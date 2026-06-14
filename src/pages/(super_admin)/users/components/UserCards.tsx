import { useState, useEffect } from "react";
import { Users, TrendingUp } from "lucide-react";

interface UserStats {
  totalUsers: number;
  totalAdmins: number;
  totalSuperAdmins: number;
  activeUsers: number;
  newUsersThisMonth: number;
}

export default function UserCards() {
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    totalAdmins: 0,
    totalSuperAdmins: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
  });
  useEffect(() => {
    setStats({
      totalUsers: 124,
      totalAdmins: 24,
      totalSuperAdmins: 3,
      activeUsers: 118,
      newUsersThisMonth: 8,
    });
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users className="h-6 w-6 text-indigo-600" />,
      change: "+12%",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
    {
      title: "Total Admins",
      value: stats.totalAdmins,
      icon: <Users className="h-6 w-6 text-emerald-600" />,
      change: "+5%",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },

    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: <TrendingUp className="h-6 w-6 text-rose-600" />,
      change: "95%",
      bgColor: "bg-rose-50",
      textColor: "text-rose-600",
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">User Management</h1>
        <p className="page-subtitle">Manage users, admins, and organizations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full my-6 ">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-brand-light/20 rounded-xl cursor-pointer border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow page-subtitle"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-slate-900">
                  {card.value}
                </p>
                <p className="text-xs text-green-600 mt-2">
                  {card.change} from last month
                </p>
              </div>
              <div
                className={`h-12 w-12 rounded-lg ${card.bgColor} flex items-center justify-center`}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
