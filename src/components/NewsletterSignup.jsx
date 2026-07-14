const BUTTONDOWN_USERNAME = 'PLACEHOLDER_USERNAME'

export default function NewsletterSignup() {
  return (
    <div className="w-full text-center sm:text-left">
      <h3 className="font-semibold mb-1">Get new posts in your inbox</h3>
      <p className="text-sm text-gray-500 mb-3">
        Occasional emails when I publish something new. No spam.
      </p>
      <form
        action={`https://buttondown.com/api/emails/embed-subscribe/${BUTTONDOWN_USERNAME}`}
        method="post"
        target="_blank"
        className="flex flex-wrap justify-center sm:justify-start gap-2"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="flex-1 min-w-[180px] rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white rounded-full px-5 py-2.5 text-sm hover:bg-purple-700 transition-colors"
        >
          Subscribe
        </button>
      </form>
    </div>
  )
}
