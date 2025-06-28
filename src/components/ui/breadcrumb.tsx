import * as React from 'react'
import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
  isCurrentPage?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, className }, ref) => (
    <nav
      ref={ref}
      aria-label="breadcrumb"
      className={cn('mb-4 text-sm text-gray-500 dark:text-gray-400', className)}
    >
      <ol className="list-reset flex items-center">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="mx-2 h-3 w-3 text-gray-400" aria-hidden="true" />
            )}
            {item.href && !item.isCurrentPage ? (
              <Link
                href={item.href}
                className="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                {index === 0 && item.label === 'Home' ? (
                  <Home className="inline h-4 w-4" aria-label="Home" />
                ) : (
                  item.label
                )}
              </Link>
            ) : (
              <span
                className={cn(
                  'font-medium',
                  item.isCurrentPage
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                )}
                aria-current={item.isCurrentPage ? 'page' : undefined}
              >
                {index === 0 && item.label === 'Home' ? (
                  <Home className="inline h-4 w-4" aria-label="Home" />
                ) : (
                  item.label
                )}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
)
Breadcrumb.displayName = 'Breadcrumb'

// 便利な関数：ページに基づいてパンくずリストを生成
export const createBreadcrumbItems = (
  path: string,
  customLabels?: Record<string, string>
): BreadcrumbItem[] => {
  const segments = path.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }]

  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1
    const label = customLabels?.[segment] || segment

    items.push({
      label,
      href: isLast ? undefined : currentPath,
      isCurrentPage: isLast,
    })
  })

  return items
}

export { Breadcrumb }
export type { BreadcrumbItem, BreadcrumbProps }