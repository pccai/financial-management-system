"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { expenseCategories, departments } from "@/lib/mock-data"

interface InvoiceItem {
  id: string
  code: string
  type: string
  amount: number
  date: string
  seller: string
}

export default function ReimbursementApplyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    { id: "1", code: "044001900123", type: "增值税普通发票", amount: 1580, date: "2024-12-01", seller: "北京航空票务" },
    { id: "2", code: "044001900124", type: "增值税普通发票", amount: 680, date: "2024-12-02", seller: "如家酒店" },
  ])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert("报销申请提交成功！")
    router.push("/reimbursement")
  }

  const addInvoice = () => {
    const newInvoice: InvoiceItem = {
      id: String(invoices.length + 1),
      code: `04400190${String(125 + invoices.length).padStart(4, "0")}`,
      type: "增值税普通发票",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      seller: "",
    }
    setInvoices([...invoices, newInvoice])
  }

  const removeInvoice = (id: string) => {
    setInvoices(invoices.filter((inv) => inv.id !== id))
  }

  const updateInvoice = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoices(invoices.map((inv) => (inv.id === id ? { ...inv, [field]: value } : inv)))
  }

  return (
    <MainLayout title="报销申请" breadcrumbs={[{ label: "报销管理" }, { label: "新建报销" }]}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <i className="fa-solid fa-receipt text-blue-500" />
              报销基本信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="title">
                  报销标题 <span className="text-red-500">*</span>
                </Label>
                <Input id="title" placeholder="请输入报销标题" required />
              </div>

              <div className="space-y-2">
                <Label>
                  费用类型 <span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择费用类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded ${cat.color} flex items-center justify-center`}>
                            <i className={`fa-solid ${cat.icon} text-white text-xs`} />
                          </div>
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  所属部门 <span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择部门" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">报销说明</Label>
                <Textarea id="description" placeholder="请详细描述报销事由..." rows={3} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex items-center gap-2">
              <i className="fa-solid fa-file-invoice text-green-500" />
              发票明细
            </CardTitle>
            <Button type="button" onClick={addInvoice} variant="outline">
              <i className="fa-solid fa-plus mr-2" />
              添加发票
            </Button>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>发票代码</TableHead>
                    <TableHead>发票类型</TableHead>
                    <TableHead>销方名称</TableHead>
                    <TableHead>开票日期</TableHead>
                    <TableHead className="text-right">金额</TableHead>
                    <TableHead className="w-16">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv, index) => (
                    <TableRow key={inv.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Input
                          value={inv.code}
                          onChange={(e) => updateInvoice(inv.id, "code", e.target.value)}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Select value={inv.type} onValueChange={(value) => updateInvoice(inv.id, "type", value)}>
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="增值税普通发票">增值税普通发票</SelectItem>
                            <SelectItem value="增值税专用发票">增值税专用发票</SelectItem>
                            <SelectItem value="电子发票">电子发票</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={inv.seller}
                          onChange={(e) => updateInvoice(inv.id, "seller", e.target.value)}
                          className="h-8"
                          placeholder="销方名称"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="date"
                          value={inv.date}
                          onChange={(e) => updateInvoice(inv.id, "date", e.target.value)}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={inv.amount}
                          onChange={(e) => updateInvoice(inv.id, "amount", Number(e.target.value))}
                          className="h-8 w-24 text-right"
                        />
                      </TableCell>
                      <TableCell>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeInvoice(inv.id)}>
                          <i className="fa-solid fa-trash text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {invoices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-slate-400">
                        暂无发票，请点击"添加发票"按钮
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between items-center mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-sm">
                  <i className="fa-solid fa-file-invoice mr-1" />共 {invoices.length} 张发票
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">报销总金额</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            取消
          </Button>
          <Button type="button" variant="outline">
            <i className="fa-solid fa-floppy-disk mr-2" />
            保存草稿
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin mr-2" />
                提交中...
              </>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane mr-2" />
                提交申请
              </>
            )}
          </Button>
        </div>
      </form>
    </MainLayout>
  )
}
