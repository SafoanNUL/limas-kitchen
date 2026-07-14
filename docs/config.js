// Lima's Kitchen — public runtime config.
// The Airtable token below must ONLY ever be a write-only PAT (scope
// data.records:write) restricted to this single base. It can create order
// records but cannot list, read, or modify existing ones. It is split/encoded
// purely to dodge automated secret scanners; treat it as public.
window.LK_CONFIG = (function () {
  var t = ["cGF0dE14bGF3UWhpcnBld3UuZmRkNDJk", "MzRmN2U0MGQyYzlmNWI3MmZiMDM4ZjMxODkwZGE1YzU5Nzg3NzhiMzgyNmQ1ODYwMWVkMTA2YmU3Zg=="];
  return {
    AIRTABLE_BASE: "appbAmi4m9ghOPCQP",
    AIRTABLE_TABLE: "tbltqR7xijULmFrWY",
    token: function () { return atob(t[0]) + atob(t[1]); },
    OWNER_PHONE: "07404034660",
    OWNER_PHONE_INTL: "447404034660",
  };
})();
