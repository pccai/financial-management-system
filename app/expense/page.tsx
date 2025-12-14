"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { expenses, expenseCategories, departments } from "@/lib/mock-data"

export default function ExpenseListPage() {
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<(typeof expenses)[0] | null>(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-600 hover:bg-green-100">已通过</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-600 hover:bg-amber-100">审批中</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-600 hover:bg-red-100">已驳回</Badge>
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  const columns = [
    { key: "code", label: "申请编号", sortable: true },
    { key: "title", label: "申请标题", sortable: true },
    { key: "applicant", label: "申请人", sortable: true },
    {
      key: "department",
      label: "部门",
      filterable: true,
      filterOptions: departments.map((d) => ({ label: d.name, value: d.name })),
    },
    {
      key: "category",
      label: "费用类型",
      filterable: true,
      filterOptions: expenseCategories.map((c) => ({ label: c.name, value: c.name })),
      render: (value: unknown) => {
        const cat = expenseCategories.find((c) => c.name === value)
        return (
          <div className="flex items-center gap-2">
            {cat && (
              <div className={`w-6 h-6 rounded ${cat.color} flex items-center justify-center`}>
                <i className={`fa-solid ${cat.icon} text-white text-xs`} />
              </div>
            )}
            <span>{value as string}</span>
          </div>
        )
      },
    },
    {
      key: "amount",
      label: "金额",
      sortable: true,
      render: (value: unknown) => <span className="font-medium">{formatCurrency(value as number)}</span>,
    },
    { key: "applyDate", label: "申请日期", sortable: true },
    {
      key: "status",
      label: "状态",
      filterable: true,
      filterOptions: [
        { label: "已通过", value: "approved" },
        { label: "审批中", value: "pending" },
        { label: "已驳回", value: "rejected" },
      ],
      render: (value: unknown) => getStatusBadge(value as string),
    },
  ]

  const handleViewDetail = (row: (typeof expenses)[0]) => {
    setSelectedExpense(row)
    setShowDetailDialog(true)
  }

  // Stats
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0)
  const approvedCount = expenses.filter((e) => e.status === "approved").length
  const pendingCount = expenses.filter((e) => e.status === "pending").length
  const rejectedCount = expenses.filter((e) => e.status === "rejected").length

  return (
    <MainLayout title="申请记录" breadcrumbs={[{ label: "费用申请" }, { label: "申请记录" }]}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <i className="fa-solid fa-file-invoice-dollar text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">申请总额</p>
                  <p className="text-xl font-bold">{formatCurrency(totalAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                  <i className="fa-solid fa-check-circle text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">已通过</p>
                  <p className="text-xl font-bold">{approvedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <i className="fa-solid fa-clock text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">审批中</p>
                  <p className="text-xl font-bold">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                  <i className="fa-solid fa-times-circle text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">已驳回</p>
                  <p className="text-xl font-bold">{rejectedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle>费用申请记录</CardTitle>
            <Link href="/expense/apply">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <i className="fa-solid fa-plus mr-2" />
                新建申请
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <DataTable
              data={expenses}
              columns={columns}
              pageSize={10}
              onRowClick={handleViewDetail}
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
                  {row.status === "pending" && (
                    <Button variant="ghost" size="sm">
                      <i className="fa-solid fa-pen text-blue-500" />
                    </Button>
                  )}
                </div>
              )}
            />
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>费用申请详情</DialogTitle>
            </DialogHeader>
            {selectedExpense && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">{selectedExpense.title}</span>
                  {getStatusBadge(selectedExpense.status)}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">申请编号</p>
                    <p className="font-medium">{selectedExpense.code}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">申请日期</p>
                    <p className="font-medium">{selectedExpense.applyDate}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">申请人</p>
                    <p className="font-medium">{selectedExpense.applicant}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">部门</p>
                    <p className="font-medium">{selectedExpense.department}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">费用类型</p>
                    <p className="font-medium">{selectedExpense.category}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">申请金额</p>
                    <p className="font-bold text-blue-600 text-lg">{formatCurrency(selectedExpense.amount)}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">申请说明</p>
                  <p className="text-slate-700">{selectedExpense.description}</p>
                </div>
                {selectedExpense.status === "rejected" && selectedExpense.rejectReason && (
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <p className="text-sm text-red-500 mb-1">驳回原因</p>
                    <p className="text-red-700">{selectedExpense.rejectReason}</p>
                  </div>
                )}
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-500 mb-2">审批流程</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                        <i className="fa-solid fa-check text-xs" />
                      </div>
                      <span className="text-sm">提交申请</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-slate-300" />
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-6 h-6 rounded-full ${
                          selectedExpense.status === "approved"
                            ? "bg-green-500"
                            : selectedExpense.status === "rejected"
                              ? "bg-red-500"
                              : "bg-amber-500"
                        } text-white flex items-center justify-center`}
                      >
                        {selectedExpense.status === "approved" ? (
                          <i className="fa-solid fa-check text-xs" />
                        ) : selectedExpense.status === "rejected" ? (
                          <i className="fa-solid fa-times text-xs" />
                        ) : (
                          <i className="fa-solid fa-clock text-xs" />
                        )}
                      </div>
                      <span className="text-sm">部门审批</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-slate-300" />
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-6 h-6 rounded-full ${
                          selectedExpense.status === "approved" ? "bg-green-500" : "bg-slate-300"
                        } text-white flex items-center justify-center`}
                      >
                        {selectedExpense.status === "approved" ? (
                          <i className="fa-solid fa-check text-xs" />
                        ) : (
                          <span className="text-xs">3</span>
                        )}
                      </div>
                      <span className="text-sm">财务审核</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
                关闭
              </Button>
              {selectedExpense?.status === "approved" && (
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <i className="fa-solid fa-print mr-2" />
                  打印
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
