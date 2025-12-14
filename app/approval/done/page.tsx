"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { approvedRecords } from "@/lib/mock-data"

export default function ApprovalDonePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [resultFilter, setResultFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getResultBadge = (result: string) => {
    return result === "approved" ? (
      <Badge className="bg-green-100 text-green-600 hover:bg-green-100">已通过</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-600 hover:bg-red-100">已驳回</Badge>
    )
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
  const filteredData = approvedRecords.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.applicant.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesResult = resultFilter === "all" || item.result === resultFilter
    return matchesSearch && matchesResult
  })

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Export function
  const handleExport = () => {
    const headers = [
      "申请编号",
      "类型",
      "申请标题",
      "申请人",
      "部门",
      "金额",
      "申请日期",
      "审批日期",
      "审批结果",
      "审批意见",
    ]
    const rows = filteredData.map((r) => [
      r.code,
      r.type === "expense" ? "费用申请" : "报销申请",
      r.title,
      r.applicant,
      r.department,
      r.amount,
      r.applyDate,
      r.approveDate,
      r.result === "approved" ? "已通过" : "已驳回",
      r.opinion,
    ])
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `已审批记录_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Stats
  const approvedCount = approvedRecords.filter((r) => r.result === "approved").length
  const rejectedCount = approvedRecords.filter((r) => r.result === "rejected").length
  const totalAmount = approvedRecords.reduce((sum, r) => sum + r.amount, 0)

  return (
    <MainLayout title="已审批" breadcrumbs={[{ label: "审批中心" }, { label: "已审批" }]}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <i className="fa-solid fa-check-double text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">已审批</p>
                  <p className="text-xl font-bold">{approvedRecords.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                  <i className="fa-solid fa-circle-check text-xl" />
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
                  <i className="fa-solid fa-circle-xmark text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">已驳回</p>
                  <p className="text-xl font-bold">{rejectedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                  <i className="fa-solid fa-sack-dollar text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">审批总额</p>
                  <p className="text-xl font-bold">{formatCurrency(totalAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle>已审批记录</CardTitle>
            <Button variant="outline" onClick={handleExport}>
              <i className="fa-solid fa-download mr-2" />
              导出
            </Button>
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
                value={resultFilter}
                onValueChange={(value) => {
                  setResultFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="结果筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部结果</SelectItem>
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
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">申请人</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">金额</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">审批日期</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">审批结果</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">审批意见</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm font-medium">{item.code}</td>
                      <td className="py-3 px-4">{getTypeBadge(item.type)}</td>
                      <td className="py-3 px-4 text-sm">{item.title}</td>
                      <td className="py-3 px-4 text-sm">{item.applicant}</td>
                      <td className="py-3 px-4 text-sm text-right font-medium">{formatCurrency(item.amount)}</td>
                      <td className="py-3 px-4 text-sm">{item.approveDate}</td>
                      <td className="py-3 px-4">{getResultBadge(item.result)}</td>
                      <td className="py-3 px-4 text-sm text-slate-600 truncate max-w-[200px]">{item.opinion}</td>
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
      </div>
    </MainLayout>
  )
}
