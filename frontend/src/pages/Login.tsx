import { ArrowLeftIcon, MailIcon, LockIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

export const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const loginUser = async (e) => {
        e.preventDefault()
        let errors: string = ""

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email))
            errors += "Мора да внесете валиден емаил\n"

        if(password.length < 3 || password.length > 20)
            errors += "Лозинката мора да име меѓу 3 и 20 знаци\n"

        if(errors !== "") {
            toast.error(errors)
            return ;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate('/')
        } catch(err) {
            console.log(err)
            toast.error('Не може да се најавите!\nПроверете дали внесовте точни информации!')
        }
    }

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
                <Link to={'/register'} className='font-semibold text-base'>
                    <button className='border outline-none bg-transparent border-blue-600 rounded-sm shadow-sm px-3 py-1.5
                    text-blue-600'>
                        Регистрација
                    </button>
                </Link>
            </div>
            <p className='text-xl font-semibold tracking-wide mt-28'>Најавете се</p>
            <form action="">
                <div className='shadow-sm mx-auto flex items-center mt-4 bg-white border-blue-400 hover:border-blue-600 border w-4/5 rounded-md'>
                    <span className='pl-4 text-gray-400'><MailIcon /></span>
                    <input type="email" 
                    placeholder='johndoe@mail.com'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className='bg-transparent outline-none border-none w-full pl-3 py-2.5'/>
                </div>
                <div className='shadow-sm mx-auto flex items-center mt-4 bg-white border-blue-400 hover:border-blue-600 border w-4/5 rounded-md'>
                    <span className='pl-4 text-gray-400'> <LockIcon /> </span>
                    <input type="password" 
                    placeholder='Внесете лозинка (мин. 8 знаци)'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className='bg-transparent outline-none border-none w-full pl-3 py-2.5'/>
                </div>
                <button type="submit"
                className='bg-blue-600 shadow-sm text-white px-8 py-2.5 mt-8 text-md font-semibold
                hover:bg-blue-700 rounded-md'
                onClick={(e) => loginUser(e)}>Потврдете</button>
            </form>
        </div>
    </div>
  )
}
