"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { budgets, departments, dashboardStats } from "@/lib/mock-data"
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
} from "recharts"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

export default function BudgetReportPage() {
  const [year, setYear] = useState("2024")
  const [department, setDepartment] = useState("all")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 0,
    }).format(value)
  }

  // Filter budgets
  const filteredBudgets = budgets.filter((b) => {
    return department === "all" || b.department === department
  })

  // Export function
  const handleExport = () => {
    const headers = ["部门", "费用类型", "预算金额", "已使用", "使用率", "状态"]
    const rows = filteredBudgets.map((b) => [
      b.department,
      b.category,
      b.totalAmount,
      b.usedAmount,
      `${Math.round((b.usedAmount / b.totalAmount) * 100)}%`,
      b.status === "normal" ? "正常" : b.status === "warning" ? "预警" : "超支",
    ])
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `预算报表_${year}_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const totalBudget = dashboardStats.totalBudget
  const usedBudget = dashboardStats.usedBudget
  const remainingBudget = totalBudget - usedBudget
  const usageRate = Math.round((usedBudget / totalBudget) * 100)

  const deptBudgetData = dashboardStats.departmentBudget.map((item, index) => ({
    ...item,
    remaining: item.budget - item.used,
    fill: COLORS[index % COLORS.length],
  }))

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return <Badge className="bg-green-100 text-green-600 hover:bg-green-100">正常</Badge>
      case "warning":
        return <Badge className="bg-amber-100 text-amber-600 hover:bg-amber-100">预警</Badge>
      case "danger":
        return <Badge className="bg-red-100 text-red-600 hover:bg-red-100">超支</Badge>
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  return (
    <MainLayout title="预算报表" breadcrumbs={[{ label: "报表中心" }, { label: "预算报表" }]}>
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
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">部门：</span>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部部门</SelectItem>
                      {departments.map((d) => (
                        <SelectItem key={d.id} value={d.name}>
                          {d.name}
                        </SelectItem>
                      ))}
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

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <i className="fa-solid fa-wallet text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">年度总预算</p>
                  <p className="text-xl font-bold">{formatCurrency(totalBudget)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <i className="fa-solid fa-coins text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">已使用</p>
                  <p className="text-xl font-bold">{formatCurrency(usedBudget)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                  <i className="fa-solid fa-piggy-bank text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">剩余预算</p>
                  <p className="text-xl font-bold">{formatCurrency(remainingBudget)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                  <i className="fa-solid fa-percent text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">使用率</p>
                  <p className="text-xl font-bold">{usageRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Budget Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">各部门预算使用情况</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptBudgetData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" fontSize={12} tickFormatter={(v) => `${v / 10000}万`} />
                    <YAxis type="category" dataKey="department" fontSize={12} width={60} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="used" name="已使用" fill="#3b82f6" stackId="a" />
                    <Bar dataKey="remaining" name="剩余" fill="#e2e8f0" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Department Budget Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">部门预算占比</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deptBudgetData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="budget"
                      nameKey="department"
                      label={({ department, percent }) => `${department} ${(percent * 100).toFixed(0)}%`}
                    >
                      {deptBudgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Details Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">预算明细</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">部门</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">费用类型</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">预算金额</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">已使用</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">使用进度</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBudgets.map((budget) => {
                    const usagePercent = Math.round((budget.usedAmount / budget.totalAmount) * 100)
                    return (
                      <tr key={budget.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm font-medium">{budget.department}</td>
                        <td className="py-3 px-4 text-sm">{budget.category}</td>
                        <td className="py-3 px-4 text-sm text-right">{formatCurrency(budget.totalAmount)}</td>
                        <td className="py-3 px-4 text-sm text-right">{formatCurrency(budget.usedAmount)}</td>
                        <td className="py-3 px-4 min-w-[150px]">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={usagePercent}
                              className={`h-2 flex-1 ${
                                usagePercent > 90
                                  ? "[&>div]:bg-red-500"
                                  : usagePercent > 75
                                    ? "[&>div]:bg-amber-500"
                                    : "[&>div]:bg-green-500"
                              }`}
                            />
                            <span className="text-sm text-slate-500 w-10">{usagePercent}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(budget.status)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
