import LogoutButton from './LogOut';


export const Appbar = ({user}) => {
    const { firstname = 'User' } = user || {};

    return <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full ml-4 text-3xl font-semibold cursor-pointer">
          GlitchPay
        </div>
        <div className="flex">
            <div className="flex flex-col justify-center h-full mr-4">
                Hello {firstname}
            </div>
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {firstname.charAt(0)}
                </div>
            </div>
            <div className='flex flex-col justify-center mr-4 font-semibold mb-4 mt-4  p-2 rounded bg-red-300'>
                    <LogoutButton />
            </div>
        </div>
    </div>
}