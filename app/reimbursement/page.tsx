"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { reimbursements, expenseCategories, departments } from "@/lib/mock-data"

export default function ReimbursementListPage() {
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState<(typeof reimbursements)[0] | null>(null)

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
    { key: "code", label: "报销编号", sortable: true },
    { key: "title", label: "报销标题", sortable: true },
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
    {
      key: "invoiceCount",
      label: "发票数",
      render: (value: unknown) => (
        <Badge variant="outline" className="bg-slate-50">
          <i className="fa-solid fa-file-invoice mr-1" />
          {value as number} 张
        </Badge>
      ),
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

  const handleViewDetail = (row: (typeof reimbursements)[0]) => {
    setSelectedItem(row)
    setShowDetailDialog(true)
  }

  // Stats
  const totalAmount = reimbursements.reduce((sum, r) => sum + r.amount, 0)
  const approvedAmount = reimbursements.filter((r) => r.status === "approved").reduce((sum, r) => sum + r.amount, 0)
  const pendingAmount = reimbursements.filter((r) => r.status === "pending").reduce((sum, r) => sum + r.amount, 0)
  const totalInvoices = reimbursements.reduce((sum, r) => sum + r.invoiceCount, 0)

  return (
    <MainLayout title="报销记录" breadcrumbs={[{ label: "报销管理" }, { label: "报销记录" }]}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <i className="fa-solid fa-money-bill-transfer text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">报销总额</p>
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
                  <p className="text-sm text-slate-500">已报销</p>
                  <p className="text-xl font-bold">{formatCurrency(approvedAmount)}</p>
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
                  <p className="text-sm text-slate-500">待审批金额</p>
                  <p className="text-xl font-bold">{formatCurrency(pendingAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center">
                  <i className="fa-solid fa-file-invoice text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">发票总数</p>
                  <p className="text-xl font-bold">{totalInvoices} 张</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle>报销记录</CardTitle>
            <Link href="/reimbursement/apply">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <i className="fa-solid fa-plus mr-2" />
                新建报销
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <DataTable
              data={reimbursements}
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
              <DialogTitle>报销详情</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">{selectedItem.title}</span>
                  {getStatusBadge(selectedItem.status)}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">报销编号</p>
                    <p className="font-medium">{selectedItem.code}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">申请日期</p>
                    <p className="font-medium">{selectedItem.applyDate}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">申请人</p>
                    <p className="font-medium">{selectedItem.applicant}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">部门</p>
                    <p className="font-medium">{selectedItem.department}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">费用类型</p>
                    <p className="font-medium">{selectedItem.category}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">发票数量</p>
                    <p className="font-medium">{selectedItem.invoiceCount} 张</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-slate-500">报销金额</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(selectedItem.amount)}</p>
                </div>
                {selectedItem.status === "rejected" && selectedItem.rejectReason && (
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <p className="text-sm text-red-500 mb-1">驳回原因</p>
                    <p className="text-red-700">{selectedItem.rejectReason}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
                关闭
              </Button>
              {selectedItem?.status === "approved" && (
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
