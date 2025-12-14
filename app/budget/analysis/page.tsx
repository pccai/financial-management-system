"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dashboardStats, budgets, departments } from "@/lib/mock-data"
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#ec4899", "#64748b", "#84cc16"]

export default function BudgetAnalysisPage() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 0,
    }).format(value)
  }

  // Prepare radar data
  const radarData = departments.slice(0, 6).map((dept) => {
    const deptBudgets = budgets.filter((b) => b.department === dept.name)
    const totalBudget = deptBudgets.reduce((sum, b) => sum + b.totalAmount, 0)
    const totalUsed = deptBudgets.reduce((sum, b) => sum + b.usedAmount, 0)
    return {
      department: dept.name,
      预算额度: totalBudget / 10000,
      使用率: totalBudget > 0 ? Math.round((totalUsed / totalBudget) * 100) : 0,
    }
  })

  // Quarter comparison data
  const quarterData = [
    { quarter: "Q1", budget: 1050000, actual: 960000 },
    { quarter: "Q2", budget: 1150000, actual: 1080000 },
    { quarter: "Q3", budget: 1200000, actual: 1140000 },
    { quarter: "Q4", budget: 1100000, actual: 970000 },
  ]

  return (
    <MainLayout title="预算分析" breadcrumbs={[{ label: "预算管理" }, { label: "预算分析" }]}>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <i className="fa-solid fa-wallet text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">年度预算</p>
                  <p className="text-xl font-bold">{formatCurrency(dashboardStats.totalBudget)}</p>
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
                  <p className="text-sm text-slate-500">已执行</p>
                  <p className="text-xl font-bold">{formatCurrency(dashboardStats.usedBudget)}</p>
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
                  <p className="text-sm text-slate-500">执行率</p>
                  <p className="text-xl font-bold">
                    {Math.round((dashboardStats.usedBudget / dashboardStats.totalBudget) * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center">
                  <i className="fa-solid fa-coins text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">结余预算</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(dashboardStats.totalBudget - dashboardStats.usedBudget)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="trend" className="space-y-4">
          <TabsList className="bg-white border p-1">
            <TabsTrigger value="trend" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <i className="fa-solid fa-chart-line mr-2" />
              趋势分析
            </TabsTrigger>
            <TabsTrigger value="department" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <i className="fa-solid fa-building mr-2" />
              部门对比
            </TabsTrigger>
            <TabsTrigger value="category" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <i className="fa-solid fa-tags mr-2" />
              类型分布
            </TabsTrigger>
            <TabsTrigger value="quarter" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <i className="fa-solid fa-calendar-days mr-2" />
              季度分析
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trend">
            <Card>
              <CardHeader>
                <CardTitle>月度预算执行趋势</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboardStats.monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      <Line type="monotone" dataKey="budget" stroke="#3b82f6" strokeWidth={2} name="预算" />
                      <Line type="monotone" dataKey="expense" stroke="#10b981" strokeWidth={2} name="实际支出" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="department">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>部门预算使用对比</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboardStats.departmentBudget}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="department" stroke="#64748b" fontSize={12} />
                        <YAxis
                          stroke="#64748b"
                          fontSize={12}
                          tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                        />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="budget" fill="#e2e8f0" name="预算" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="used" fill="#3b82f6" name="已使用" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>部门预算雷达图</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="department" stroke="#64748b" fontSize={12} />
                        <PolarRadiusAxis stroke="#64748b" fontSize={10} />
                        <Radar name="使用率%" dataKey="使用率" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="category">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>费用类型分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dashboardStats.expenseByCategory}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="amount"
                          nameKey="category"
                          label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                        >
                          {dashboardStats.expenseByCategory.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>费用类型明细</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardStats.expenseByCategory.map((item, index) => {
                      const total = dashboardStats.expenseByCategory.reduce((sum, i) => sum + i.amount, 0)
                      const percent = Math.round((item.amount / total) * 100)
                      return (
                        <div key={item.category} className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="w-20 text-sm text-slate-600">{item.category}</span>
                          <div className="flex-1 bg-slate-100 rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${percent}%`,
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                          </div>
                          <span className="w-20 text-right text-sm font-medium">{formatCurrency(item.amount)}</span>
                          <span className="w-12 text-right text-sm text-slate-500">{percent}%</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quarter">
            <Card>
              <CardHeader>
                <CardTitle>季度预算执行分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={quarterData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="quarter" stroke="#64748b" />
                      <YAxis stroke="#64748b" tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="budget" fill="#3b82f6" name="预算" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="actual" fill="#10b981" name="实际" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
