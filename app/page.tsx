import PartsGuessGame from "@/components/parts-guess-game"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <PartsGuessGame />
      </div>
    </main>
  )
}
