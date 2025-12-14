"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  title: string
  breadcrumbs?: { label: string; href?: string }[]
}

export function Header({ title, breadcrumbs }: HeaderProps) {
  const { user, logout } = useAuth()
  const [showSearch, setShowSearch] = useState(false)

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <i className="fa-solid fa-house text-slate-400" />
            {breadcrumbs.map((item, index) => (
              <span key={index} className="flex items-center gap-2">
                <i className="fa-solid fa-chevron-right text-xs text-slate-300" />
                <span className={index === breadcrumbs.length - 1 ? "text-slate-800 font-medium" : ""}>
                  {item.label}
                </span>
              </span>
            ))}
          </nav>
        )}
        {!breadcrumbs && <h1 className="text-lg font-semibold text-slate-800">{title}</h1>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          {showSearch ? (
            <div className="flex items-center gap-2">
              <Input placeholder="搜索..." className="w-64 h-9" autoFocus onBlur={() => setShowSearch(false)} />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-500 hover:text-slate-700"
              onClick={() => setShowSearch(true)}
            >
              <i className="fa-solid fa-magnifying-glass" />
            </Button>
          )}
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-700">
              <i className="fa-solid fa-bell" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                5
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-4 py-3 border-b">
              <h3 className="font-semibold text-slate-800">通知消息</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {[
                {
                  title: "费用申请待审批",
                  desc: "张三提交了差旅费用申请",
                  time: "5分钟前",
                  icon: "fa-file-invoice-dollar",
                  color: "text-blue-500",
                },
                {
                  title: "报销已通过",
                  desc: "您的报销申请已通过审批",
                  time: "30分钟前",
                  icon: "fa-check-circle",
                  color: "text-green-500",
                },
                {
                  title: "预算预警",
                  desc: "市场部本月预算已使用85%",
                  time: "1小时前",
                  icon: "fa-triangle-exclamation",
                  color: "text-amber-500",
                },
              ].map((item, i) => (
                <DropdownMenuItem key={i} className="px-4 py-3 cursor-pointer">
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center ${item.color}`}>
                      <i className={`fa-solid ${item.icon} text-sm`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                      <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-blue-500 cursor-pointer justify-center py-2">
              查看全部通知
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Messages */}
        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-700">
          <i className="fa-solid fa-envelope" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-blue-500 text-white text-xs">
            3
          </Badge>
        </Button>

        {/* User Menu */}
        <div className="h-6 w-px bg-slate-200 mx-2" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <i className="fa-solid fa-user text-white text-sm" />
              </div>
              <span className="font-medium">{user?.name}</span>
              <i className="fa-solid fa-chevron-down text-xs text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/profile" className="flex items-center">
                <i className="fa-solid fa-user-pen mr-2 text-slate-400" />
                个人中心
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/account" className="flex items-center">
                <i className="fa-solid fa-gear mr-2 text-slate-400" />
                账号设置
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500 focus:text-red-500">
              <i className="fa-solid fa-right-from-bracket mr-2" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
