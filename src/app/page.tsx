import LeadForm from "@/components/lead-form"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-3">
        <span className="inline-flex w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          New • Join the waitlist
        </span>
        <h1 className="text-pretty text-3xl font-semibold tracking-tight text-gray-900">
          Collect leads with a clean, mobile‑first form
        </h1>
        <p className="text-pretty text-gray-600">
          Simple landing page form that stores leads securely. Export to Excel and copy single or all leads from an
          admin view.
        </p>
        <div className="mt-1">
          <a href="/admin">
            <Button variant="link" className="p-0 text-blue-600">
              Go to Admin →
            </Button>
          </a>
        </div>
      </header>

      <section>
        <LeadForm />
      </section>

      <footer className="mt-6 text-center text-xs text-gray-600">Built for clarity and speed. No spam, ever.</footer>
    </main>
  )
}
