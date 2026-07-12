import { Skeleton } from "./skeleton";

export function CardSkeleton() {
  return (
    <div className="bg-white rounded border border-outline-variant p-5 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-8 w-16" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded border border-outline-variant p-5 flex flex-col gap-3 relative overflow-hidden">
      <div className="flex justify-between items-start">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
      <Skeleton className="h-9 w-20" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-highest">
        <Skeleton className="h-full w-3/4" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full">
      <div className="border-b border-outline-variant bg-surface">
        <div className="flex gap-4 px-4 py-3">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-outline-variant">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 px-4 py-3">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DepartmentCardSkeleton() {
  return (
    <div className="bg-white rounded border border-outline-variant p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

export function AssetRowSkeleton() {
  return (
    <tr className="hover:bg-surface-container-low transition-colors">
      <td className="py-2.5 px-4"><Skeleton className="h-4 w-4 rounded" /></td>
      <td className="py-2.5 px-4"><Skeleton className="h-4 w-16" /></td>
      <td className="py-2.5 px-4"><Skeleton className="h-4 w-24" /></td>
      <td className="py-2.5 px-4"><Skeleton className="h-4 w-20" /></td>
      <td className="py-2.5 px-4"><Skeleton className="h-4 w-24" /></td>
      <td className="py-2.5 px-4"><Skeleton className="h-6 w-16 rounded" /></td>
      <td className="py-2.5 px-4"><Skeleton className="h-4 w-24" /></td>
      <td className="py-2.5 px-4 text-right"><Skeleton className="h-4 w-8" /></td>
    </tr>
  );
}

export function AllocationRowSkeleton() {
  return (
    <tr className="hover:bg-surface-container-low transition-colors">
      <td className="py-3 px-6"><Skeleton className="h-4 w-20" /></td>
      <td className="py-3 px-6"><Skeleton className="h-4 w-32" /></td>
      <td className="py-3 px-6"><Skeleton className="h-4 w-28" /></td>
      <td className="py-3 px-6"><Skeleton className="h-4 w-24" /></td>
      <td className="py-3 px-6"><Skeleton className="h-4 w-24" /></td>
      <td className="py-3 px-6"><Skeleton className="h-4 w-32" /></td>
    </tr>
  );
}

export function ActivityRowSkeleton() {
  return (
    <tr className="hover:bg-surface-container-low transition-colors">
      <td className="px-6 py-3"><Skeleton className="h-4 w-32" /></td>
      <td className="px-6 py-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </td>
      <td className="px-6 py-3"><Skeleton className="h-6 w-16 rounded" /></td>
      <td className="px-6 py-3"><Skeleton className="h-4 w-24" /></td>
      <td className="px-6 py-3"><Skeleton className="h-4 w-32" /></td>
    </tr>
  );
}

export function AuditRowSkeleton() {
  return (
    <tr className="hover:bg-surface-container-low transition-colors">
      <td className="py-3 px-6"><Skeleton className="h-4 w-16" /></td>
      <td className="py-3 px-6"><Skeleton className="h-4 w-32" /></td>
      <td className="py-3 px-6"><Skeleton className="h-4 w-28" /></td>
      <td className="py-3 px-6"><Skeleton className="h-4 w-24" /></td>
      <td className="py-3 px-6"><Skeleton className="h-6 w-20 rounded" /></td>
      <td className="py-3 px-6"><Skeleton className="h-4 w-32" /></td>
      <td className="py-3 px-6 text-right"><Skeleton className="h-6 w-20 rounded" /></td>
    </tr>
  );
}

export function MaintenanceRowSkeleton() {
  return (
    <tr className="hover:bg-surface-container-low">
      <td className="py-3 px-6"><Skeleton className="h-4 w-16" /></td>
      <td className="py-3 px-6"><Skeleton className="h-4 w-32" /></td>
      <td className="py-3 px-6"><Skeleton className="h-6 w-16 rounded" /></td>
      <td className="py-3 px-6"><Skeleton className="h-6 w-20 rounded" /></td>
      <td className="py-3 px-6 text-right"><Skeleton className="h-4 w-16" /></td>
    </tr>
  );
}

export function MaintenancePageRowSkeleton() {
  return (
    <tr className="hover:bg-surface-container-low transition-colors">
      <td className="py-3 px-6"><Skeleton className="h-4 w-16" /></td>
      <td className="py-3 px-6"><Skeleton className="h-4 w-24" /></td>
      <td className="py-3 px-6"><Skeleton className="h-4 w-32" /></td>
      <td className="py-3 px-6"><Skeleton className="h-6 w-16 rounded" /></td>
      <td className="py-3 px-6"><Skeleton className="h-4 w-20" /></td>
      <td className="py-3 px-6"><Skeleton className="h-4 w-16" /></td>
      <td className="py-3 px-6"><Skeleton className="h-6 w-20 rounded" /></td>
      <td className="py-3 px-6 text-right"><Skeleton className="h-6 w-16 rounded" /></td>
    </tr>
  );
}
