"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { approvals } from "@/lib/mock-data"

export default function ApprovalPendingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [selectedApproval, setSelectedApproval] = useState<(typeof approvals)[0] | null>(null)
  const [opinion, setOpinion] = useState("")
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject">("approve")
  const pageSize = 10

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getTypeBadge = (type: string) => {
    return type === "expense" ? (
      <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">费用申请</Badge>
    ) : (
      <Badge className="bg-purple-100 text-purple-600 hover:bg-purple-100">报销申请</Badge>
    )
  }

  // Filter data
  const filteredData = approvals.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.applicant.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || item.type === typeFilter
    return matchesSearch && matchesType
  })

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleApprovalAction = (action: "approve" | "reject", item: (typeof approvals)[0]) => {
    setSelectedApproval(item)
    setApprovalAction(action)
    setOpinion(action === "approve" ? "同意" : "")
    setShowApprovalDialog(true)
  }

  const handleSubmitApproval = () => {
    // Simulate approval submission
    setShowApprovalDialog(false)
    setOpinion("")
    setSelectedApproval(null)
  }

  // Stats
  const expenseCount = approvals.filter((a) => a.type === "expense").length
  const reimbursementCount = approvals.filter((a) => a.type === "reimbursement").length
  const totalAmount = approvals.reduce((sum, a) => sum + a.amount, 0)

  return (
    <MainLayout title="待我审批" breadcrumbs={[{ label: "审批中心" }, { label: "待我审批" }]}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <i className="fa-solid fa-hourglass-half text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">待审批</p>
                  <p className="text-xl font-bold">{approvals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <i className="fa-solid fa-file-invoice-dollar text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">费用申请</p>
                  <p className="text-xl font-bold">{expenseCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                  <i className="fa-solid fa-receipt text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">报销申请</p>
                  <p className="text-xl font-bold">{reimbursementCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                  <i className="fa-solid fa-sack-dollar text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">待审金额</p>
                  <p className="text-xl font-bold">{formatCurrency(totalAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle>待审批列表</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="搜索编号/标题/申请人..."
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
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">申请编号</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">类型</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">申请标题</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">申请人</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">部门</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">金额</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">申请日期</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-500">审批进度</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-500">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm font-medium">{item.code}</td>
                      <td className="py-3 px-4">{getTypeBadge(item.type)}</td>
                      <td className="py-3 px-4 text-sm">{item.title}</td>
                      <td className="py-3 px-4 text-sm">{item.applicant}</td>
                      <td className="py-3 px-4 text-sm">{item.department}</td>
                      <td className="py-3 px-4 text-sm text-right font-medium text-blue-600">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-3 px-4 text-sm">{item.applyDate}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          {Array.from({ length: item.totalSteps }, (_, i) => (
                            <div
                              key={i}
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                i < item.step
                                  ? "bg-green-500 text-white"
                                  : i === item.step
                                    ? "bg-amber-500 text-white"
                                    : "bg-slate-200 text-slate-500"
                              }`}
                            >
                              {i + 1}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 h-8"
                            onClick={() => handleApprovalAction("approve", item)}
                          >
                            <i className="fa-solid fa-check mr-1" />
                            通过
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 border-red-200 hover:bg-red-50 h-8 bg-transparent"
                            onClick={() => handleApprovalAction("reject", item)}
                          >
                            <i className="fa-solid fa-times mr-1" />
                            驳回
                          </Button>
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

        {/* Approval Dialog */}
        <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{approvalAction === "approve" ? "审批通过" : "审批驳回"}</DialogTitle>
            </DialogHeader>
            {selectedApproval && (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">申请编号：</span>
                      <span className="font-medium">{selectedApproval.code}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">申请人：</span>
                      <span className="font-medium">{selectedApproval.applicant}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500">申请标题：</span>
                      <span className="font-medium">{selectedApproval.title}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500">申请金额：</span>
                      <span className="font-bold text-blue-600">{formatCurrency(selectedApproval.amount)}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">审批意见</label>
                  <Textarea
                    placeholder="请输入审批意见..."
                    value={opinion}
                    onChange={(e) => setOpinion(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                取消
              </Button>
              <Button
                className={
                  approvalAction === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                }
                onClick={handleSubmitApproval}
              >
                <i className={`fa-solid ${approvalAction === "approve" ? "fa-check" : "fa-times"} mr-2`} />
                {approvalAction === "approve" ? "确认通过" : "确认驳回"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
