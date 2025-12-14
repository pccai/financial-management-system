"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { invoices, expenseCategories } from "@/lib/mock-data"

export default function InvoiceListPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<(typeof invoices)[0] | null>(null)
  const pageSize = 10

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-600 hover:bg-green-100">已验真</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-600 hover:bg-amber-100">待验证</Badge>
      case "invalid":
        return <Badge className="bg-red-100 text-red-600 hover:bg-red-100">无效</Badge>
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  // Filter data
  const filteredData = invoices.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Export function
  const handleExport = () => {
    const headers = ["发票代码", "发票类型", "销售方", "金额", "税额", "开票日期", "费用类型", "状态"]
    const rows = filteredData.map((inv) => [
      inv.code,
      inv.type,
      inv.seller,
      inv.amount,
      inv.taxAmount,
      inv.date,
      inv.category,
      inv.status === "verified" ? "已验真" : inv.status === "pending" ? "待验证" : "无效",
    ])
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `发票列表_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Stats
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const totalTax = invoices.reduce((sum, inv) => sum + inv.taxAmount, 0)
  const verifiedCount = invoices.filter((inv) => inv.status === "verified").length
  const pendingCount = invoices.filter((inv) => inv.status === "pending").length

  return (
    <MainLayout title="发票列表" breadcrumbs={[{ label: "发票管理" }, { label: "发票列表" }]}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <i className="fa-solid fa-file-invoice text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">发票总额</p>
                  <p className="text-xl font-bold">{formatCurrency(totalAmount)}</p>
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
                  <p className="text-sm text-slate-500">税额合计</p>
                  <p className="text-xl font-bold">{formatCurrency(totalTax)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                  <i className="fa-solid fa-check-double text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">已验真</p>
                  <p className="text-xl font-bold">{verifiedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <i className="fa-solid fa-hourglass-half text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">待验证</p>
                  <p className="text-xl font-bold">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle>发票管理</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleExport}>
                <i className="fa-solid fa-download mr-2" />
                导出
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <i className="fa-solid fa-plus mr-2" />
                上传发票
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="搜索发票代码/销售方..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full"
                />
              </div>
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
                  <SelectItem value="verified">已验真</SelectItem>
                  <SelectItem value="pending">待验证</SelectItem>
                  <SelectItem value="invalid">无效</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={categoryFilter}
                onValueChange={(value) => {
                  setCategoryFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="费用类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  {expenseCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">发票代码</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">发票类型</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">销售方</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">金额</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">税额</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">开票日期</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">费用类型</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">状态</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-500">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                      onClick={() => {
                        setSelectedInvoice(invoice)
                        setShowDetailDialog(true)
                      }}
                    >
                      <td className="py-3 px-4 text-sm font-medium">{invoice.code}</td>
                      <td className="py-3 px-4 text-sm">{invoice.type}</td>
                      <td className="py-3 px-4 text-sm truncate max-w-[200px]">{invoice.seller}</td>
                      <td className="py-3 px-4 text-sm text-right font-medium">{formatCurrency(invoice.amount)}</td>
                      <td className="py-3 px-4 text-sm text-right">{formatCurrency(invoice.taxAmount)}</td>
                      <td className="py-3 px-4 text-sm">{invoice.date}</td>
                      <td className="py-3 px-4 text-sm">{invoice.category}</td>
                      <td className="py-3 px-4">{getStatusBadge(invoice.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedInvoice(invoice)
                              setShowDetailDialog(true)
                            }}
                          >
                            <i className="fa-solid fa-eye text-slate-500" />
                          </Button>
                          {invoice.status === "pending" && (
                            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                              <i className="fa-solid fa-check text-green-500" />
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
              <DialogTitle>发票详情</DialogTitle>
            </DialogHeader>
            {selectedInvoice && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">{selectedInvoice.type}</span>
                  {getStatusBadge(selectedInvoice.status)}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">发票代码</p>
                    <p className="font-medium font-mono">{selectedInvoice.code}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">开票日期</p>
                    <p className="font-medium">{selectedInvoice.date}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-500">销售方</p>
                  <p className="font-medium">{selectedInvoice.seller}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">金额（不含税）</p>
                    <p className="font-bold text-blue-600 text-lg">{formatCurrency(selectedInvoice.amount)}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">税额</p>
                    <p className="font-bold text-purple-600 text-lg">{formatCurrency(selectedInvoice.taxAmount)}</p>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-500">价税合计</p>
                  <p className="font-bold text-green-600 text-xl">
                    {formatCurrency(selectedInvoice.amount + selectedInvoice.taxAmount)}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-500">费用类型</p>
                  <p className="font-medium">{selectedInvoice.category}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
                关闭
              </Button>
              {selectedInvoice?.status === "pending" && (
                <Button className="bg-green-600 hover:bg-green-700">
                  <i className="fa-solid fa-check mr-2" />
                  验真
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
