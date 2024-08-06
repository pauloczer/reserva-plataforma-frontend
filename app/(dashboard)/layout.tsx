// src/dashboard/layout/index.tsx
import { getServerSession } from 'next-auth';
import Navbar from '../../components/Navbar';
import { nextAuthOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {

      const session = await getServerSession(nextAuthOptions)

    if(!session){
        redirect('/')
    }
  return (
    <div>
      <Navbar />
      <main className="p-4">{children}</main>
    </div>
  );
};

export default DashboardLayout;
