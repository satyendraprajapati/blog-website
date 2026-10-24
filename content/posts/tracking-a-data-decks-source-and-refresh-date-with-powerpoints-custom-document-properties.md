---
title: "Tracking a Data Deck's Source and Refresh Date with PowerPoint's Custom Document Properties"
date: "2026-10-24"
tags: ["powerpoint", "data-analysis", "beginner"]
excerpt: "A place to record a deck's data source, refresh date, and approval status that doesn't clutter the slides themselves, hiding in File > Info instead."
---

Putting "data as of March 3" in small text on every slide works, but it only answers the question a viewer already thought to ask while looking at that one slide. For the questions that come up later — which exact data pull did this number come from, who signed off on it, is this the version that went to the client — PowerPoint already has a place to record that, separate from the slides: the document properties panel under *File → Info*.

**1. Fill in the standard properties before you fill in anything custom.** *File → Info → Properties → Show All Properties* shows Title, Author, Company, and Comments. Setting these isn't just metadata hygiene — a deck's Title and Comments show up when someone searches for it in SharePoint or in Windows Explorer's file list, which matters once a shared drive has forty similarly named decks in it.

**2. Add a custom property for the data's source and refresh date.** Under *File → Info → Properties → Advanced Properties → Custom*, add a property — name it `DataSource`, give it the Text type, and set the value to something like `CRM export, pulled 2026-10-24`. Add a second one, `RefreshDate`, as a Date type. Neither appears anywhere on the slide canvas, so it never competes for space with your actual content, but it travels with the file everywhere the file goes.

**3. Add an `ApprovalStatus` property instead of a watermark that has to be manually removed later.** A text property set to `Draft — not for distribution` or `Approved — Sept 2026 board meeting` answers the single most common question asked about a circulating deck, without needing a DRAFT watermark stamped across every slide that someone inevitably forgets to strip out before sending the final version.

**4. Check properties from Windows Explorer without opening the file at all.** Once set, these custom properties show up as columns you can add in File Explorer's *Details* view (right-click a column header → *More...* → find your custom property name), which means a reviewer can sort a folder of decks by `RefreshDate` or filter to only `Approved` ones before opening a single file.

**5. Pull a property into a slide with a field code, if you do want it visible after all.** *Insert → Text Box*, then *Insert → Date & Time* won't reach custom properties, but *Insert → Object* isn't needed either — a simpler route for teams that want it on-slide too is just typing the value once in the custom property and once on the slide; PowerPoint doesn't auto-link custom properties into slide text the way Word does with document properties, so treat the properties panel as the system of record and the slide text as a manually-kept, human-readable echo of it.

**6. Update the properties as part of your refresh checklist, not as an afterthought.** The whole point breaks down if `RefreshDate` says August while the chart on slide 12 reflects September's numbers. Add "update Advanced Properties" as the last step in whatever process already regenerates your charts, right next to updating the on-slide "data as of" note, so the two can't drift apart.

**7. Strip sensitive custom properties before sending a deck externally.** The Document Inspector (covered in an earlier post on removing hidden data from a deck) also flags document properties and personal information — run it before sending a deck outside your organization, since an internal note like `DataSource: pulled from HR system, see Sarah` is exactly the kind of detail that shouldn't leave the building with the file.

None of this is visible to an audience watching a presentation, which is the point — it's a place to keep the bookkeeping a deck needs without turning every slide's footer into a changelog.
