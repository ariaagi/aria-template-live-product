import { HomeShell } from "@/components/app/home-shell";

export default function HomePage() {
  return (
    <HomeShell>
      <section className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Home is empty. Agents can build features here.</p>
      </section>
    </HomeShell>
  );
}
