"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AccountPage() {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showBindPhoneDialog, setShowBindPhoneDialog] = useState(false)
  const [showBindEmailDialog, setShowBindEmailDialog] = useState(false)

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    browser: true,
    approval: true,
    budget: true,
    system: false,
  })

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlert: true,
  })

  const loginHistory = [
    {
      time: "2024-01-15 09:30:25",
      ip: "192.168.1.100",
      location: "上海市浦东新区",
      device: "Chrome / Windows",
      status: "成功",
    },
    {
      time: "2024-01-14 14:22:10",
      ip: "192.168.1.100",
      location: "上海市浦东新区",
      device: "Chrome / Windows",
      status: "成功",
    },
    {
      time: "2024-01-13 08:45:33",
      ip: "192.168.1.105",
      location: "上海市浦东新区",
      device: "Safari / macOS",
      status: "成功",
    },
    {
      time: "2024-01-12 16:18:42",
      ip: "10.0.0.55",
      location: "上海市徐汇区",
      device: "Chrome / Android",
      status: "成功",
    },
    {
      time: "2024-01-11 10:05:18",
      ip: "192.168.1.100",
      location: "上海市浦东新区",
      device: "Chrome / Windows",
      status: "失败",
    },
  ]

  return (
    <MainLayout title="账号设置" breadcrumbs={[{ label: "账号设置" }]}>
      <div className="p-6">
        <Tabs defaultValue="security" className="space-y-6">
          <TabsList className="bg-slate-100">
            <TabsTrigger value="security">
              <i className="fa-solid fa-shield-halved mr-2" />
              安全设置
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <i className="fa-solid fa-bell mr-2" />
              通知设置
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <i className="fa-solid fa-sliders mr-2" />
              偏好设置
            </TabsTrigger>
            <TabsTrigger value="history">
              <i className="fa-solid fa-clock-rotate-left mr-2" />
              登录历史
            </TabsTrigger>
          </TabsList>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">账号安全</CardTitle>
                <CardDescription>管理您的账号安全设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Password */}
                <div className="flex items-center justify-between py-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <i className="fa-solid fa-key text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">登录密码</p>
                      <p className="text-sm text-slate-500">定期修改密码可以保护账号安全</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setShowPasswordDialog(true)}>
                    修改密码
                  </Button>
                </div>

                {/* Phone */}
                <div className="flex items-center justify-between py-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                      <i className="fa-solid fa-mobile-screen text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">绑定手机</p>
                      <p className="text-sm text-slate-500">已绑定：138****8888</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setShowBindPhoneDialog(true)}>
                    更换手机
                  </Button>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between py-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                      <i className="fa-solid fa-envelope text-purple-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">绑定邮箱</p>
                      <p className="text-sm text-slate-500">已绑定：admin@ubstore.com</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setShowBindEmailDialog(true)}>
                    更换邮箱
                  </Button>
                </div>

                {/* Two Factor */}
                <div className="flex items-center justify-between py-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                      <i className="fa-solid fa-shield text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">两步验证</p>
                      <p className="text-sm text-slate-500">开启后登录时需要进行二次验证</p>
                    </div>
                  </div>
                  <Switch
                    checked={security.twoFactor}
                    onCheckedChange={(checked) => setSecurity({ ...security, twoFactor: checked })}
                  />
                </div>

                {/* Login Alert */}
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                      <i className="fa-solid fa-bell text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">异常登录提醒</p>
                      <p className="text-sm text-slate-500">异地登录时发送通知提醒</p>
                    </div>
                  </div>
                  <Switch
                    checked={security.loginAlert}
                    onCheckedChange={(checked) => setSecurity({ ...security, loginAlert: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">通知渠道</CardTitle>
                <CardDescription>选择接收通知的方式</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-envelope text-slate-400" />
                    <span className="text-slate-700">邮件通知</span>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-comment-sms text-slate-400" />
                    <span className="text-slate-700">短信通知</span>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                  />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-bell text-slate-400" />
                    <span className="text-slate-700">浏览器通知</span>
                  </div>
                  <Switch
                    checked={notifications.browser}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, browser: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">通知类型</CardTitle>
                <CardDescription>选择需要接收的通知类型</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-slate-700 font-medium">审批通知</p>
                    <p className="text-sm text-slate-500">收到新的审批请求时通知</p>
                  </div>
                  <Switch
                    checked={notifications.approval}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, approval: checked })}
                  />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-slate-700 font-medium">预算预警</p>
                    <p className="text-sm text-slate-500">预算使用超过阈值时通知</p>
                  </div>
                  <Switch
                    checked={notifications.budget}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, budget: checked })}
                  />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-slate-700 font-medium">系统公告</p>
                    <p className="text-sm text-slate-500">接收系统更新和公告通知</p>
                  </div>
                  <Switch
                    checked={notifications.system}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, system: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">显示设置</CardTitle>
                <CardDescription>自定义界面显示偏好</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>语言</Label>
                    <Select defaultValue="zh-CN">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zh-CN">简体中文</SelectItem>
                        <SelectItem value="zh-TW">繁体中文</SelectItem>
                        <SelectItem value="en-US">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>时区</Label>
                    <Select defaultValue="Asia/Shanghai">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Shanghai">中国标准时间 (UTC+8)</SelectItem>
                        <SelectItem value="Asia/Tokyo">日本标准时间 (UTC+9)</SelectItem>
                        <SelectItem value="America/New_York">美国东部时间 (UTC-5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>日期格式</Label>
                    <Select defaultValue="YYYY-MM-DD">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="YYYY-MM-DD">2024-01-15</SelectItem>
                        <SelectItem value="DD/MM/YYYY">15/01/2024</SelectItem>
                        <SelectItem value="MM/DD/YYYY">01/15/2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>每页显示条数</Label>
                    <Select defaultValue="10">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 条</SelectItem>
                        <SelectItem value="20">20 条</SelectItem>
                        <SelectItem value="50">50 条</SelectItem>
                        <SelectItem value="100">100 条</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">默认设置</CardTitle>
                <CardDescription>配置默认行为</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>默认首页</Label>
                    <Select defaultValue="dashboard">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dashboard">工作台</SelectItem>
                        <SelectItem value="approval">审批中心</SelectItem>
                        <SelectItem value="expense">费用申请</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>默认审批意见</Label>
                    <Select defaultValue="agree">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agree">同意</SelectItem>
                        <SelectItem value="none">无</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>
                    <i className="fa-solid fa-save mr-2" />
                    保存设置
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">登录历史</CardTitle>
                <CardDescription>查看最近的登录记录</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">登录时间</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">IP地址</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">登录地点</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">设备/浏览器</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loginHistory.map((record, index) => (
                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 text-sm text-slate-700">{record.time}</td>
                          <td className="py-3 px-4 text-sm text-slate-700 font-mono">{record.ip}</td>
                          <td className="py-3 px-4 text-sm text-slate-700">{record.location}</td>
                          <td className="py-3 px-4 text-sm text-slate-700">{record.device}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                                record.status === "成功" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}
                            >
                              <i className={`fa-solid ${record.status === "成功" ? "fa-check" : "fa-times"}`} />
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Change Password Dialog */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>修改密码</DialogTitle>
              <DialogDescription>请输入当前密码和新密码</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>当前密码</Label>
                <Input type="password" placeholder="请输入当前密码" />
              </div>
              <div className="space-y-2">
                <Label>新密码</Label>
                <Input type="password" placeholder="请输入新密码" />
              </div>
              <div className="space-y-2">
                <Label>确认新密码</Label>
                <Input type="password" placeholder="请再次输入新密码" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                取消
              </Button>
              <Button onClick={() => setShowPasswordDialog(false)}>确认修改</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bind Phone Dialog */}
        <Dialog open={showBindPhoneDialog} onOpenChange={setShowBindPhoneDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>更换手机号</DialogTitle>
              <DialogDescription>请输入新的手机号码并验证</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>新手机号</Label>
                <Input type="tel" placeholder="请输入新手机号" />
              </div>
              <div className="space-y-2">
                <Label>验证码</Label>
                <div className="flex gap-2">
                  <Input placeholder="请输入验证码" className="flex-1" />
                  <Button variant="outline">获取验证码</Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBindPhoneDialog(false)}>
                取消
              </Button>
              <Button onClick={() => setShowBindPhoneDialog(false)}>确认绑定</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bind Email Dialog */}
        <Dialog open={showBindEmailDialog} onOpenChange={setShowBindEmailDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>更换邮箱</DialogTitle>
              <DialogDescription>请输入新的邮箱地址并验证</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>新邮箱</Label>
                <Input type="email" placeholder="请输入新邮箱地址" />
              </div>
              <div className="space-y-2">
                <Label>验证码</Label>
                <div className="flex gap-2">
                  <Input placeholder="请输入验证码" className="flex-1" />
                  <Button variant="outline">发送验证码</Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBindEmailDialog(false)}>
                取消
              </Button>
              <Button onClick={() => setShowBindEmailDialog(false)}>确认绑定</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
