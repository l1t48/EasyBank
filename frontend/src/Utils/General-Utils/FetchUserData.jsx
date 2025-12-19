import { API } from "../../Services/APIs";

const nameCache = new Map();
const accountNumberCache = new Map();
const targetNameCache = new Map();

export async function getUserFullNamesByAccountNumbers(accountNumbers) {
  if (!Array.isArray(accountNumbers) || accountNumbers.length === 0) return [];

  const uncached = accountNumbers.filter((acc) => !targetNameCache.has(acc));

  if (uncached.length > 0) {
    try {
      const res = await fetch(API.general.namesByAccounts, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ accountNumbers: uncached }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        console.error("getUserFullNamesByAccountNumbers error:", data.error || "Unknown error");
      } else {
        (data.results || []).forEach((item) => {
          targetNameCache.set(item.accountNumber, item);
        });
      }
    } catch (err) {
      console.error("getUserFullNamesByAccountNumbers fetch error:", err);
    }
  }

  return accountNumbers.map((acc) => targetNameCache.get(acc) || { accountNumber: acc, fullName: "Unknown User", found: false });
}

export async function getUserFullNameById(userId) {
  if (!userId) return null;

  if (nameCache.has(userId)) {
    return nameCache.get(userId);
  }

  try {
    const res = await fetch(API.general.name(userId), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      console.error("getUserFullNameById error:", data.error || "Unknown error");
      return null;
    }

    const result = {
      id: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: data.fullName,
    };

    nameCache.set(userId, result);

    return result;
  } catch (err) {
    console.error("getUserFullNameById fetch error:", err);
    return null;
  }
}


export async function getUserFullNamesByIds(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return [];

  const uniqueIds = [...new Set(ids)];

  const uncachedIds = uniqueIds.filter((id) => !nameCache.has(id));

  if (uncachedIds.length > 0) {
    try {
      const res = await fetch(API.general.names, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ids: uncachedIds }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error("getUserFullNamesByIds error:", data.error || "Unknown error");
      } else {
        (data.results || []).forEach((item) => {
          if (item.found) {
            const value = {
              id: item.id,
              firstName: item.firstName,
              lastName: item.lastName,
              fullName: item.fullName,
            };
            nameCache.set(item.id, value);
          } else {
            nameCache.set(item.id, null);
          }
        });
      }
    } catch (err) {
      console.error("getUserFullNamesByIds fetch error:", err);
    }
  }

  return ids.map((id) => {
    const cached = nameCache.get(id) || null;

    if (!cached) {
      return {
        id,
        firstName: null,
        lastName: null,
        fullName: null,
        found: false,
      };
    }

    return {
      id,
      firstName: cached.firstName,
      lastName: cached.lastName,
      fullName: cached.fullName,
      found: true,
    };
  });
}

export async function getAccountNumberById(userId) {
  if (!userId) return null;

  if (accountNumberCache.has(userId)) {
    const cached = accountNumberCache.get(userId);
    if (!cached) return null;
    return { id: userId, accountNumber: cached };
  }

  try {
    const res = await fetch(API.general.accountNumber(userId), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      console.error(
        "getAccountNumberById error:",
        data.error || "Unknown error"
      );
      accountNumberCache.set(userId, null);
      return null;
    }

    const result = {
      id: data.userId,
      accountNumber: data.accountNumber,
    };

    accountNumberCache.set(userId, data.accountNumber);

    return result;
  } catch (err) {
    console.error("getAccountNumberById fetch error:", err);
    return null;
  }
}


export async function getAccountNumbersByIds(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return [];

  const uniqueIds = [...new Set(ids)];

  const uncachedIds = uniqueIds.filter((id) => !accountNumberCache.has(id));

  if (uncachedIds.length > 0) {
    try {
      const res = await fetch(API.general.accountNumbers, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ids: uncachedIds }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error(
          "getAccountNumbersByIds error:",
          data.error || "Unknown error"
        );
      } else {
        (data.results || []).forEach((item) => {
          if (item.found) {
            accountNumberCache.set(item.id, item.accountNumber);
          } else {
            accountNumberCache.set(item.id, null);
          }
        });
      }
    } catch (err) {
      console.error("getAccountNumbersByIds fetch error:", err);
    }
  }

  return ids.map((id) => {
    const cached = accountNumberCache.get(id);

    if (!cached) {
      return {
        id,
        accountNumber: null,
        found: false,
      };
    }

    return {
      id,
      accountNumber: cached,
      found: true,
    };
  });
}

export function clearAccountNumberCache() {
  accountNumberCache.clear();
}


export function clearTargetNameCache() {
  targetNameCache.clear();
}

export function clearUserNameCache() {
  nameCache.clear();
}
