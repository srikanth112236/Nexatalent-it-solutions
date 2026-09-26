import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
export class ErrorBoundary extends Component {
    state = {
        hasError: false,
        error: null,
    };
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
    }
    handleReset = () => {
        this.setState({ hasError: false, error: null });
        this.props.onReset?.();
    };
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (_jsxs("div", { role: "alert", style: {
                    padding: '2.5rem',
                    margin: '2rem auto',
                    maxWidth: '600px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #fee2e2',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }, children: [_jsx("span", { style: { fontSize: '1.5rem', color: '#ef4444' }, children: "\u26A0\uFE0F" }), _jsx("h2", { style: { fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: 0 }, children: "Something went wrong" })] }), _jsx("p", { style: { color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.25rem' }, children: "An unexpected error occurred while rendering this view." }), this.state.error && (_jsx("pre", { style: {
                            padding: '0.75rem 1rem',
                            backgroundColor: '#f8fafc',
                            borderRadius: '6px',
                            fontSize: '0.825rem',
                            color: '#dc2626',
                            overflowX: 'auto',
                            marginBottom: '1.5rem',
                        }, children: this.state.error.message })), _jsx("button", { onClick: this.handleReset, style: {
                            padding: '0.625rem 1.25rem',
                            backgroundColor: '#0f172a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                        }, children: "Try Again" })] }));
        }
        return this.props.children;
    }
}
//# sourceMappingURL=ErrorBoundary.js.map