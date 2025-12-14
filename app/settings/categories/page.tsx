"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { expenseCategories } from "@/lib/mock-data"

export default function CategoriesSettingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [formData, setFormData] = useState({ name: "", parent: "", limit: "", requireInvoice: "yes" })

  const filteredData = expenseCategories.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleEdit = (cat: (typeof expenseCategories)[0]) => {
    setFormData({
      name: cat.name,
      parent: cat.parent || "",
      limit: cat.limit.toString(),
      requireInvoice: cat.requireInvoice ? "yes" : "no",
    })
    setShowEditDialog(true)
  }

  return (
    <MainLayout title="费用类别" breadcrumbs={[{ label: "系统设置" }, { label: "费用类别" }]}>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle>费用类别管理</CardTitle>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setFormData({ name: "", parent: "", limit: "", requireInvoice: "yes" })
                setShowAddDialog(true)
              }}
            >
              <i className="fa-solid fa-plus mr-2" />
              新增类别
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="搜索类别名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">类别名称</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">上级类别</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">单次限额</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">需要发票</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">状态</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-500">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((cat) => (
                    <tr key={cat.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                            <i className="fa-solid fa-tag text-sm" />
                          </div>
                          <span className="font-medium">{cat.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{cat.parent || "-"}</td>
                      <td className="py-3 px-4 text-sm font-medium">¥{cat.limit.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            cat.requireInvoice
                              ? "bg-blue-100 text-blue-600 hover:bg-blue-100"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                          }
                        >
                          {cat.requireInvoice ? "是" : "否"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            cat.status === "active"
                              ? "bg-green-100 text-green-600 hover:bg-green-100"
                              : "bg-red-100 text-red-600 hover:bg-red-100"
                          }
                        >
                          {cat.status === "active" ? "启用" : "禁用"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(cat)}>
                            <i className="fa-solid fa-pen text-blue-500" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <i className="fa-solid fa-trash text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={showAddDialog || showEditDialog}
        onOpenChange={() => {
          setShowAddDialog(false)
          setShowEditDialog(false)
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{showAddDialog ? "新增费用类别" : "编辑费用类别"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>类别名称</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>上级类别</Label>
              <Select value={formData.parent} onValueChange={(v) => setFormData({ ...formData, parent: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="选择上级类别（可选）" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">无</SelectItem>
                  {expenseCategories
                    .filter((c) => !c.parent)
                    .map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>单次限额</Label>
              <Input
                type="number"
                value={formData.limit}
                onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>是否需要发票</Label>
              <Select
                value={formData.requireInvoice}
                onValueChange={(v) => setFormData({ ...formData, requireInvoice: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">是</SelectItem>
                  <SelectItem value="no">否</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false)
                setShowEditDialog(false)
              }}
            >
              取消
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setShowAddDialog(false)
                setShowEditDialog(false)
              }}
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}
