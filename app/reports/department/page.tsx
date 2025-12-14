"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { departments, dashboardStats, expenses, reimbursements } from "@/lib/mock-data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

export default function DepartmentReportPage() {
  const [year, setYear] = useState("2024")
  const [month, setMonth] = useState("all")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 0,
    }).format(value)
  }

  // Calculate department statistics
  const deptStats = departments.map((dept) => {
    const deptExpenses = expenses.filter((e) => e.department === dept.name)
    const deptReimbursements = reimbursements.filter((r) => r.department === dept.name)
    const totalExpense = deptExpenses.reduce((sum, e) => sum + e.amount, 0)
    const totalReimbursement = deptReimbursements.reduce((sum, r) => sum + r.amount, 0)
    const budgetInfo = dashboardStats.departmentBudget.find((b) => b.department === dept.name)

    return {
      department: dept.name,
      manager: dept.manager,
      budget: budgetInfo?.budget || dept.budget,
      used: budgetInfo?.used || 0,
      expenseCount: deptExpenses.length,
      reimbursementCount: deptReimbursements.length,
      totalExpense,
      totalReimbursement,
      usageRate: budgetInfo ? Math.round((budgetInfo.used / budgetInfo.budget) * 100) : 0,
    }
  })

  // Radar chart data
  const radarData = deptStats.slice(0, 6).map((dept) => ({
    department: dept.department,
    预算执行: dept.usageRate,
    费用申请: Math.min(100, (dept.expenseCount / 5) * 100),
    报销处理: Math.min(100, (dept.reimbursementCount / 5) * 100),
  }))

  // Export function
  const handleExport = () => {
    const headers = ["部门", "负责人", "预算", "已使用", "使用率", "费用申请数", "报销申请数"]
    const rows = deptStats.map((d) => [
      d.department,
      d.manager,
      d.budget,
      d.used,
      `${d.usageRate}%`,
      d.expenseCount,
      d.reimbursementCount,
    ])
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `部门报表_${year}_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const totalDeptBudget = deptStats.reduce((sum, d) => sum + d.budget, 0)
  const totalDeptUsed = deptStats.reduce((sum, d) => sum + d.used, 0)
  const avgUsageRate = Math.round((totalDeptUsed / totalDeptBudget) * 100)
  const topDept = deptStats.reduce((max, d) => (d.used > max.used ? d : max), deptStats[0])

  return (
    <MainLayout title="部门报表" breadcrumbs={[{ label: "报表中心" }, { label: "部门报表" }]}>
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
                  <span className="text-sm text-slate-500">月份：</span>
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全年</SelectItem>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {i + 1}月
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <i className="fa-solid fa-building text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">部门数量</p>
                  <p className="text-xl font-bold">{departments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                  <i className="fa-solid fa-wallet text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">部门总预算</p>
                  <p className="text-xl font-bold">{formatCurrency(totalDeptBudget)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <i className="fa-solid fa-percent text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">平均使用率</p>
                  <p className="text-xl font-bold">{avgUsageRate}%</p>
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
                  <p className="text-sm text-slate-500">最高消费部门</p>
                  <p className="text-xl font-bold">{topDept.department}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Budget Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">部门预算对比</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" fontSize={12} />
                    <YAxis fontSize={12} tickFormatter={(v) => `${v / 10000}万`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="budget" name="预算" fill="#3b82f6" />
                    <Bar dataKey="used" name="已使用" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">部门综合指标</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="department" fontSize={12} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="预算执行" dataKey="预算执行" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Radar name="费用申请" dataKey="费用申请" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    <Radar name="报销处理" dataKey="报销处理" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">部门明细</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deptStats.map((dept) => (
                <div key={dept.department} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        <i className="fa-solid fa-building" />
                      </div>
                      <div>
                        <p className="font-medium">{dept.department}</p>
                        <p className="text-xs text-slate-500">{dept.manager}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">预算</span>
                      <span className="font-medium">{formatCurrency(dept.budget)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">已使用</span>
                      <span className="font-medium">{formatCurrency(dept.used)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={dept.usageRate}
                        className={`h-2 flex-1 ${
                          dept.usageRate > 90
                            ? "[&>div]:bg-red-500"
                            : dept.usageRate > 75
                              ? "[&>div]:bg-amber-500"
                              : "[&>div]:bg-green-500"
                        }`}
                      />
                      <span className="text-sm font-medium">{dept.usageRate}%</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 pt-2 border-t">
                      <span>费用申请: {dept.expenseCount}</span>
                      <span>报销申请: {dept.reimbursementCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
