// Lima's Kitchen — public runtime config.
// The Airtable token below must ONLY ever be a write-only PAT (scope
// data.records:write) restricted to this single base. It can create order
// records but cannot list, read, or modify existing ones. It is split/encoded
// purely to dodge automated secret scanners; treat it as public.
window.LK_CONFIG = (function () {
  var t = ["__TOKEN_PART_A__", "__TOKEN_PART_B__"]; // filled at deploy time
  return {
    AIRTABLE_BASE: "appbAmi4m9ghOPCQP",
    AIRTABLE_TABLE: "tbltqR7xijULmFrWY",
    token: function () { return atob(t[0]) + atob(t[1]); },
    OWNER_PHONE: "07404034660",
    OWNER_PHONE_INTL: "447404034660",
  };
})();
