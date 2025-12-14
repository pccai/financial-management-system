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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { expenseCategories, departments } from "@/lib/mock-data"

export default function ExpenseApplyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    department: "",
    amount: "",
    description: "",
    attachments: [] as File[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    alert("费用申请提交成功！")
    router.push("/expense")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(files)],
      }))
    }
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  return (
    <MainLayout title="费用申请" breadcrumbs={[{ label: "费用申请" }, { label: "新建申请" }]}>
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <i className="fa-solid fa-file-circle-plus text-blue-500" />
              费用申请
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="title">
                    申请标题 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="请输入申请标题"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    费用类型 <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
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
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
                  >
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

                <div className="space-y-2">
                  <Label htmlFor="amount">
                    申请金额 <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">¥</span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
                      value={formData.amount}
                      onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>预计发生日期</Label>
                  <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">
                    申请说明 <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="请详细描述费用用途..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label>附件上传</Label>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input type="file" multiple onChange={handleFileChange} className="hidden" id="file-upload" />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <i className="fa-solid fa-cloud-arrow-up text-3xl text-slate-400 mb-2" />
                      <p className="text-slate-600">点击或拖拽文件到此处上传</p>
                      <p className="text-sm text-slate-400 mt-1">支持 PDF、Word、Excel、图片等格式</p>
                    </label>
                  </div>
                  {formData.attachments.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                          <div className="flex items-center gap-2">
                            <i className="fa-solid fa-file text-blue-500" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                            <i className="fa-solid fa-times text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Approval Preview */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-slate-700 mb-3">
                  <i className="fa-solid fa-route mr-2 text-blue-500" />
                  审批流程预览
                </p>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      <i className="fa-solid fa-user text-sm" />
                    </div>
                    <span className="text-sm">申请人</span>
                  </div>
                  <i className="fa-solid fa-arrow-right text-slate-400 flex-shrink-0" />
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center">
                      <i className="fa-solid fa-user-tie text-sm" />
                    </div>
                    <span className="text-sm">部门经理</span>
                  </div>
                  <i className="fa-solid fa-arrow-right text-slate-400 flex-shrink-0" />
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                      <i className="fa-solid fa-calculator text-sm" />
                    </div>
                    <span className="text-sm">财务审核</span>
                  </div>
                  <i className="fa-solid fa-arrow-right text-slate-400 flex-shrink-0" />
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-slate-400 text-white flex items-center justify-center">
                      <i className="fa-solid fa-check text-sm" />
                    </div>
                    <span className="text-sm">完成</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
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
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
