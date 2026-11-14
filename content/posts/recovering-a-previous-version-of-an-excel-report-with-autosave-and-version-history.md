---
title: "Recovering a Previous Version of an Excel Report with AutoSave and Version History"
date: "2026-11-14"
tags: ["excel", "data-analysis", "productivity", "beginner"]
excerpt: "When AutoSave overwrites a report with a bad edit, Excel's Version History on OneDrive or SharePoint lets you reopen and restore an earlier draft instead."
---

AutoSave is a relief until the moment it isn't: a teammate deletes a table, a formula gets overwritten mid-review, or you realize the clean version you wanted is simply gone, because AutoSave already saved over it. The fix isn't to turn AutoSave off — it's to know that every one of those saves left a recoverable copy behind.

**1. Version History only works on files stored in OneDrive or SharePoint.** AutoSave and Version History are two halves of the same feature — AutoSave constantly writes the current state, and Version History keeps snapshots of what the file looked like at each of those saves. A workbook saved to a local drive or a network share outside OneDrive/SharePoint doesn't get this safety net, which is itself a reason to move shared reports there.

**2. Open it from File > Info > Version History.** This lists every saved version with a timestamp and, where available, who made the edit. You don't have to guess which one is right before committing — each entry opens in a separate read-only preview window alongside your current file.

**3. Preview before you restore.** Clicking a version opens it next to your live workbook so you can check a specific sheet or cell range before deciding anything. This matters because "an hour ago" and "the version before lunch" aren't always the one you actually want — the preview lets you confirm the data, not just the timestamp.

**4. Restore replaces the current file — it doesn't merge.** Clicking **Restore** on an older version makes it the new current version, and today's current version becomes a prior entry in the history instead of disappearing. If you only need to recover one table rather than the whole workbook, copy it out of the preview window and paste it into your live file instead of restoring the entire thing.

**5. The same history is reachable from OneDrive/SharePoint in a browser, not just inside Excel.** If Excel itself is misbehaving, or you want to check history without opening the file at all, right-click the file in the OneDrive web interface and choose **Version History** there. This also works for recovering a file after the desktop app crashed mid-save.

**6. It's a longer window than the Recycle Bin, but not infinite.** OneDrive and SharePoint typically retain a large number of versions, but very old ones can eventually be pruned depending on your organization's retention settings. For a report you'll need to audit months later, export or duplicate the key version rather than relying on history alone.

**7. It's different from AutoRecover's "Document Recovery" pane.** AutoRecover deals with unsaved changes after a crash, restoring a draft Excel hadn't saved yet. Version History deals with changes that *were* saved — including bad ones. Knowing which problem you have tells you where to look first instead of hunting through the wrong recovery flow.

The next time a shared report comes back wrong, there's usually no need to rebuild it from memory or ask around for an old copy — the version you want is most likely still sitting in the file's own history, a few clicks away.
