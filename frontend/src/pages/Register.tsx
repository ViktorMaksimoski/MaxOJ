import { ArrowLeftIcon, LockIcon, MailIcon, UserIcon } from 'lucide-react'
import { Link } from 'react-router'

export const Register = () => {
  return (
    <div className='flex gap-0 min-h-screen w-full'>
        <div className='flex-1'>
            <p>Baba</p>
        </div>
        <div className='text-center flex-1 bg-slate-50'>
            <div className="flex justify-between items-center ml-10 mr-10 mt-6">
                <Link to={'/'} className='font-semibold text-base flex items-center'>
                    <ArrowLeftIcon /> Назад
                </Link>
                <Link to={'/login'} className='font-semibold text-base'>
                    <button className='border outline-none bg-transparent border-blue-600 rounded-sm shadow-sm px-3 py-1.5
                    text-blue-600'>
                        Најава
                    </button>
                </Link>
            </div>
            <p className='text-xl font-semibold tracking-wide mt-28'>Регистрирајте нов корисник</p>
            <form action="">
                <div className='shadow-sm mx-auto flex items-center mt-4 bg-white border-blue-400 hover:border-blue-600 border w-4/5 rounded-md'>
                    <span className='pl-4 text-gray-400'><UserIcon /></span>
                    <input type="text" 
                    placeholder='Petko_123'
                    className='bg-transparent outline-none border-none w-full pl-3 py-2.5'/>
                </div>
                <div className='shadow-sm mx-auto flex items-center mt-4 bg-white border-blue-400 hover:border-blue-600 border w-4/5 rounded-md'>
                    <span className='pl-4 text-gray-400'><MailIcon /></span>
                    <input type="email" 
                    placeholder='johndoe@mail.com'
                    className='bg-transparent outline-none border-none w-full pl-3 py-2.5'/>
                </div>
                <div className='shadow-sm mx-auto flex items-center mt-4 bg-white border-blue-400 hover:border-blue-600 border w-4/5 rounded-md'>
                    <span className='pl-4 text-gray-400'> <LockIcon /> </span>
                    <input type="password" 
                    placeholder='Внесете лозинка (мин. 8 знаци)'
                    className='bg-transparent outline-none border-none w-full pl-3 py-2.5'/>
                </div>
                <button type="submit"
                className='bg-blue-600 shadow-sm text-white px-8 py-2.5 mt-8 text-md font-semibold
                hover:bg-blue-700 rounded-md'>Потврдете</button>
            </form>
        </div>
    </div>
  )
}
