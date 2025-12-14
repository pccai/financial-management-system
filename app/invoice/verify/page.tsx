"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function InvoiceVerifyPage() {
  const [invoiceCode, setInvoiceCode] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [invoiceDate, setInvoiceDate] = useState("")
  const [invoiceAmount, setInvoiceAmount] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [result, setResult] = useState<"success" | "fail" | null>(null)
  const [verificationHistory, setVerificationHistory] = useState([
    { code: "044001900111", date: "2024-12-01", result: "success", time: "2024-12-03 10:30:25" },
    { code: "044001900107", date: "2024-12-01", result: "fail", time: "2024-12-03 09:15:42" },
    { code: "044001900105", date: "2024-11-28", result: "success", time: "2024-12-02 14:22:18" },
  ])

  const handleVerify = () => {
    if (!invoiceCode || !invoiceNumber) return
    setVerifying(true)
    setResult(null)

    // Simulate API call
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3
      setResult(isSuccess ? "success" : "fail")
      setVerificationHistory((prev) => [
        {
          code: invoiceCode,
          date: invoiceDate || new Date().toISOString().split("T")[0],
          result: isSuccess ? "success" : "fail",
          time: new Date().toLocaleString("zh-CN"),
        },
        ...prev,
      ])
      setVerifying(false)
    }, 1500)
  }

  const handleClear = () => {
    setInvoiceCode("")
    setInvoiceNumber("")
    setInvoiceDate("")
    setInvoiceAmount("")
    setResult(null)
  }

  return (
    <MainLayout title="发票验真" breadcrumbs={[{ label: "发票管理" }, { label: "发票验真" }]}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verify Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fa-solid fa-file-circle-check text-blue-600" />
                发票验真
              </CardTitle>
              <CardDescription>输入发票信息进行真伪验证，支持增值税专用发票和增值税普通发票</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="invoiceCode">发票代码 *</Label>
                  <Input
                    id="invoiceCode"
                    placeholder="请输入发票代码"
                    value={invoiceCode}
                    onChange={(e) => setInvoiceCode(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">发票号码 *</Label>
                  <Input
                    id="invoiceNumber"
                    placeholder="请输入发票号码"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceDate">开票日期</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceAmount">金额（不含税）</Label>
                  <Input
                    id="invoiceAmount"
                    type="number"
                    placeholder="请输入金额"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                  />
                </div>
              </div>

              {/* Result Display */}
              {result && (
                <div
                  className={`mt-6 p-4 rounded-lg border ${
                    result === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        result === "success" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      <i className={`fa-solid ${result === "success" ? "fa-check" : "fa-times"} text-white text-xl`} />
                    </div>
                    <div>
                      <p className={`font-bold text-lg ${result === "success" ? "text-green-700" : "text-red-700"}`}>
                        {result === "success" ? "验证通过" : "验证失败"}
                      </p>
                      <p className={`text-sm ${result === "success" ? "text-green-600" : "text-red-600"}`}>
                        {result === "success" ? "该发票信息与税务系统记录一致" : "未找到匹配的发票信息，请核对后重试"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 mt-6">
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleVerify}
                  disabled={verifying || !invoiceCode || !invoiceNumber}
                >
                  {verifying ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2" />
                      验证中...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-magnifying-glass mr-2" />
                      开始验证
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  <i className="fa-solid fa-eraser mr-2" />
                  清空
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <i className="fa-solid fa-lightbulb text-amber-500" />
                使用说明
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-circle-check text-green-500 mt-0.5" />
                  <span>发票代码和发票号码为必填项</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-circle-check text-green-500 mt-0.5" />
                  <span>开票日期和金额可选填，填写后验证结果更准确</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-circle-check text-green-500 mt-0.5" />
                  <span>验证结果仅供参考，最终以税务机关认定为准</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-circle-check text-green-500 mt-0.5" />
                  <span>如多次验证失败，请联系财务部门核实</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* History */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <i className="fa-solid fa-clock-rotate-left text-slate-500" />
                验证历史
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {verificationHistory.map((item, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-medium">{item.code}</span>
                      <Badge
                        className={
                          item.result === "success"
                            ? "bg-green-100 text-green-600 hover:bg-green-100"
                            : "bg-red-100 text-red-600 hover:bg-red-100"
                        }
                      >
                        {item.result === "success" ? "通过" : "失败"}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">{item.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
