"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { roles } from "@/lib/mock-data"

const permissionGroups = [
  { name: "预算管理", permissions: ["预算编制", "预算分配", "预算调整", "预算分析"] },
  { name: "费用管理", permissions: ["费用申请", "费用查看", "费用撤销"] },
  { name: "报销管理", permissions: ["报销申请", "报销查看", "报销撤销"] },
  { name: "发票管理", permissions: ["发票录入", "发票验真", "发票查看"] },
  { name: "审批管理", permissions: ["审批处理", "审批转办", "审批查看"] },
  { name: "报表中心", permissions: ["费用报表", "预算报表", "部门报表", "报表导出"] },
  { name: "系统设置", permissions: ["用户管理", "角色管理", "部门管理", "费用类别", "审批流程"] },
]

export default function RolesSettingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedRole, setSelectedRole] = useState<(typeof roles)[0] | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "", permissions: [] as string[] })

  const filteredData = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (role: (typeof roles)[0]) => {
    setSelectedRole(role)
    setFormData({ name: role.name, description: role.description, permissions: role.permissions })
    setShowEditDialog(true)
  }

  const togglePermission = (perm: string) => {
    setFormData({
      ...formData,
      permissions: formData.permissions.includes(perm)
        ? formData.permissions.filter((p) => p !== perm)
        : [...formData.permissions, perm],
    })
  }

  return (
    <MainLayout title="角色管理" breadcrumbs={[{ label: "系统设置" }, { label: "角色管理" }]}>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle>角色列表</CardTitle>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setFormData({ name: "", description: "", permissions: [] })
                setShowAddDialog(true)
              }}
            >
              <i className="fa-solid fa-plus mr-2" />
              新增角色
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="搜索角色名称/描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="grid gap-4">
              {filteredData.map((role) => (
                <Card key={role.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                            <i className="fa-solid fa-shield-halved" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{role.name}</h3>
                            <p className="text-sm text-slate-500">{role.description}</p>
                          </div>
                          <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100">
                            {role.userCount} 用户
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {role.permissions.slice(0, 5).map((perm) => (
                            <Badge key={perm} variant="outline" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                          {role.permissions.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.permissions.length - 5}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(role)}>
                          <i className="fa-solid fa-pen text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="sm" disabled={role.name === "超级管理员"}>
                          <i className="fa-solid fa-trash text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{showAddDialog ? "新增角色" : "编辑角色"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>角色名称</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>角色描述</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-4">
              <Label>权限配置</Label>
              {permissionGroups.map((group) => (
                <div key={group.name} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">{group.name}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {group.permissions.map((perm) => (
                      <div key={perm} className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.permissions.includes(perm)}
                          onCheckedChange={() => togglePermission(perm)}
                          id={perm}
                        />
                        <label htmlFor={perm} className="text-sm cursor-pointer">
                          {perm}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
