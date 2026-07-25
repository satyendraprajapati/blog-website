---
title: "Using the Morph Transition for Before-and-After Data Reveals in PowerPoint"
date: "2026-07-25"
tags: ["powerpoint", "data-storytelling", "beginner"]
excerpt: "How PowerPoint's Morph transition turns two nearly-identical slides into a smooth animated comparison, without building a single manual animation."
---

Showing a "before" number next to an "after" number side by side works, but it asks the audience to do the comparison themselves. Morph does the comparison visually — it smoothly animates the difference between two slides, which is a far more direct way to show growth, a shift in mix, or a before/after change than a static pair of charts.

**1. Morph needs two slides that are mostly the same.** Duplicate the "before" slide (right-click the thumbnail → *Duplicate Slide*) and edit only what changed on the copy — a bar's height, a number's value, an object's position. Morph animates the difference between matching objects across the two slides; it has nothing to work with if the slides are unrelated.

**2. Apply it from the Transitions tab, not Animations.** Select the second slide, go to *Transitions*, and choose *Morph*. This is a slide transition, not an object animation — there's nothing to configure per-object, which is exactly what makes it fast to set up.

**3. Objects need to match for Morph to link them.** PowerPoint matches objects between slides by name, position, or shape — an object nudged, resized, recolored, or retyped morphs smoothly, but an object deleted on one slide and a new one added on the other won't animate as a transformation between the two; it'll just cut. Check the *Selection Pane* on both slides if a shape isn't animating the way you expect.

**4. It works well on a stacked bar or single data point, not a whole redesigned chart.** Morph is most convincing when one or two things change — a bar growing taller, a callout number increasing, a highlighted segment shifting position. Rebuilding an entire chart's layout between two slides gives Morph too much to reconcile and the result looks more like a cut than a smooth transition.

**5. Grouped shapes morph as a group unless you need finer control.** If a chart title, bar, and label are grouped, Morph moves them together. Ungroup first if you specifically want, say, the label's font size to animate independently from the bar's height — otherwise the group's combined bounding box drives the whole transition.

**6. Preview it before presenting — Morph can look wrong on text reflow.** A text box that wraps differently after an edit (a longer number, a different label) can make Morph animate word positions in an odd way. *Slide Show → From Current Slide* and stepping to the Morph slide catches this before it's a surprise live.

**7. Use it sparingly across a deck.** Morph is striking the first time and expected the tenth — reserve it for the one or two comparisons in a deck that genuinely benefit from a smooth transformation (a headline metric changing quarter over quarter), rather than applying it to every consecutive slide pair.

Done well, Morph replaces a sentence like "as you can see, revenue grew from X to Y" with an audience watching the bar grow in front of them — which is a stronger way to make the same point land.
