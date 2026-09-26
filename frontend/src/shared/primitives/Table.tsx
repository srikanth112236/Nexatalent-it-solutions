import { TableHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> extends TableHTMLAttributes<HTMLTableElement> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  keyExtractor: (row: T) => string | number;
}

export function Table<T>({
  columns,
  data,
  emptyMessage = 'No records found',
  keyExtractor,
  className,
  ...props
}: TableProps<T>) {
  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <table
        className={cn('w-full border-collapse text-left', className)}
        style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}
        {...props}
      >
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-raised)' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: '0.875rem 1.25rem',
                  fontWeight: 600,
                  color: 'var(--color-text-muted)',
                  fontSize: '0.8125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  width: col.width,
                  textAlign: col.align || 'left',
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: '3rem 1.5rem',
                  textAlign: 'center',
                  color: 'var(--color-text-muted)',
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                style={{
                  borderBottom: '1px solid var(--color-border-subtle)',
                  transition: 'background-color 0.15s ease',
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: '1rem 1.25rem',
                      color: 'var(--color-text)',
                      textAlign: col.align || 'left',
                    }}
                  >
                    {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as ReactNode}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
