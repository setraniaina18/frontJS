import React, { useEffect, useState } from 'react'
import './Login.css'
import { Button, InputAdornment, TextField, duration } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import EmailIcon from '@mui/icons-material/Email';
import HttpsIcon from '@mui/icons-material/Https';
import { motion } from 'framer-motion';
import { Succes } from '../../components/succes/Succes'
import { Erreur } from '../../components/erreur/Erreur'



export function Login() {

    const [mail, setMail] = useState('');
    const [mdp, setMdp] = useState('');

    const [listeAdmin, setListeAdmin] = useState([]);


    const navigate = useNavigate();



    const recupAdmin = async () => {
        try {
            const res = await axios.get('http://localhost:3723/api/login')
            setListeAdmin(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        recupAdmin()
    }, [])

    function login() {
        listeAdmin.map((adm) => {
            if (mdp === adm.mdp && mail === adm.mail) {
                sessionStorage.setItem('connecte', 'true');
                setIsSuccesLog(true);
                setTimeout(() => {
                    navigate('/dashboard');
                }, 500);
            } else {
                setIsErreurLog(true);
            }
        })
    }

    const [isSuccesLog, setIsSuccesLog] = useState(false);
    const [isErreurLog, setIsErreurLog] = useState(false);
    useEffect(()=>{
        setTimeout(() => {
            setIsErreurLog(false);
            setIsSuccesLog(false);
        }, 4000);
    }, [isErreurLog, isSuccesLog])

    return (
        <div className='login'>

            {isSuccesLog &&
                <Succes />

            }

            {isErreurLog &&
                <Erreur />

            }
            <div className='formP'>
                <motion.div className='leftForm'


                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                >
                    <img src="/clock.png" alt="img" className='imageL' />
                </motion.div>
                <motion.form className='form'

                    initial={{ x: 300 }}
                    animate={{ x: 0 }}
                >
                    <h2>Authentification</h2>
                    <div>
                        <TextField
                            name='mail' className='inputLog' label="E-mail"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon className='mailIcon' />
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                            onChange={e => setMail(e.target.value)}
                        />
                    </div>
                    <div>
                        <TextField
                            name='mdp' className='inputLog' label="Mot de passe" type='password' autoComplete="current-password"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <HttpsIcon className='mdpIcon' />
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                            onChange={e => setMdp(e.target.value)}
                        />
                    </div>

                    <Button
                        variant="contained"
                        size="medium"
                        color="primary"
                        onClick={() => {
                            login();
                        }}
                    >
                        Se connecter
                    </Button>

                </motion.form>

            </div>
        </div>
    )
}
