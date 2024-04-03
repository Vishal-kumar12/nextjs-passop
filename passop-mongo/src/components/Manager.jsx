import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setpasswordArray] = useState([])


    const getPassword = async () => {
        let req = await fetch("http://localhost:3000")
        let passwords = await req.json()
        console.log(passwords)
        setpasswordArray(passwords)
    }

    useEffect(() => {
        getPassword()
    }, [])


    const showPassword = () => {
        passwordRef.current.type = "text"
        if (ref.current.src.includes("/eyecross.png")) {
            ref.current.src = "/eye.png"
            passwordRef.current.type = "password"

        }

        else {
            ref.current.src = "/eyecross.png"
            passwordRef.current.type = "text"

        }
    }

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            setpasswordArray([...passwordArray, { ...form, id: uuidv4() }])
    
            
            await fetch("http://localhost:3000", {
                method: "DELETE", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: form.id })
            })



            await fetch("http://localhost:3000", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, id: uuidv4() })
            })
            // localStorage.setItem("passwords", JSON.stringify([...passwordArray, { ...form, id: uuidv4() }]))
            // console.log([...passwordArray, form])

            setform({ site: "", username: "", password: "" })

            toast('Password Saved Succesfully!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",

            });
        }

        else {
            toast('Error: Password Not Saved!');
        }
    }

    const deletePassword = async (id) => {
        console.log("Deleting password with ID " + id)
        let c = confirm("Do you really want to delete this password?")

        if (c) {
            setpasswordArray(passwordArray.filter(item => item.id !== id))
            // localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item => item.id !== id)))

            await fetch("http://localhost:3000", {
                method: "DELETE", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            })

            toast('Password Deleted Succesfully!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",

            });
        }
    }



    const editPassword = (id) => {
        console.log("Edit password with ID " + id)
        setform({...passwordArray.filter(i => i.id === id)[0], id: id})
        setpasswordArray(passwordArray.filter(item => item.id !== id))



    }

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })

    }


    const copyText = (text) => {
        toast('Copied to clipboard', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",

        });
        navigator.clipboard.writeText(text)

    }


    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition="Bounce"
            />
            {/* Same as */}
            <ToastContainer />




            {/* <div class="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div> */}


            <div className="absolute top-0 z-[-2] h-screen w-screen bg-green-250 bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>

            <div className="p-3 md:mycontainer min-h-[81vh]">
                <h1 className="text-4xl text font-bold text-center">
                    <span className='text-green-500'>&lt;</span>
                    Pass
                    <span className='text-green-500'>OP&gt;</span>
                </h1>
                <p className='text-green-900 text-lg text-center'>your own Password Manager</p>

                <div className="flex flex-col p-4 text-black gap-8 items-center">
                    <input value={form.site} onChange={handleChange} placeholder='Enter Website URL' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name='site' />
                    <div className="flex flex-col md:flex-row w-full justify-between gap-8">
                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name='username' />

                        <div className='relative'>
                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-green-500 w-full p-4 py-1' type="password" name='password' />

                            <span className="absolute right-[3px] top-[4px] cursor-pointer" onClick={showPassword}>
                                <img ref={ref} className='p-1' width={26} src="/eye.png" alt="eye" />
                            </span>

                        </div>

                    </div>

                    <button onClick={savePassword} className='flex justify-center items-center gap-2 bg-green-400 rounded-full px-8 py-2 w-fit hover:bg-green-300 border border-green-900'>
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover">
                        </lord-icon>
                        Save</button>
                </div>


                <div className="passwords">
                    <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
                    {passwordArray.length === 0 && <div> No Passwords to show</div>}
                    {passwordArray.length !== 0 && <table className="table-auto w-full rounded-md overflow-hidden mb-10">
                        <thead className='bg-green-800 text-white'>
                            <tr>
                                <th className='py-2'>Site</th>
                                <th className='py-2'>Username</th>
                                <th className='py-2'>Password</th>
                                <th className='py-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='bg-green-100'>
                            {passwordArray.map((item, index) => {
                                return <tr key={index}>
                                    <td className='py-2 border border-white text-center'>
                                        <div className='flex justify-center items-center '>
                                            <a href={item.site} target='_blank'>{item.site}</a>

                                            <div className='lordiconcopy size-7 cursor-pointer ' onClick={() => copyText(item.site)}>
                                                <img className='10' style={{ "paddingTop": "3px", "paddingLeft": "3px" }} width={20} src="/copy.png" alt="" />

                                            </div>
                                        </div>

                                    </td>

                                    <td className='py-2 border border-white text-center'>
                                        <div className="flex justify-center items-center">
                                            {item.username}
                                            <div className='lordiconcopy size-7 cursor-pointer ' onClick={() => copyText(item.username)}>
                                                <img className='10' style={{ "paddingTop": "3px", "paddingLeft": "3px" }} width={20} src="/copy.png" alt="" />
                                            </div>
                                        </div>
                                    </td>


                                    <td className='py-2 border border-white text-center'>
                                        <div className="flex justify-center items-center">
                                            {"*".repeat(item.password.length)}
                                            <div className='lordiconcopy size-7 cursor-pointer ' onClick={() => copyText(item.password)}>
                                                <img className='10' style={{ "paddingTop": "3px", "paddingLeft": "3px" }} width={20} src="/copy.png" alt="" />
                                            </div>
                                        </div>
                                    </td>


                                    <td className='py-2 border border-white text-center'>
                                        <div className="flex justify-center items-center">
                                            <span className='cursor-pointer mx-2' onClick={() => editPassword(item.id)}>
                                                <img style={{ "width": "25px", "height": "25px" }} src="/edit.png" alt="" />
                                            </span>

                                            <span className='cursor-pointer mx-2' onClick={() => deletePassword(item.id)}>
                                                <img style={{ "width": "25px", "height": "25px" }} src="/delete.png" alt="" />
                                            </span>

                                        </div>
                                    </td>
                                </tr>

                            })}

                        </tbody>
                    </table>}
                </div>
            </div>

        </>
    )
}

export default Manager
