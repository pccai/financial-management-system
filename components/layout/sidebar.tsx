"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MenuItem {
  id: string
  label: string
  icon: string
  href?: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "工作台",
    icon: "fa-solid fa-gauge-high",
    href: "/dashboard",
  },
  {
    id: "approval",
    label: "审批中心",
    icon: "fa-solid fa-clipboard-check",
    children: [
      { id: "approval-pending", label: "待我审批", icon: "fa-solid fa-hourglass-half", href: "/approval/pending" },
      { id: "approval-done", label: "已审批", icon: "fa-solid fa-check-double", href: "/approval/done" },
      { id: "approval-initiated", label: "我发起的", icon: "fa-solid fa-paper-plane", href: "/approval/initiated" },
    ],
  },
  {
    id: "budget",
    label: "预算管理",
    icon: "fa-solid fa-wallet",
    children: [
      { id: "budget-list", label: "预算列表", icon: "fa-solid fa-list", href: "/budget" },
      { id: "budget-allocation", label: "预算分配", icon: "fa-solid fa-sitemap", href: "/budget/allocation" },
      { id: "budget-analysis", label: "预算分析", icon: "fa-solid fa-chart-pie", href: "/budget/analysis" },
    ],
  },
  {
    id: "expense",
    label: "费用申请",
    icon: "fa-solid fa-file-invoice-dollar",
    children: [
      { id: "expense-apply", label: "费用申请", icon: "fa-solid fa-file-circle-plus", href: "/expense/apply" },
      { id: "expense-list", label: "申请记录", icon: "fa-solid fa-rectangle-list", href: "/expense" },
    ],
  },
  {
    id: "reimbursement",
    label: "报销管理",
    icon: "fa-solid fa-money-bill-transfer",
    children: [
      { id: "reimburse-apply", label: "报销申请", icon: "fa-solid fa-receipt", href: "/reimbursement/apply" },
      { id: "reimburse-list", label: "报销记录", icon: "fa-solid fa-file-lines", href: "/reimbursement" },
    ],
  },
  {
    id: "invoice",
    label: "发票管理",
    icon: "fa-solid fa-file-invoice",
    children: [
      { id: "invoice-list", label: "发票列表", icon: "fa-solid fa-files-invoice", href: "/invoice" },
      { id: "invoice-verify", label: "发票验真", icon: "fa-solid fa-file-circle-check", href: "/invoice/verify" },
    ],
  },
  {
    id: "reports",
    label: "报表中心",
    icon: "fa-solid fa-chart-line",
    children: [
      { id: "report-expense", label: "费用报表", icon: "fa-solid fa-chart-column", href: "/reports/expense" },
      { id: "report-budget", label: "预算报表", icon: "fa-solid fa-chart-area", href: "/reports/budget" },
      { id: "report-department", label: "部门报表", icon: "fa-solid fa-building-user", href: "/reports/department" },
    ],
  },
  {
    id: "settings",
    label: "系统设置",
    icon: "fa-solid fa-gear",
    children: [
      { id: "settings-user", label: "用户管理", icon: "fa-solid fa-users", href: "/settings/users" },
      { id: "settings-role", label: "角色权限", icon: "fa-solid fa-user-shield", href: "/settings/roles" },
      { id: "settings-dept", label: "部门管理", icon: "fa-solid fa-sitemap", href: "/settings/departments" },
      { id: "settings-category", label: "费用类型", icon: "fa-solid fa-tags", href: "/settings/categories" },
      { id: "settings-workflow", label: "审批流程", icon: "fa-solid fa-diagram-project", href: "/settings/workflow" },
    ],
  },
]

function findParentMenuId(pathname: string, items: MenuItem[]): string | null {
  for (const item of items) {
    if (item.children) {
      for (const child of item.children) {
        if (child.href && (pathname === child.href || pathname.startsWith(child.href + "/"))) {
          return item.id
        }
      }
    }
  }
  return null
}

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [expandedItems, setExpandedItems] = useState<string[]>(["approval"])
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const parentId = findParentMenuId(pathname, menuItems)
    if (parentId && !expandedItems.includes(parentId)) {
      setExpandedItems((prev) => [...prev, parentId])
    }
  }, [pathname])

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const isActive = (href?: string) => {
    if (!href) return false
    return pathname === href || pathname.startsWith(href + "/")
  }

  const isParentActive = (item: MenuItem) => {
    if (item.href) return isActive(item.href)
    return item.children?.some((child) => isActive(child.href))
  }

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-slate-900 text-slate-100 transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-4 border-b border-slate-700/50">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
          <i className="fa-solid fa-building-columns text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-lg truncate">费控管理</h1>
            <p className="text-xs text-slate-400 truncate">UBStore V1.0</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 sidebar-scroll">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      isParentActive(item)
                        ? "bg-blue-600/20 text-blue-400"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white",
                    )}
                  >
                    <i className={cn(item.icon, "w-5 text-center")} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left text-sm">{item.label}</span>
                        <i
                          className={cn(
                            "fa-solid fa-chevron-down text-xs transition-transform",
                            expandedItems.includes(item.id) && "rotate-180",
                          )}
                        />
                      </>
                    )}
                  </button>
                  {!collapsed && expandedItems.includes(item.id) && (
                    <ul className="mt-1 ml-4 border-l border-slate-700 pl-3 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={child.href || "#"}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                              isActive(child.href)
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white",
                            )}
                          >
                            <i className={cn(child.icon, "w-4 text-center text-xs")} />
                            <span>{child.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href || "#"}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive(item.href)
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white",
                  )}
                >
                  <i className={cn(item.icon, "w-5 text-center")} />
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
      >
        <i className={cn("fa-solid transition-transform", collapsed ? "fa-angles-right" : "fa-angles-left")} />
      </button>

      {/* User Profile */}
      <div className="border-t border-slate-700/50 p-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full">
            <div
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer",
                collapsed && "justify-center",
              )}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-user text-white text-sm" />
              </div>
              {!collapsed && (
                <div className="flex-1 text-left overflow-hidden">
                  <p className="text-sm font-medium truncate">{user?.name || "用户"}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.role || "角色"}</p>
                </div>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="cursor-pointer">
              <i className="fa-solid fa-user-pen mr-2" />
              个人中心
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <i className="fa-solid fa-gear mr-2" />
              账号设置
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500 focus:text-red-500">
              <i className="fa-solid fa-right-from-bracket mr-2" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
