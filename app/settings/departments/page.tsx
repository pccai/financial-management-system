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
import { departments } from "@/lib/mock-data"

export default function DepartmentsSettingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedDept, setSelectedDept] = useState<(typeof departments)[0] | null>(null)
  const [formData, setFormData] = useState({ name: "", parent: "", manager: "", budget: "" })

  const filteredData = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.manager.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (dept: (typeof departments)[0]) => {
    setSelectedDept(dept)
    setFormData({ name: dept.name, parent: dept.parent || "", manager: dept.manager, budget: dept.budget.toString() })
    setShowEditDialog(true)
  }

  const handleExport = () => {
    const headers = ["部门名称", "上级部门", "负责人", "人数", "年度预算"]
    const rows = filteredData.map((d) => [d.name, d.parent || "-", d.manager, d.memberCount, d.budget])
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `部门列表_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <MainLayout title="部门管理" breadcrumbs={[{ label: "系统设置" }, { label: "部门管理" }]}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <i className="fa-solid fa-building text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">部门总数</p>
                  <p className="text-xl font-bold">{departments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                  <i className="fa-solid fa-users text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">总人数</p>
                  <p className="text-xl font-bold">{departments.reduce((sum, d) => sum + d.memberCount, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <i className="fa-solid fa-coins text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">总预算</p>
                  <p className="text-xl font-bold">
                    {(departments.reduce((sum, d) => sum + d.budget, 0) / 10000).toFixed(0)}万
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                  <i className="fa-solid fa-sitemap text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">一级部门</p>
                  <p className="text-xl font-bold">{departments.filter((d) => !d.parent).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle>部门列表</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleExport}>
                <i className="fa-solid fa-download mr-2" />
                导出
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setFormData({ name: "", parent: "", manager: "", budget: "" })
                  setShowAddDialog(true)
                }}
              >
                <i className="fa-solid fa-plus mr-2" />
                新增部门
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="搜索部门名称/负责人..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">部门名称</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">上级部门</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">负责人</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">人数</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">年度预算</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-500">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((dept) => (
                    <tr key={dept.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                            <i className="fa-solid fa-building text-sm" />
                          </div>
                          <span className="font-medium">{dept.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{dept.parent || "-"}</td>
                      <td className="py-3 px-4 text-sm">{dept.manager}</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">{dept.memberCount} 人</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">¥{dept.budget.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(dept)}>
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
            <DialogTitle>{showAddDialog ? "新增部门" : "编辑部门"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>部门名称</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>上级部门</Label>
              <Select value={formData.parent} onValueChange={(v) => setFormData({ ...formData, parent: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="选择上级部门（可选）" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">无</SelectItem>
                  {departments
                    .filter((d) => !d.parent)
                    .map((d) => (
                      <SelectItem key={d.id} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>负责人</Label>
              <Input value={formData.manager} onChange={(e) => setFormData({ ...formData, manager: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>年度预算</Label>
              <Input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
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
