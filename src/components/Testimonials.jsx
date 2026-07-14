import { Quote, Star, Info } from 'lucide-react'

const testimonials = [
  {
    quote:
      "The dashboard replaced a report we used to build by hand every month. It just refreshes now, and we can finally see trends we were missing before.",
    name: 'Priya S.',
    role: 'Operations Manager, Retail Business',
  },
  {
    quote:
      "Communication was clear from day one, and the automation just works — it's saved our team hours every week without us having to think about it.",
    name: 'Michael T.',
    role: 'Owner, Logistics Company',
  },
  {
    quote:
      "Our old site was a pain to update. The new one is fast, looks great on mobile, and I can edit the content myself now.",
    name: 'Ayesha K.',
    role: 'Marketing Lead, Small Business',
  },
]

export default function Testimonials() {
  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-center">What Clients Say</h2>

      <div className="flex items-start gap-2 text-sm bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 rounded-lg px-4 py-3 mt-4">
        <Info size={16} className="mt-0.5 shrink-0" />
        Sample testimonials — replace with real client feedback once you have some to share.
      </div>

      <div className="grid gap-6 sm:grid-cols-3 mt-6">
        {testimonials.map(({ quote, name, role }) => (
          <div
            key={name}
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 text-left flex flex-col"
          >
            <Quote size={20} className="text-purple-400" />
            <div className="flex gap-0.5 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className="text-purple-500 fill-purple-500" />
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 flex-1">"{quote}"</p>
            <p className="mt-4 text-sm font-semibold">{name}</p>
            <p className="text-xs text-gray-500">{role}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
