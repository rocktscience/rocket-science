// app/dashboard/contracts/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { FileText, Download, Eye } from 'lucide-react';

export default async function ContractsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/login');

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role === 'viewer') {
    redirect('/dashboard');
  }

  // Fetch contracts
  const { data: contracts } = await supabase
    .from('contracts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Contracts
          </span>
        </h1>
        <p className="mt-2 text-gray-600">
          View and manage your distribution and publishing agreements
        </p>
      </div>

      {/* Contracts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contracts?.map((contract) => (
          <div key={contract.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <FileText className="h-10 w-10 text-gray-400" />
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                ${contract.status === 'active' ? 'bg-green-100 text-green-800' : 
                  contract.status === 'expired' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'}`}>
                {contract.status}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {contract.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {contract.type === 'distribution' ? 'Distribution Agreement' : 'Publishing Agreement'}
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Start: {new Date(contract.start_date).toLocaleDateString()}</p>
              <p>End: {new Date(contract.end_date).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t">
              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition">
                <Eye className="h-4 w-4" />
                View
              </button>
              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition">
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {(!contracts || contracts.length === 0) && (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No contracts found</p>
        </div>
      )}
    </div>
  );
}