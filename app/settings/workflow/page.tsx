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
import { workflows } from "@/lib/mock-data"

export default function WorkflowSettingsPage() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState<(typeof workflows)[0] | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    condition: "",
    steps: [] as { role: string; action: string }[],
  })

  const handleEdit = (wf: (typeof workflows)[0]) => {
    setSelectedWorkflow(wf)
    setFormData({ name: wf.name, type: wf.type, condition: wf.condition, steps: wf.steps })
    setShowEditDialog(true)
  }

  const addStep = () => {
    setFormData({ ...formData, steps: [...formData.steps, { role: "", action: "审批" }] })
  }

  const removeStep = (index: number) => {
    setFormData({ ...formData, steps: formData.steps.filter((_, i) => i !== index) })
  }

  return (
    <MainLayout title="审批流程" breadcrumbs={[{ label: "系统设置" }, { label: "审批流程" }]}>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle>审批流程配置</CardTitle>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setFormData({ name: "", type: "", condition: "", steps: [] })
                setShowAddDialog(true)
              }}
            >
              <i className="fa-solid fa-plus mr-2" />
              新增流程
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {workflows.map((wf) => (
                <Card key={wf.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                            <i className="fa-solid fa-sitemap" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{wf.name}</h3>
                            <p className="text-sm text-slate-500">
                              适用：{wf.type} | 条件：{wf.condition}
                            </p>
                          </div>
                          <Badge
                            className={
                              wf.status === "active"
                                ? "bg-green-100 text-green-600 hover:bg-green-100"
                                : "bg-red-100 text-red-600 hover:bg-red-100"
                            }
                          >
                            {wf.status === "active" ? "启用" : "禁用"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-slate-500">流程节点：</span>
                          {wf.steps.map((step, idx) => (
                            <div key={idx} className="flex items-center gap-1">
                              <Badge variant="outline">{step.role}</Badge>
                              {idx < wf.steps.length - 1 && (
                                <i className="fa-solid fa-arrow-right text-slate-400 text-xs" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(wf)}>
                          <i className="fa-solid fa-pen text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="sm">
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{showAddDialog ? "新增审批流程" : "编辑审批流程"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>流程名称</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>适用类型</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="费用申请">费用申请</SelectItem>
                    <SelectItem value="报销申请">报销申请</SelectItem>
                    <SelectItem value="预算调整">预算调整</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>触发条件</Label>
                <Select value={formData.condition} onValueChange={(v) => setFormData({ ...formData, condition: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择条件" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="金额 ≤ 1000">金额 ≤ 1000</SelectItem>
                    <SelectItem value="金额 ≤ 5000">金额 ≤ 5000</SelectItem>
                    <SelectItem value="金额 ≤ 10000">金额 ≤ 10000</SelectItem>
                    <SelectItem value="金额 > 10000">金额 &gt; 10000</SelectItem>
                    <SelectItem value="全部">全部</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>审批节点</Label>
                <Button variant="outline" size="sm" onClick={addStep}>
                  <i className="fa-solid fa-plus mr-1" />
                  添加节点
                </Button>
              </div>
              {formData.steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 border rounded-lg">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                    {idx + 1}
                  </span>
                  <Select
                    value={step.role}
                    onValueChange={(v) => {
                      const newSteps = [...formData.steps]
                      newSteps[idx].role = v
                      setFormData({ ...formData, steps: newSteps })
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="选择审批人" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="部门主管">部门主管</SelectItem>
                      <SelectItem value="部门经理">部门经理</SelectItem>
                      <SelectItem value="财务主管">财务主管</SelectItem>
                      <SelectItem value="财务经理">财务经理</SelectItem>
                      <SelectItem value="总经理">总经理</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="sm" onClick={() => removeStep(idx)}>
                    <i className="fa-solid fa-times text-red-500" />
                  </Button>
                </div>
              ))}
              {formData.steps.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">暂无审批节点，请点击"添加节点"</p>
              )}
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
