import React from "react";
import { copyJSON } from '../../../Utils/Admin-Utils/AdminAuditLogsExportUtils'; 
import { JSON_INDENT_SPACES, TABLE_COLUMN_COUNT, MESSAGE_PREVIEW_LENGTH } from "../../../Data/Global_variables";

function AdminAuditLogsTable({ log, expandedId, toggleExpandedId }) {
    const logId = log._id || log.id;
    const isExpanded = expandedId === logId;
    return (
        <React.Fragment>
            <tr className="align-top border-t hover:bg-[var(--nav-highlight)]">
                <td className="p-2 align-top text-sm duration-300 transition-colors">{new Date(log.createdAt || log.date || log._id).toLocaleString()}</td>
                <td className="p-2 font-mono text-sm duration-300 transition-colors">{log.action}</td>
                <td className="p-2 text-sm duration-300 transition-colors">{log.userName || log.userId || '-'}</td>
                <td className="p-2 text-sm duration-300 transition-colors">{log.accountNumber || '-'}</td>
                <td className="p-2 text-sm duration-300 transition-colors">{(log.message && log.message.length > MESSAGE_PREVIEW_LENGTH) ? log.message.slice(0, MESSAGE_PREVIEW_LENGTH) + '…' : log.message || '-'}</td>
                <td className="p-2 text-sm duration-300 transition-colors">
                    <div className="flex gap-2 justify-center">
                        <button 
                            onClick={() => toggleExpandedId(logId)} 
                            className="px-2 py-1 border rounded text-xs bg-[var(--nav-text)] hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] text-[var(--nav-bg)] hover:border hover:border-[var(--nav-hover)] shadow-md transition-all duration-300"
                        >
                            {isExpanded ? 'Hide' : 'View'}
                        </button>
                        <button 
                            onClick={() => copyJSON(log)} 
                            className="px-2 py-1 border rounded text-xs bg-[var(--nav-text)] hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] text-[var(--nav-bg)] hover:border hover:border-[var(--nav-hover)] shadow-md transition-all duration-300"
                        >
                            Copy
                        </button>
                    </div>
                </td>
            </tr>
            {isExpanded && (
                <tr className="bg-[var(--nav-bg)]">
                    <td colSpan={TABLE_COLUMN_COUNT} className="p-3 font-mono text-xs whitespace-pre-wrap max-h-60 overflow-auto border-t text-left">
                        {JSON.stringify(log, null, JSON_INDENT_SPACES)}
                    </td>
                </tr>
            )}
        </React.Fragment>
    );
}

export default AdminAuditLogsTable;