import { Breadcrumb } from '../ui/breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface CommonLayoutWithHeaderProps {
  children: React.ReactNode;
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
}

export default function CommonLayoutWithHeader({
  children,
  title,
  description,
  breadcrumbs,
}: CommonLayoutWithHeaderProps) {
  return (
    <div className="text-foreground bg-main-background group/design-root relative flex size-full min-h-screen flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center px-10 py-5">
          <div className="layout-content-container flex max-w-[960px] flex-1 flex-col">
            {/* ブレッドクラム */}
            <Breadcrumb items={breadcrumbs} />

            {/* ヘッダー */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="tracking-light text-[32px] leading-tight font-bold">{title}</p>
                <p className="text-sm leading-normal font-normal text-[#49749c]">{description}</p>
              </div>
            </div>

            {/* コンテンツ本体 */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
