import AdminSidebar from '@/components/AdminSidebar'
import MonthlyLineChart from '@/components/MonthlyLineChart'


const AdminDashboard = () => {
  return (
    <div className='bg-slate-800 w-full min-h-screen'>
        <AdminSidebar/>
        <div className='ml-[22%] pt-[10vh]'>
            <h1 className='text-white ml-[5%] text-3xl'>Welcome 😊</h1>
            <MonthlyLineChart/>
        </div>
    </div>
  )
}

export default AdminDashboard