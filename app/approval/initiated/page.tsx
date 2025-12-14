"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { expenses, reimbursements } from "@/lib/mock-data"

// Combine expenses and reimbursements as "my initiated"
const initiatedRecords = [
  ...expenses.map((e) => ({ ...e, type: "expense" as const })),
  ...reimbursements.map((r) => ({ ...r, type: "reimbursement" as const })),
].sort((a, b) => new Date(b.applyDate).getTime() - new Date(a.applyDate).getTime())

export default function ApprovalInitiatedPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<(typeof initiatedRecords)[0] | null>(null)
  const pageSize = 10

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

  const getTypeBadge = (type: string) => {
    return type === "expense" ? (
      <Badge variant="outline" className="border-blue-200 text-blue-600">
        费用申请
      </Badge>
    ) : (
      <Badge variant="outline" className="border-purple-200 text-purple-600">
        报销申请
      </Badge>
    )
  }

  // Filter data
  const filteredData = initiatedRecords.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesType = typeFilter === "all" || item.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Stats
  const pendingCount = initiatedRecords.filter((r) => r.status === "pending").length
  const approvedCount = initiatedRecords.filter((r) => r.status === "approved").length
  const rejectedCount = initiatedRecords.filter((r) => r.status === "rejected").length

  return (
    <MainLayout title="我发起的" breadcrumbs={[{ label: "审批中心" }, { label: "我发起的" }]}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <i className="fa-solid fa-paper-plane text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">已发起</p>
                  <p className="text-xl font-bold">{initiatedRecords.length}</p>
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
          <CardHeader>
            <CardTitle>我发起的申请</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="搜索编号/标题..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full"
                />
              </div>
              <Select
                value={typeFilter}
                onValueChange={(value) => {
                  setTypeFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="类型筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="expense">费用申请</SelectItem>
                  <SelectItem value="reimbursement">报销申请</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="状态筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">审批中</SelectItem>
                  <SelectItem value="approved">已通过</SelectItem>
                  <SelectItem value="rejected">已驳回</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">申请编号</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">类型</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">申请标题</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">费用类型</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">金额</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">申请日期</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">状态</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-500">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm font-medium">{item.code}</td>
                      <td className="py-3 px-4">{getTypeBadge(item.type)}</td>
                      <td className="py-3 px-4 text-sm">{item.title}</td>
                      <td className="py-3 px-4 text-sm">{item.category}</td>
                      <td className="py-3 px-4 text-sm text-right font-medium text-blue-600">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-3 px-4 text-sm">{item.applyDate}</td>
                      <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedRecord(item)
                              setShowDetailDialog(true)
                            }}
                          >
                            <i className="fa-solid fa-eye text-slate-500" />
                          </Button>
                          {item.status === "pending" && (
                            <Button variant="ghost" size="sm">
                              <i className="fa-solid fa-rotate-left text-amber-500" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-slate-500">
                共 {filteredData.length} 条记录，第 {currentPage} / {totalPages || 1} 页
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <i className="fa-solid fa-chevron-left" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? "bg-blue-600" : ""}
                    >
                      {page}
                    </Button>
                  )
                })}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <i className="fa-solid fa-chevron-right" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>申请详情</DialogTitle>
            </DialogHeader>
            {selectedRecord && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeBadge(selectedRecord.type)}
                    <span className="text-lg font-medium">{selectedRecord.title}</span>
                  </div>
                  {getStatusBadge(selectedRecord.status)}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">申请编号</p>
                    <p className="font-medium">{selectedRecord.code}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">申请日期</p>
                    <p className="font-medium">{selectedRecord.applyDate}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">费用类型</p>
                    <p className="font-medium">{selectedRecord.category}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">申请金额</p>
                    <p className="font-bold text-blue-600 text-lg">{formatCurrency(selectedRecord.amount)}</p>
                  </div>
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
