import React from 'react';
import { copyJSON } from "../../../Utils/Supervisor-Utils/SupervisorAuditLogsExportUtils";
import { TABLE_COLUMN_COUNT, AUDITLOG_MESSAGES_LENGTH } from "../../../Data/Global_variables";

const tableHeaders = ['Time', 'Action', 'User', 'Account#', 'Message', 'Details'];

const SupervisorAuditLogsTable = ({ logs, loading, expandedId, setExpandedId }) => {
    if (loading) return <p className="p-4 text-center text-[var(--nav-text)]">Loading…</p>;

    return (
        <div className="p-2 rounded border bg-[var(--nav-bg)] border-[var(--nav-text)]">
            <table className="min-w-full table-auto font-bold text-sm text-[var(--nav-text)] text-center">
                <thead>
                    <tr>
                        {tableHeaders.map(h => (
                            <th key={h} className="p-2 text-xl border-b border-[var(--nav-text)] text-center duration-300 transition-colors">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {logs.length === 0 ? (
                        <tr><td colSpan={TABLE_COLUMN_COUNT} className="p-4 text-center">No logs</td></tr>
                    ) : (
                        logs.map(log => {
                            const logId = log._id || log.id || Math.random();
                            const isExpanded = expandedId === logId;
                            return (
                                <React.Fragment key={logId}>
                                    <tr className="align-top border-t hover:bg-[var(--nav-highlight)]">
                                        <td className="p-2 align-top text-sm duration-300 transition-colors">{new Date(log.createdAt || log.date || log._id).toLocaleString()}</td>
                                        <td className="p-2 font-mono text-sm duration-300 transition-colors">{log.action}</td>
                                        <td className="p-2 text-sm duration-300 transition-colors">{log.userName || log.userId || '-'}</td>
                                        <td className="p-2 text-sm duration-300 transition-colors">{log.accountNumber || '-'}</td>
                                        <td className="p-2 text-sm max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap duration-300 transition-colors" title={log.message}>
                                            {(log.message && log.message.length > AUDITLOG_MESSAGES_LENGTH) ? log.message.slice(0, AUDITLOG_MESSAGES_LENGTH) + '…' : log.message || '-'}
                                        </td>
                                        <td className="p-2 text-sm">
                                            <div className="flex gap-2 justify-center">
                                                <button onClick={() => setExpandedId(isExpanded ? null : logId)} className="px-2 py-1 border rounded text-xs bg-[var(--nav-text)] hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] text-[var(--nav-bg)] hover:border hover:border-[var(--nav-hover)] shadow-md transition-all duration-300">
                                                    {isExpanded ? 'Hide' : 'View'}
                                                </button>
                                                <button onClick={() => copyJSON(log)} className="px-2 py-1 border rounded text-xs bg-[var(--nav-text)] hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] text-[var(--nav-bg)] hover:border hover:border-[var(--nav-hover)] shadow-md transition-all duration-300">Copy</button>
                                            </div>
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr className="bg-[var(--nav-bg)]">
                                            <td colSpan={TABLE_COLUMN_COUNT} className="p-3 font-mono text-xs whitespace-pre-wrap max-h-60 overflow-auto border-t text-left">
                                                {JSON.stringify(log, null, 2)}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SupervisorAuditLogsTable;