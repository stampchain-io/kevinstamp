import React from 'react';
import { Link } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function BreadcrumbNav({ items, className = '' }: BreadcrumbNavProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-2 text-sm text-kevin-mint ${className}`}
      role="navigation"
    >
      <ol className="flex items-center space-x-2" role="list">
        {/* Home breadcrumb */}
        <li role="listitem">
          <Link
            href="/"
            className="flex items-center hover:text-kevin-orange transition-colors"
            aria-label="Go to homepage"
          >
            <Home className="w-4 h-4 mr-1" aria-hidden="true" />
            <span className="sr-only">Home</span>
            <span className="hidden sm:inline">KEVIN Saga</span>
          </Link>
        </li>

        {/* Separator */}
        <li role="listitem" aria-hidden="true">
          <ChevronRight className="w-4 h-4 text-kevin-steel" />
        </li>

        {/* Dynamic breadcrumbs */}
        {items.map((item, index) => (
          <React.Fragment key={item.href}>
            <li role="listitem">
              {item.current ? (
                <span
                  className="text-kevin-orange font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-kevin-orange transition-colors"
                  aria-label={`Go to ${item.label}`}
                >
                  {item.label}
                </Link>
              )}
            </li>

            {/* Separator (not for last item) */}
            {index < items.length - 1 && (
              <li role="listitem" aria-hidden="true">
                <ChevronRight className="w-4 h-4 text-kevin-steel" />
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

// Hook for generating breadcrumbs based on current route
export function useBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
    'lore': [
      { label: 'Lore', href: '/lore', current: true }
    ],
    'stamps': [
      { label: 'Stamps', href: '/stamps', current: true }
    ],
    'community': [
      { label: 'Community', href: '/community', current: true }
    ],
    'token': [
      { label: 'Token', href: '/token', current: true }
    ]
  };

  return breadcrumbMap[pathSegments[0]] || [];
}
