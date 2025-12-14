"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { dashboardStats, expenses, approvals } from "@/lib/mock-data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#64748b"]

export default function DashboardPage() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const budgetUsagePercent = Math.round((dashboardStats.usedBudget / dashboardStats.totalBudget) * 100)

  return (
    <MainLayout title="工作台" breadcrumbs={[{ label: "工作台" }]}>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg shadow-blue-500/25">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">年度总预算</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(dashboardStats.totalBudget)}</p>
                  <p className="text-blue-100 text-xs mt-2">已使用 {budgetUsagePercent}%</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-wallet text-2xl" />
                </div>
              </div>
              <div className="mt-4 bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${budgetUsagePercent}%` }} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg shadow-green-500/25">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">本月支出</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(dashboardStats.monthlyExpense)}</p>
                  <p className="text-green-100 text-xs mt-2">
                    <i className="fa-solid fa-arrow-up mr-1" />
                    较上月 +8.5%
                  </p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-chart-line text-2xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 shadow-lg shadow-amber-500/25">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">待审批事项</p>
                  <p className="text-2xl font-bold mt-1">{dashboardStats.pendingApprovals}</p>
                  <p className="text-amber-100 text-xs mt-2">需要您的处理</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-clipboard-check text-2xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-0 shadow-lg shadow-cyan-500/25">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100 text-sm">发票总数</p>
                  <p className="text-2xl font-bold mt-1">{dashboardStats.invoiceCount}</p>
                  <p className="text-cyan-100 text-xs mt-2">本月新增 32 张</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-file-invoice text-2xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Trend */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">月度费用趋势</CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  实际支出
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  预算
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardStats.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={12}
                      tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", strokeWidth: 2 }}
                      name="实际支出"
                    />
                    <Line
                      type="monotone"
                      dataKey="budget"
                      stroke="#10b981"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "#10b981", strokeWidth: 2 }}
                      name="预算"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Expense by Category */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">费用类型分布</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardStats.expenseByCategory}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="amount"
                      nameKey="category"
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {dashboardStats.expenseByCategory.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Budget & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Budget */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">部门预算使用情况</CardTitle>
              <Link href="/budget">
                <Button variant="ghost" size="sm" className="text-blue-500">
                  查看详情 <i className="fa-solid fa-arrow-right ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardStats.departmentBudget} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
                    <XAxis
                      type="number"
                      stroke="#64748b"
                      fontSize={12}
                      tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                    />
                    <YAxis type="category" dataKey="department" stroke="#64748b" fontSize={12} width={60} />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="budget" fill="#e2e8f0" name="预算" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="used" fill="#3b82f6" name="已使用" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">快捷操作</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/expense/apply">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex-col gap-2 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 bg-transparent"
                  >
                    <i className="fa-solid fa-file-circle-plus text-xl" />
                    <span className="text-sm">费用申请</span>
                  </Button>
                </Link>
                <Link href="/reimbursement/apply">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex-col gap-2 hover:bg-green-50 hover:border-green-500 hover:text-green-600 bg-transparent"
                  >
                    <i className="fa-solid fa-receipt text-xl" />
                    <span className="text-sm">报销申请</span>
                  </Button>
                </Link>
                <Link href="/invoice">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex-col gap-2 hover:bg-amber-50 hover:border-amber-500 hover:text-amber-600 bg-transparent"
                  >
                    <i className="fa-solid fa-file-invoice text-xl" />
                    <span className="text-sm">发票管理</span>
                  </Button>
                </Link>
                <Link href="/approval/pending">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex-col gap-2 hover:bg-cyan-50 hover:border-cyan-500 hover:text-cyan-600 bg-transparent"
                  >
                    <i className="fa-solid fa-clipboard-check text-xl" />
                    <span className="text-sm">待审批</span>
                  </Button>
                </Link>
                <Link href="/reports/expense">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex-col gap-2 hover:bg-purple-50 hover:border-purple-500 hover:text-purple-600 bg-transparent"
                  >
                    <i className="fa-solid fa-chart-column text-xl" />
                    <span className="text-sm">费用报表</span>
                  </Button>
                </Link>
                <Link href="/budget">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex-col gap-2 hover:bg-pink-50 hover:border-pink-500 hover:text-pink-600 bg-transparent"
                  >
                    <i className="fa-solid fa-wallet text-xl" />
                    <span className="text-sm">预算管理</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Approvals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">待审批事项</CardTitle>
              <Link href="/approval/pending">
                <Button variant="ghost" size="sm" className="text-blue-500">
                  查看全部 <i className="fa-solid fa-arrow-right ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {approvals.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          item.type === "expense" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                        }`}
                      >
                        <i
                          className={`fa-solid ${item.type === "expense" ? "fa-file-invoice-dollar" : "fa-receipt"}`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{item.title}</p>
                        <p className="text-xs text-slate-500">
                          {item.applicant} · {item.department}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">{formatCurrency(item.amount)}</p>
                      <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600 border-amber-200">
                        第{item.step}/{item.totalSteps}步
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Expenses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">最近费用申请</CardTitle>
              <Link href="/expense">
                <Button variant="ghost" size="sm" className="text-blue-500">
                  查看全部 <i className="fa-solid fa-arrow-right ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expenses.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-600">
                        <i className="fa-solid fa-file-lines" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{item.title}</p>
                        <p className="text-xs text-slate-500">
                          {item.code} · {item.applyDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">{formatCurrency(item.amount)}</p>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          item.status === "approved"
                            ? "bg-green-50 text-green-600 border-green-200"
                            : item.status === "pending"
                              ? "bg-amber-50 text-amber-600 border-amber-200"
                              : "bg-red-50 text-red-600 border-red-200"
                        }`}
                      >
                        {item.status === "approved" ? "已通过" : item.status === "pending" ? "审批中" : "已驳回"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
