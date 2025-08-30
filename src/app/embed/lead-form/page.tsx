import LeadForm from "@/components/lead-form"

export default function EmbedLeadFormPage() {
  return (
    <main className="mx-auto max-w-md p-4">
      <LeadForm source="embed" />
      <p className="mt-3 text-center text-xs text-muted-foreground">Powered by your lead form</p>
    </main>
  )
}
