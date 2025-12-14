"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dashboardStats } from "@/lib/mock-data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#6366f1"]

export default function ExpenseReportPage() {
  const [year, setYear] = useState("2024")
  const [quarter, setQuarter] = useState("all")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 0,
    }).format(value)
  }

  // Mock detailed expense data
  const monthlyExpenseData = dashboardStats.monthlyTrend.map((item) => ({
    ...item,
    差旅费: Math.round(item.expense * 0.28),
    办公费: Math.round(item.expense * 0.18),
    招待费: Math.round(item.expense * 0.15),
    培训费: Math.round(item.expense * 0.2),
    交通费: Math.round(item.expense * 0.08),
    其他: Math.round(item.expense * 0.11),
  }))

  const categoryData = dashboardStats.expenseByCategory.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }))

  // Export function
  const handleExport = () => {
    const headers = ["月份", "差旅费", "办公费", "招待费", "培训费", "交通费", "其他", "合计"]
    const rows = monthlyExpenseData.map((item) => [
      item.month,
      item.差旅费,
      item.办公费,
      item.招待费,
      item.培训费,
      item.交通费,
      item.其他,
      item.expense,
    ])
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `费用报表_${year}_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const totalExpense = dashboardStats.monthlyTrend.reduce((sum, item) => sum + item.expense, 0)
  const avgMonthlyExpense = Math.round(totalExpense / 12)
  const maxMonthExpense = Math.max(...dashboardStats.monthlyTrend.map((item) => item.expense))
  const topCategory = dashboardStats.expenseByCategory.reduce(
    (max, item) => (item.amount > max.amount ? item : max),
    dashboardStats.expenseByCategory[0],
  )

  return (
    <MainLayout title="费用报表" breadcrumbs={[{ label: "报表中心" }, { label: "费用报表" }]}>
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">年度：</span>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024年</SelectItem>
                      <SelectItem value="2023">2023年</SelectItem>
                      <SelectItem value="2022">2022年</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">季度：</span>
                  <Select value={quarter} onValueChange={setQuarter}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全年</SelectItem>
                      <SelectItem value="Q1">第一季度</SelectItem>
                      <SelectItem value="Q2">第二季度</SelectItem>
                      <SelectItem value="Q3">第三季度</SelectItem>
                      <SelectItem value="Q4">第四季度</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button variant="outline" onClick={handleExport}>
                <i className="fa-solid fa-download mr-2" />
                导出报表
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <i className="fa-solid fa-sack-dollar text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">年度总费用</p>
                  <p className="text-xl font-bold">{formatCurrency(totalExpense)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                  <i className="fa-solid fa-chart-line text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">月均费用</p>
                  <p className="text-xl font-bold">{formatCurrency(avgMonthlyExpense)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <i className="fa-solid fa-arrow-up text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">最高月份</p>
                  <p className="text-xl font-bold">{formatCurrency(maxMonthExpense)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                  <i className="fa-solid fa-trophy text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">最大类型</p>
                  <p className="text-xl font-bold">{topCategory.category}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">月度费用趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyExpenseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} tickFormatter={(v) => `${v / 10000}万`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Line type="monotone" dataKey="expense" name="实际费用" stroke="#3b82f6" strokeWidth={2} />
                    <Line
                      type="monotone"
                      dataKey="budget"
                      name="预算"
                      stroke="#10b981"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">费用类型分布</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="amount"
                      nameKey="category"
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Stacked Bar Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">各类型月度费用明细</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyExpenseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} tickFormatter={(v) => `${v / 10000}万`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="差旅费" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="办公费" stackId="a" fill="#10b981" />
                    <Bar dataKey="招待费" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="培训费" stackId="a" fill="#8b5cf6" />
                    <Bar dataKey="交通费" stackId="a" fill="#06b6d4" />
                    <Bar dataKey="其他" stackId="a" fill="#6b7280" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
