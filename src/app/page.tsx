import { supabase } from '@/lib/supabaseClient'

export default async function Home() {
  const { data: items, error } = await supabase
    .from('test_items')
    .select('*')

  if (error) {
    console.error('Supabase error:', error)
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Error connecting to Supabase</h1>
        <p>{error.message}</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">DBDC Website – Setup Success</h1>
      <h2 className="text-xl mb-2">Data from Supabase:</h2>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(items, null, 2)}</pre>
    </div>
  )
}