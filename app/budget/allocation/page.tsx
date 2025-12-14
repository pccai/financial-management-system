"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { departments, expenseCategories } from "@/lib/mock-data"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function BudgetAllocationPage() {
  const [showAllocateDialog, setShowAllocateDialog] = useState(false)
  const [selectedDept, setSelectedDept] = useState<(typeof departments)[0] | null>(null)
  const [allocations, setAllocations] = useState(
    departments.map((d) => ({
      ...d,
      allocated: d.budget * 0.7,
      categories: expenseCategories.slice(0, 5).map((c, i) => ({
        ...c,
        amount: Math.round(d.budget * 0.7 * (0.3 - i * 0.05)),
      })),
    })),
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const totalBudget = departments.reduce((sum, d) => sum + d.budget, 0)
  const totalAllocated = allocations.reduce((sum, a) => sum + a.allocated, 0)

  const handleAllocate = (dept: (typeof departments)[0]) => {
    setSelectedDept(dept)
    setShowAllocateDialog(true)
  }

  return (
    <MainLayout title="预算分配" breadcrumbs={[{ label: "预算管理" }, { label: "预算分配" }]}>
      <div className="space-y-6">
        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">年度总预算</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(totalBudget)}</p>
                </div>
                <i className="fa-solid fa-wallet text-3xl text-white/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">已分配预算</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(totalAllocated)}</p>
                </div>
                <i className="fa-solid fa-chart-pie text-3xl text-white/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100">待分配预算</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(totalBudget - totalAllocated)}</p>
                </div>
                <i className="fa-solid fa-hourglass-half text-3xl text-white/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {allocations.map((dept) => {
            const usagePercent = Math.round((dept.allocated / dept.budget) * 100)
            return (
              <Card key={dept.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{dept.name}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => handleAllocate(dept)}>
                      <i className="fa-solid fa-sliders text-blue-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-500">分配进度</span>
                        <span className="font-medium">{usagePercent}%</span>
                      </div>
                      <Progress value={usagePercent} className="h-2" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">年度预算</span>
                      <span className="font-medium">{formatCurrency(dept.budget)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">已分配</span>
                      <span className="font-medium text-green-600">{formatCurrency(dept.allocated)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">待分配</span>
                      <span className="font-medium text-amber-600">{formatCurrency(dept.budget - dept.allocated)}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-slate-500 mb-2">费用类型分配</p>
                      <div className="space-y-1">
                        {dept.categories.slice(0, 3).map((cat) => (
                          <div key={cat.id} className="flex justify-between text-xs">
                            <span className="text-slate-600">{cat.name}</span>
                            <span>{formatCurrency(cat.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Allocate Dialog */}
        <Dialog open={showAllocateDialog} onOpenChange={setShowAllocateDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedDept?.name} - 预算分配</DialogTitle>
            </DialogHeader>
            {selectedDept && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-slate-600">年度总预算</span>
                    <span className="font-bold text-blue-600">{formatCurrency(selectedDept.budget)}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="font-medium text-slate-700">按费用类型分配</p>
                  {expenseCategories.map((cat) => (
                    <div key={cat.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${cat.color} flex items-center justify-center`}>
                        <i className={`fa-solid ${cat.icon} text-white text-sm`} />
                      </div>
                      <Label className="w-20">{cat.name}</Label>
                      <Input
                        type="number"
                        placeholder="分配金额"
                        className="flex-1"
                        defaultValue={Math.round(selectedDept.budget * 0.1)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAllocateDialog(false)}>
                取消
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAllocateDialog(false)}>
                保存分配
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
