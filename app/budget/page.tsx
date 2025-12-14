"use client"

import type React from "react"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { budgets, departments, expenseCategories } from "@/lib/mock-data"

export default function BudgetPage() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState<(typeof budgets)[0] | null>(null)
  const [budgetList, setBudgetList] = useState(budgets)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getStatusBadge = (status: string, usagePercent: number) => {
    if (usagePercent >= 90) {
      return <Badge className="bg-red-100 text-red-600 hover:bg-red-100">超支预警</Badge>
    } else if (usagePercent >= 75) {
      return <Badge className="bg-amber-100 text-amber-600 hover:bg-amber-100">使用过高</Badge>
    }
    return <Badge className="bg-green-100 text-green-600 hover:bg-green-100">正常</Badge>
  }

  const columns = [
    { key: "id", label: "预算编号", sortable: true },
    { key: "year", label: "年度", sortable: true },
    {
      key: "department",
      label: "部门",
      sortable: true,
      filterable: true,
      filterOptions: departments.map((d) => ({ label: d.name, value: d.name })),
    },
    {
      key: "category",
      label: "费用类型",
      sortable: true,
      filterable: true,
      filterOptions: expenseCategories.map((c) => ({ label: c.name, value: c.name })),
    },
    {
      key: "totalAmount",
      label: "预算金额",
      sortable: true,
      render: (value: unknown) => <span className="font-medium">{formatCurrency(value as number)}</span>,
    },
    {
      key: "usedAmount",
      label: "已使用",
      sortable: true,
      render: (value: unknown) => formatCurrency(value as number),
    },
    {
      key: "usage",
      label: "使用进度",
      render: (_: unknown, row: (typeof budgets)[0]) => {
        const percent = Math.round((row.usedAmount / row.totalAmount) * 100)
        return (
          <div className="flex items-center gap-2 min-w-32">
            <Progress
              value={percent}
              className={`h-2 flex-1 ${
                percent >= 90 ? "[&>div]:bg-red-500" : percent >= 75 ? "[&>div]:bg-amber-500" : "[&>div]:bg-green-500"
              }`}
            />
            <span className="text-sm text-slate-600 w-12 text-right">{percent}%</span>
          </div>
        )
      },
    },
    {
      key: "status",
      label: "状态",
      filterable: true,
      filterOptions: [
        { label: "正常", value: "normal" },
        { label: "预警", value: "warning" },
        { label: "超支", value: "danger" },
      ],
      render: (_: unknown, row: (typeof budgets)[0]) => {
        const percent = Math.round((row.usedAmount / row.totalAmount) * 100)
        return getStatusBadge(row.status, percent)
      },
    },
  ]

  const handleViewDetail = (row: (typeof budgets)[0]) => {
    setSelectedBudget(row)
    setShowDetailDialog(true)
  }

  const handleAddBudget = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newBudget = {
      id: `B${String(budgetList.length + 1).padStart(3, "0")}`,
      year: formData.get("year") as string,
      department: formData.get("department") as string,
      category: formData.get("category") as string,
      totalAmount: Number(formData.get("amount")),
      usedAmount: 0,
      status: "normal",
    }
    setBudgetList([newBudget, ...budgetList])
    setShowAddDialog(false)
  }

  // Stats
  const totalBudget = budgetList.reduce((sum, b) => sum + b.totalAmount, 0)
  const totalUsed = budgetList.reduce((sum, b) => sum + b.usedAmount, 0)
  const warningCount = budgetList.filter((b) => b.usedAmount / b.totalAmount >= 0.75).length
  const dangerCount = budgetList.filter((b) => b.usedAmount / b.totalAmount >= 0.9).length

  return (
    <MainLayout title="预算列表" breadcrumbs={[{ label: "预算管理" }, { label: "预算列表" }]}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <i className="fa-solid fa-wallet text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">总预算</p>
                  <p className="text-xl font-bold text-slate-800">{formatCurrency(totalBudget)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                  <i className="fa-solid fa-chart-pie text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">已使用</p>
                  <p className="text-xl font-bold text-slate-800">{formatCurrency(totalUsed)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <i className="fa-solid fa-triangle-exclamation text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">预警项目</p>
                  <p className="text-xl font-bold text-slate-800">{warningCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                  <i className="fa-solid fa-circle-exclamation text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">超支项目</p>
                  <p className="text-xl font-bold text-slate-800">{dangerCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle>预算列表</CardTitle>
            <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
              <i className="fa-solid fa-plus mr-2" />
              新增预算
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable
              data={budgetList}
              columns={columns}
              pageSize={10}
              actions={(row) => (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewDetail(row)
                    }}
                  >
                    <i className="fa-solid fa-eye text-slate-500" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <i className="fa-solid fa-pen text-blue-500" />
                  </Button>
                </div>
              )}
            />
          </CardContent>
        </Card>

        {/* Add Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>新增预算</DialogTitle>
              <DialogDescription>创建新的预算项目</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddBudget}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="year">预算年度</Label>
                  <Select name="year" defaultValue="2024">
                    <SelectTrigger>
                      <SelectValue placeholder="选择年度" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024年</SelectItem>
                      <SelectItem value="2025">2025年</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">部门</Label>
                  <Select name="department">
                    <SelectTrigger>
                      <SelectValue placeholder="选择部门" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem key={d.id} value={d.name}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">费用类型</Label>
                  <Select name="category">
                    <SelectTrigger>
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((c) => (
                        <SelectItem key={c.id} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">预算金额</Label>
                  <Input name="amount" type="number" placeholder="请输入金额" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  取消
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  确定
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Detail Dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>预算详情</DialogTitle>
            </DialogHeader>
            {selectedBudget && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">预算编号</p>
                    <p className="font-medium">{selectedBudget.id}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">预算年度</p>
                    <p className="font-medium">{selectedBudget.year}年</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">部门</p>
                    <p className="font-medium">{selectedBudget.department}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">费用类型</p>
                    <p className="font-medium">{selectedBudget.category}</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600">预算使用进度</span>
                    <span className="font-medium">
                      {Math.round((selectedBudget.usedAmount / selectedBudget.totalAmount) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={Math.round((selectedBudget.usedAmount / selectedBudget.totalAmount) * 100)}
                    className="h-3"
                  />
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-slate-500">已使用: {formatCurrency(selectedBudget.usedAmount)}</span>
                    <span className="text-slate-500">总预算: {formatCurrency(selectedBudget.totalAmount)}</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-500">剩余预算</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(selectedBudget.totalAmount - selectedBudget.usedAmount)}
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
                关闭
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
