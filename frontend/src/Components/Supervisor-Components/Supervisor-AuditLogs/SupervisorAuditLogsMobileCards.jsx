import { copyJSON } from "../../../Utils/Supervisor-Utils/SupervisorAuditLogsExportUtils";
import { JSON_INDENT_SPACES } from "../../../Data/Global_variables";

const SupervisorAuditLogsMobileCards = ({ log, expandedId, setExpandedId }) => {
    const logId = log._id || log.id || Math.random();
    const isExpanded = expandedId === logId;

    return (
        <div className="rounded shadow border p-3 bg-[var(--nav-bg)] border-[var(--nav-text)] text-[var(--nav-text)]">
            <div className="flex justify-between items-start mb-2 border-b border-[var(--nav-text)] p-1">
                <div className="text-xs text-[var(--muted)] duration-300 transition-colors">{new Date(log.createdAt || log.date || log._id).toLocaleString()}</div>
                <div className="font-mono text-xs duration-300 transition-colors">{log.accountNumber}</div>
            </div>
            <div className="mb-1 text-sm mt-5 duration-300 transition-colors"><strong>User:</strong> {log.userName || log.userId || '-'} </div>
            <div className="mb-1 text-sm mt-2 duration-300 transition-colors"><strong>Account Number:</strong> {log.accountNumber || '-'}</div>
            <div className="mb-1 text-sm truncate mt-2 duration-300 transition-colors"><strong>Message:</strong> {log.message || '-'}</div>
            <div className="mb-1 text-sm truncate mt-2 duration-300 transition-colors"><strong>Action:</strong> {log.action}</div>
            <div className="flex justify-end mt-3 gap-2 duration-300 transition-colors">
                <button onClick={() => setExpandedId(isExpanded ? null : logId)} className="px-2 py-1 border rounded text-xs bg-[var(--nav-text)] hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] text-[var(--nav-bg)] hover:border hover:border-[var(--nav-hover)] shadow-md transition-all duration-300">
                    {isExpanded ? 'Hide Details' : 'View Details'}
                </button>
                <button onClick={() => copyJSON(log)} className="px-2 py-1 border rounded text-xs bg-[var(--nav-text)] hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] text-[var(--nav-bg)] hover:border hover:border-[var(--nav-hover)] shadow-md transition-all duration-300">Copy</button>
            </div>
            {isExpanded && (
                <pre className="mt-3 p-2 bg-[var(--nav-bg)] border rounded text-xs font-mono whitespace-pre-wrap max-h-60 overflow-auto">{JSON.stringify(log, null, JSON_INDENT_SPACES)}</pre>
            )}
        </div>
    );
};

export default SupervisorAuditLogsMobileCards;