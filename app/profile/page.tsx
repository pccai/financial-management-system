"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showAvatarDialog, setShowAvatarDialog] = useState(false)
  const [profile, setProfile] = useState({
    name: user?.name || "管理员",
    email: "admin@ubstore.com",
    phone: "138****8888",
    department: "信息技术部",
    position: "系统管理员",
    employeeId: "EMP001",
    joinDate: "2020-03-15",
    bio: "负责公司费控管理系统的日常运维和管理工作。",
  })

  const stats = [
    { label: "待审批", value: 12, icon: "fa-hourglass-half", color: "text-amber-500 bg-amber-50" },
    { label: "已审批", value: 156, icon: "fa-check-circle", color: "text-green-500 bg-green-50" },
    { label: "发起申请", value: 23, icon: "fa-paper-plane", color: "text-blue-500 bg-blue-50" },
    { label: "本月报销", value: "¥12,580", icon: "fa-money-bill-wave", color: "text-purple-500 bg-purple-50" },
  ]

  const recentActivities = [
    { action: "审批通过", target: "张三的差旅费用申请", time: "10分钟前", icon: "fa-check", color: "text-green-500" },
    {
      action: "提交申请",
      target: "办公用品采购报销",
      time: "2小时前",
      icon: "fa-file-circle-plus",
      color: "text-blue-500",
    },
    { action: "审批驳回", target: "李四的招待费申请", time: "昨天 15:30", icon: "fa-times", color: "text-red-500" },
    { action: "审批通过", target: "王五的培训费用申请", time: "昨天 10:20", icon: "fa-check", color: "text-green-500" },
    {
      action: "提交申请",
      target: "部门团建费用报销",
      time: "3天前",
      icon: "fa-file-circle-plus",
      color: "text-blue-500",
    },
  ]

  return (
    <MainLayout title="个人中心" breadcrumbs={[{ label: "个人中心" }]}>
      <div className="p-6 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                  <i className="fa-solid fa-user text-4xl text-white" />
                </div>
                <button
                  onClick={() => setShowAvatarDialog(true)}
                  className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <i className="fa-solid fa-camera text-white" />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-slate-800">{profile.name}</h2>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">{user?.role}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-building" />
                    {profile.department}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-briefcase" />
                    {profile.position}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-id-badge" />
                    {profile.employeeId}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-calendar" />
                    入职于 {profile.joinDate}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{profile.bio}</p>
              </div>

              {/* Actions */}
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <i className="fa-solid fa-pen mr-2" />
                编辑资料
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <i className={`fa-solid ${stat.icon} text-lg`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <i className="fa-solid fa-address-card text-blue-500" />
                联系信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-envelope text-slate-400 w-5" />
                  <span className="text-slate-600">电子邮箱</span>
                </div>
                <span className="text-slate-800 font-medium">{profile.email}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-phone text-slate-400 w-5" />
                  <span className="text-slate-600">手机号码</span>
                </div>
                <span className="text-slate-800 font-medium">{profile.phone}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-location-dot text-slate-400 w-5" />
                  <span className="text-slate-600">办公地点</span>
                </div>
                <span className="text-slate-800 font-medium">上海市浦东新区</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <i className="fa-solid fa-clock-rotate-left text-blue-500" />
                最近动态
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 ${activity.color}`}
                    >
                      <i className={`fa-solid ${activity.icon} text-sm`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800">
                        <span className="font-medium">{activity.action}</span>
                        <span className="text-slate-500"> - {activity.target}</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>编辑个人资料</DialogTitle>
              <DialogDescription>更新您的个人信息</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>姓名</Label>
                  <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>工号</Label>
                  <Input value={profile.employeeId} disabled className="bg-slate-50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>电子邮箱</Label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>手机号码</Label>
                  <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>个人简介</Label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                取消
              </Button>
              <Button onClick={() => setIsEditing(false)}>保存修改</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Avatar Dialog */}
        <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>更换头像</DialogTitle>
              <DialogDescription>上传新的头像图片</DialogDescription>
            </DialogHeader>
            <div className="py-6 flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <i className="fa-solid fa-user text-5xl text-white" />
              </div>
              <Button variant="outline">
                <i className="fa-solid fa-upload mr-2" />
                选择图片
              </Button>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAvatarDialog(false)}>
                取消
              </Button>
              <Button onClick={() => setShowAvatarDialog(false)}>确认更换</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
